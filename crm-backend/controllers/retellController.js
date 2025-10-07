const { Retell } = require('retell-sdk');
const mongoose = require('mongoose');
const Customer = require('../models/Customer');

// Verify environment variables
if (!process.env.RETELL_API_KEY) {
  console.error('ERROR: RETELL_API_KEY is not set in environment variables');
}
if (!process.env.RETELL_AGENT_ID) {
  console.error('ERROR: RETELL_AGENT_ID is not set in environment variables');
}
if (!process.env.COMPANY_PHONE_NUMBER) {
  console.error('ERROR: COMPANY_PHONE_NUMBER is not set in environment variables');
}

// Initialize Retell client
let retell;
try {
  retell = new Retell({
    apiKey: process.env.RETELL_API_KEY
  });
  console.log('✅ Retell client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Retell client:', error);
  process.exit(1);
}

// Initiate call to a lead
const callLead = async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 10);
  
  const log = (message, data = {}) => {
    console.log(`[${requestId}] ${message}`, Object.keys(data).length ? data : '');
  };
  
  try {
    log('=== CALL LEAD REQUEST ===', {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query,
      body: { ...req.body, phoneNumber: req.body.phoneNumber ? '***REDACTED***' : undefined },
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? '***REDACTED***' : 'Not provided',
        'user-agent': req.headers['user-agent']
      }
    });

    // 1. Validate required fields
    if (!req.body.phoneNumber) {
      const error = 'phoneNumber is required';
      log('Validation failed', { error });
      return res.status(400).json({ success: false, error });
    }

    const phoneNumber = req.body.phoneNumber.trim();
    let leadId = req.params.id || req.body.leadId;
    
    if (!leadId) {
      const error = 'No lead ID provided';
      log('Validation failed', { error });
      return res.status(400).json({ success: false, error });
    }

    // 2. Validate and normalize lead ID
    if (typeof leadId === 'object') {
      leadId = leadId.toString();
    }

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      const error = 'Invalid lead ID format';
      log('Validation failed', { error, leadId });
      return res.status(400).json({ success: false, error });
    }

    // 3. Fetch lead
    const lead = await Customer.findById(leadId).lean();
    if (!lead) {
      const error = 'Lead not found';
      log('Lead not found', { leadId });
      return res.status(404).json({ success: false, error });
    }

    log('Lead found', { leadId: lead._id });

    // 4. Validate phone number format (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      const error = 'Invalid phone number format. Use E.164 format (e.g., +1234567890)';
      log('Validation failed', { error, phoneNumber: '***REDACTED***' });
      return res.status(400).json({ success: false, error });
    }

    // Create a call log entry first
    const callLogEntry = {
      callId: `temp-${Date.now()}`,
      timestamp: new Date(),
      event: 'Call Initiated',
      status: 'In Progress',
      notes: 'Call initiated through the system',
      duration: 0, // Will be updated when call ends
      recordingUrl: null, // Will be updated if recording is available
      metadata: {
        leadId: lead._id.toString(),
        leadName: lead.name || 'Unknown',
      }
    };

    // Update lead status and add initial call log
    await Customer.findByIdAndUpdate(
      leadId,
      { 
        $set: { 
          status: 'HPL',
          lastCallAt: new Date() 
        },
        $push: {
          callLogs: callLogEntry
        }
      },
      { new: true }
    );

    // 5. Prepare call data
    const callData = {
      from_number: process.env.COMPANY_PHONE_NUMBER,
      to_number: phoneNumber,
      agent_id: process.env.RETELL_AGENT_ID,
      retell_llm_dynamic_variables: {
        leadId: lead._id.toString(),
        leadName: lead.name || 'Customer'
      },
      custom_sip_headers: {
        'X-Lead-ID': lead._id.toString()
      },
      metadata: callLogEntry.metadata,
      // Enable call recording
      record: {
        format: 'mp3',
        storage: 'retell',  // Store recordings on Retell's servers
        transcription: true, // Enable transcription
        whisper: {
          model: 'whisper-1',
          language: 'en',
          prompt: `This is a sales call with ${lead.name || 'a customer'}.`
        }
      }
    };

    log('Initiating call with Retell API', {
      from: callData.from_number,
      to: '***REDACTED***',
      agentId: callData.agent_id
    });

    // 6. Make the Retell API call
    let call;
    try {
      log('Sending request to Retell API', { 
        from: callData.from_number,
        to: '***REDACTED***',
        agentId: callData.agent_id 
      });
      
      // Add timeout to the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      call = await retell.call.createPhoneCall(callData, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      log('Retell API response received', { 
        callId: call?.call_id,
        status: call?.status 
      });
      
      if (!call?.call_id) {
        throw new Error('Missing call_id in Retell API response');
      }
      
      // Update the call log with the actual call ID
      await Customer.findOneAndUpdate(
        { _id: leadId, 'callLogs.callId': callLogEntry.callId },
        { 
          $set: { 
            'callLogs.$.callId': call.call_id,
            'callLogs.$.status': 'In Progress',
            'callLogs.$.notes': 'Call connected and in progress'
          }
        },
        { new: true }
      );

      console.log(`Call initiated with ID: ${call.call_id} for lead: ${leadId}`);
      
      // 7. Update lead in the background (don't wait for this to complete)
      Customer.findByIdAndUpdate(
        leadId,
        {
          $set: { status: 'In Call', lastCallAt: new Date() },
          $push: {
            callLogs: {
              callId: call.call_id,
              timestamp: new Date(),
              event: 'call_initiated',
              notes: 'Call initiated via Retell AI'
            }
          }
        },
        { new: true }
      ).catch(updateError => {
        log('Failed to update lead', { 
          error: updateError.message,
          leadId,
          callId: call.call_id 
        });
        // Continue even if update fails
      });

      // 8. Return success response
      const response = {
        success: true,
        call: {
          id: call.call_id,
          status: 'initiated',
          timestamp: new Date().toISOString()
        }
      };

      log('Call initiated successfully', { callId: call.call_id });
      return res.json(response);

    } catch (apiError) {
      const errorDetails = {
        message: apiError.message,
        status: apiError.response?.status,
        data: apiError.response?.data,
        stack: process.env.NODE_ENV === 'development' ? apiError.stack : undefined
      };
      
      log('❌ Retell API error', errorDetails);
      
      // Update the call log with failure information
      await Customer.findOneAndUpdate(
        { _id: leadId, 'callLogs.callId': callLogEntry.callId },
        { 
          $set: { 
            'callLogs.$.status': 'Failed',
            'callLogs.$.event': 'Call Failed',
            'callLogs.$.notes': `Failed to connect call: ${apiError.message}`,
            'callLogs.$.error': errorDetails
          }
        },
        { new: true }
      );
      
      return res.status(apiError.response?.status || 500).json({
        success: false,
        error: 'Failed to initiate call',
        details: apiError.response?.data?.error || apiError.message,
        code: 'CALL_INITIATION_FAILED'
      });
    }

    if (!call?.call_id) {
      const error = 'Invalid response from Retell API - Missing call_id';
      log('Validation failed', { error, response: call });
      return res.status(500).json({ success: false, error });
    }

    // 7. Update lead in the background (don't wait for this to complete)
    Customer.findByIdAndUpdate(
      leadId,
      {
        $set: { status: 'In Call', lastCallAt: new Date() },
        $push: {
          callLogs: {
            callId: call.call_id,
            timestamp: new Date(),
            event: 'call_initiated',
            notes: 'Call initiated via Retell AI'
          }
        }
      },
      { new: true }
    ).catch(updateError => {
      log('Failed to update lead', { 
        error: updateError.message,
        leadId,
        callId: call.call_id 
      });
      // Continue even if update fails
    });

    // 8. Return success response
    const response = {
      success: true,
      call: {
        id: call.call_id,
        status: 'initiated',
        timestamp: new Date().toISOString()
      }
    };

    log('Call initiated successfully', { callId: call.call_id });
    return res.json(response);

  } catch (error) {
    log('Unexpected error', { 
      error: error.message, 
      stack: error.stack 
    });
    
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
};

