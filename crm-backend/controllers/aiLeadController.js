const axios = require('axios');
const Customer = require('../models/Customer');
const GEMINI_API_KEY = 'AIzaSyB3Ye169__OoO6V3sex6k5LJ3g0OYKhBtw';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Helper function to create a lead with proper structure
async function createLead(leadData, userId = null) {
  const lead = new Customer({
    ...leadData,
    status: 'Untouched',
    leadSource: leadData.leadSource || 'AI Generated',
    user: userId || 'default-user',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return await lead.save();
}

// Generate leads using AI
const generateLeads = async (req, res) => {
    try {
        const { location, businessType } = req.body;

        // Call Gemini API with a more structured prompt
        const prompt = `Generate exactly 3 fake customer leads for a ${businessType} business in ${location}.
        
        IMPORTANT: You must return ONLY a valid JSON array of objects with these exact keys:
        - name: String (Indian full name)
        - email: String (professional email based on name)
        - phone: String (10-digit Indian phone number starting with 6-9)
        - notes: String (1-2 sentences about their needs)
        
        The response must be a valid JSON array that starts with [ and ends with ].
        Do not include any other text, explanations, or markdown formatting.
        
        Example of valid response:
        [
          {
            "name": "Rahul Sharma",
            "email": "rahul.sharma@example.com",
            "phone": "9876543210",
            "notes": "Interested in premium membership options."
          },
          {
            "name": "Priya Patel",
            "email": "priya.patel@example.com",
            "phone": "8123456789",
            "notes": "Looking for family membership plans."
          },
          {
            "name": "Amit Singh",
            "email": "amit.singh@example.com",
            "phone": "7890123456",
            "notes": "Interested in personal training sessions."
          }
        ]`;

        console.log('Sending request to Gemini API with prompt:', prompt);
        
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json'
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 30000 // 30 seconds timeout
            }
        );

        console.log('Gemini API response received:', JSON.stringify(response.data, null, 2));

        if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
            console.error('Invalid Gemini API response structure:', response.data);
            return res.status(500).json({ 
                error: 'Invalid response from AI service',
                details: 'Unexpected response format from Gemini API'
            });
        }

        // Handle Gemini API response
        let generatedText = '';
        
        try {
            // Debug log the full response
            console.log('Full Gemini API response:', JSON.stringify(response.data, null, 2));
            
            // Extract text from the Gemini response
            const candidate = response.data.candidates?.[0];
            if (!candidate) {
                throw new Error('No candidates in the response');
            }
            
            // Handle different possible response structures
            if (candidate.content?.parts?.[0]?.text) {
                generatedText = candidate.content.parts[0].text;
            } else if (candidate.text) {
                generatedText = candidate.text;
            } else if (candidate[0]?.text) {
                // Handle array response format
                generatedText = candidate[0].text;
            } else {
                // Try to stringify the first candidate for debugging
                console.error('Unexpected response structure:', JSON.stringify(candidate, null, 2));
                throw new Error('Could not extract text from the response');
            }
            
            console.log('Extracted generated text:', generatedText.substring(0, 100) + '...');
        } catch (error) {
            console.error('Error processing Gemini API response:', error);
            return res.status(500).json({
                error: 'Error processing AI service response',
                details: error.message,
                response: response.data
            });
        }
        
        // Clean and parse the JSON response
        let generatedLeads;
        try {
            console.log('Raw generated text before cleaning:', generatedText);
            
            // Clean the response text
            let cleanText = generatedText.trim();
            
            // Remove markdown code block markers if present
            cleanText = cleanText.replace(/^```(?:json)?\n|\n```$/g, '');
            
            // Try to fix common JSON formatting issues
            cleanText = cleanText
                // Fix missing quotes around property names
                .replace(/([{\s,])(\w+)(\s*:)/g, '$1"$2"$3')
                // Fix single quotes to double quotes
                .replace(/'/g, '"')
                // Remove trailing commas
                .replace(/,\s*}/g, '}')
                .replace(/,\s*]/g, ']');
                
            console.log('Cleaned text before JSON parse:', cleanText);
            
            // Parse the JSON
            generatedLeads = JSON.parse(cleanText);
            
            // If it's not an array, try to wrap it in an array
            if (!Array.isArray(generatedLeads)) {
                console.log('Response is not an array, attempting to convert...');
                generatedLeads = [generatedLeads];
            }
            
            // Validate the parsed data
            if (!Array.isArray(generatedLeads)) {
                throw new Error('Expected an array of leads but got something else');
            }
            
            // Validate each lead object
            const requiredFields = ['name', 'email', 'phone', 'notes'];
            for (const [index, lead] of generatedLeads.entries()) {
                if (!lead || typeof lead !== 'object') {
                    console.error(`Invalid lead at index ${index}:`, lead);
                    throw new Error(`Lead at index ${index} is not a valid object`);
                }
                
                // Ensure all required fields exist
                const missingFields = [];
                for (const field of requiredFields) {
                    if (!(field in lead) || lead[field] === '') {
                        missingFields.push(field);
                    }
                }
                
                if (missingFields.length > 0) {
                    console.error(`Lead at index ${index} is missing required fields:`, missingFields);
                    console.error('Lead data:', lead);
                    throw new Error(`Lead at index ${index} is missing required fields: ${missingFields.join(', ')}`);
                }
                
                // Additional validation for phone number
                if (!/^[6-9]\d{9}$/.test(lead.phone.toString())) {
                    console.error(`Invalid phone number format for lead at index ${index}:`, lead.phone);
                    throw new Error(`Invalid phone number format for lead at index ${index}. Must be 10 digits starting with 6-9`);
                }
                
                // Ensure notes is a string
                if (typeof lead.notes !== 'string') {
                    lead.notes = String(lead.notes || '');
                }
            }
            
            console.log('Successfully parsed and validated', generatedLeads.length, 'leads');
            
        } catch (error) {
            console.error('Error processing generated leads:', error);
            console.log('Raw response text:', generatedText);
            return res.status(500).json({ 
                error: 'Failed to process generated leads',
                details: error.message,
                rawResponse: generatedText
            });
        }

        // Save all leads to database with error handling
        console.log('Saving generated leads to database...');
        const savedLeads = [];
        const userId = req.user?.id || 'default-user';
        
        for (const lead of generatedLeads) {
            try {
                // Validate required fields
                if (!lead.name || !lead.email || !lead.phone) {
                    console.error('Missing required fields in lead:', lead);
                    continue;
                }

                const leadData = {
                    name: lead.name.trim(),
                    email: lead.email.trim().toLowerCase(),
                    phone: lead.phone.toString().replace(/\D/g, ''), // Remove non-numeric characters
                    notes: lead.notes || '',
                    company: (lead.company || 'AI Generated').trim(),
                    leadSource: 'AI Generated',
                    status: 'Untouched', // Ensure this matches exactly what the frontend expects
                    user: userId
                };
                
                console.log('Attempting to save lead:', leadData);
                
                // Check if lead with same email already exists
                const existingLead = await Customer.findOne({ email: leadData.email });
                if (existingLead) {
                    console.log('Lead with this email already exists:', leadData.email);
                    savedLeads.push(existingLead);
                    continue;
                }
                
                const newLead = new Customer(leadData);
                const savedLead = await newLead.save();
                console.log('Lead saved successfully with ID:', savedLead._id);
                savedLeads.push(savedLead);
                
                // Verify the lead was saved
                const foundLead = await Customer.findById(savedLead._id);
                if (!foundLead) {
                    console.error('Failed to verify lead was saved:', savedLead._id);
                    throw new Error(`Failed to verify lead ${savedLead._id} was saved`);
                }
                
            } catch (error) {
                console.error('Error saving lead:', error);
                // Continue with other leads even if one fails
            }
        }
        
        console.log(`Successfully saved ${savedLeads.length}/${generatedLeads.length} leads`);

        res.status(201).json(savedLeads);
    } catch (error) {
        console.error('Error generating leads:', error);
        res.status(500).json({ 
            error: 'Failed to generate leads',
            details: error.message 
        });
    }
};