// Webhook handler for call events
const handleCallEvent = async (req, res) => {
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  const logEvent = (message, data = {}) => {
    console.log(`[${eventId}] ${message}`, Object.keys(data).length ? data : '');
  };
  
  try {
    logEvent('📩 Received webhook event', {
      type: req.body.event || req.body.eventType,
      callId: req.body.call_id || req.body.callId,
      timestamp: new Date().toISOString()
    });
    
    const { event, eventType, callId, call_id, metadata, error } = req.body;
    const effectiveEvent = event || eventType;
    const effectiveCallId = callId || call_id;
    
    if (!effectiveCallId) {
      return res.status(400).json({ error: 'Missing call ID' });
    }

    // Find the lead by call ID in the call logs
    const lead = await Customer.findOne({ 'callLogs.callId': effectiveCallId });
    
    if (!lead) {
      console.log('No lead found for call ID:', event.call_id);
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Prepare the update operation
    const update = {
      $push: {
        'callLogs.$.events': {
          type: event.type,
          timestamp: new Date(),
          data: event
        }
      },
      $set: {
        'callLogs.$.lastUpdated': new Date()
      }
    };

    // Handle specific event types
    switch (event.type) {
      case 'call.answered':
        update.$set['callLogs.$.status'] = 'In Progress';
        update.$set['callLogs.$.startTime'] = new Date();
        update.$push['callLogs.$.callHistory'] = {
          event: 'Call Answered',
          timestamp: new Date(),
          details: 'The call was answered by the recipient.'
        };
        break;

      case 'call.ended':
        update.$set = update.$set || {};
        update.$set['callLogs.$.status'] = 'Completed';
        update.$set['callLogs.$.endTime'] = new Date();
        update.$set['callLogs.$.duration'] = event.duration_seconds || 0;
        update.$set['callLogs.$.recordingUrl'] = event.recording_url || null;
        
        // Calculate call duration if we have start time
        const callLog = lead.callLogs.find(log => log.callId === event.call_id);
        if (callLog?.startTime) {
          const start = new Date(callLog.startTime);
          const end = new Date();
          const duration = Math.round((end - start) / 1000); // in seconds
          update.$set['callLogs.$.duration'] = duration;
        }
        
        // Add to call history
        update.$push = update.$push || {};
        update.$push['callLogs.$.callHistory'] = {
          event: 'Call Ended',
          timestamp: new Date(),
          details: `Call completed after ${update.$set['callLogs.$.duration']} seconds`,
          duration: update.$set['callLogs.$.duration']
        };
        
        // Update lead status based on call outcome if available
        if (event.call_outcome) {
          update.$set['callLogs.$.outcome'] = event.call_outcome;
          
          // Example: Update lead status based on call outcome
          if (event.call_outcome === 'interested') {
            update.$set.status = 'HPL'; // High Priority Lead
          } else if (event.call_outcome === 'not_interested') {
            update.$set.status = 'NPL'; // Not Priority Lead
          }
        }
        break;
      
      case 'call.failed':
        update.$set = update.$set || {};
        update.$set['callLogs.$.status'] = 'Failed';
        update.$set['callLogs.$.error'] = event.error_message || 'Unknown error';
        update.$set['callLogs.$.endTime'] = new Date();
        
        update.$push = update.$push || {};
        update.$push['callLogs.$.callHistory'] = {
          event: 'Call Failed',
          timestamp: new Date(),
          details: `Call failed: ${event.error_message || 'Unknown error'}`,
          error: event.error_message
        };
        break;
      
      case 'call.recording.completed':
        update.$set = update.$set || {};
        update.$set['callLogs.$.recordingUrl'] = event.recording_url || null;
        
        update.$push = update.$push || {};
        update.$push['callLogs.$.callHistory'] = {
          event: 'Recording Available',
          timestamp: new Date(),
          details: 'Call recording is now available',
          recordingUrl: event.recording_url
        };
        break;
        
      case 'call.transfer.started':
        update.$push = update.$push || {};
        update.$push['callLogs.$.callHistory'] = {
          event: 'Call Transfer Started',
          timestamp: new Date(),
          details: `Transferring call to ${event.transfer_to || 'another agent'}`,
          transferTo: event.transfer_to
        };
        break;
        
      case 'call.transfer.completed':
        update.$push = update.$push || {};
        update.$push['callLogs.$.callHistory'] = {
          event: 'Call Transfer Completed',
          timestamp: new Date(),
          details: 'Call was successfully transferred',
          transferTo: event.transfer_to
        };
        break;
    }

    // Update the lead with the call event
    const updatedLead = await Customer.findOneAndUpdate(
      { _id: lead._id, 'callLogs.callId': effectiveCallId },
      update,
      { new: true }
    );

    if (!updatedLead) {
      console.error('Failed to update call log for lead:', lead._id);
      return res.status(500).json({ error: 'Failed to update call log' });
    }

    console.log(`Updated call log for lead ${lead._id} with event ${effectiveEvent}`);
    
    // Emit real-time update via WebSocket if configured
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.emit('call:update', {
        leadId: lead._id,
        callId: effectiveCallId,
        event: effectiveEvent,
        timestamp: new Date(),
        data: req.body
      });
    }

    // Return success response with relevant information
    return res.status(200).json({ 
      success: true,
      eventId: req.body.event_id || Date.now().toString(),
      callId: effectiveCallId,
      leadId: lead._id,
      status: update.$set?.['callLogs.$.status'] || 'processed'
    });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process webhook event',
      details: error.message,
      eventId
    });
  }
};

module.exports = {
  callLead,
  handleCallEvent
};