// Test endpoint to verify MongoDB connection and lead saving
const testSaveLead = async (req, res) => {
    try {
        const testLead = new Customer({
            name: 'Test Lead',
            email: `test${Date.now()}@example.com`,
            phone: '9876543210',
            notes: 'Test lead from API',
            company: 'Test Company',
            leadSource: 'Test',
            status: 'Untouched',
            user: req.user?.id || 'test-user'
        });
        
        const savedLead = await testLead.save();
        console.log('Test lead saved successfully:', savedLead);
        res.json({ success: true, lead: savedLead });
    } catch (error) {
        console.error('Error saving test lead:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Webhook to record a call
const recordCall = async (req, res) => {
    try {
        const { callId, from, to, recordingUrl, duration, status } = req.body;

        // Basic validation
        if (!to || !recordingUrl) {
            return res.status(400).json({ error: 'Missing required fields: to, recordingUrl' });
        }

        // Find the customer by phone number
        const customer = await Customer.findOne({ phone: to });

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Create a new call log entry
        const newCallLog = {
            callId: callId || new mongoose.Types.ObjectId().toString(),
            fromNumber: from,
            toNumber: to,
            recordingUrl: recordingUrl,
            duration: duration || 0,
            status: status || 'Completed',
            direction: 'inbound', // Assuming it's an inbound call from a lead
            startTime: new Date(Date.now() - (duration || 0) * 1000),
            endTime: new Date(),
        };

        // Add the new call log to the customer's record
        customer.callLogs.push(newCallLog);
        customer.lastCallAt = new Date();
        customer.totalCalls = (customer.totalCalls || 0) + 1;

        await customer.save();

        res.status(200).json({ success: true, message: 'Call recorded successfully' });
    } catch (error) {
        console.error('Error in recordCall webhook:', error);
        res.status(500).json({ 
            error: 'Failed to record call',
            details: error.message
        });
    }
};

module.exports = {
    generateLeads,
    testSaveLead,
    recordCall
};
