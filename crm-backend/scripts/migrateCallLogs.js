const mongoose = require('mongoose');
require('dotenv').config();
const Customer = require('../models/Customer');

async function migrateCallLogs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all customers with call logs
    const customers = await Customer.find({ 'callLogs.0': { $exists: true } });
    console.log(`Found ${customers.length} customers with call logs to migrate`);

    // Process each customer
    for (const customer of customers) {
      console.log(`Migrating call logs for customer: ${customer._id}`);
      
      // Update each call log entry to match the new schema
      const updatedCallLogs = customer.callLogs.map(log => ({
        ...log.toObject(),
        status: log.status || 'Completed',
        direction: 'outbound',
        startTime: log.timestamp || new Date(),
        events: [
          {
            type: log.event || 'call.initiated',
            timestamp: log.timestamp || new Date(),
            data: {
              notes: log.notes
            }
          }
        ],
        callHistory: [
          {
            event: log.event || 'Call Logged',
            timestamp: log.timestamp || new Date(),
            details: log.notes || 'Call log migrated from previous version'
          }
        ]
      }));

      // Update the customer with migrated call logs
      await Customer.updateOne(
        { _id: customer._id },
        { 
          $set: { 
            callLogs: updatedCallLogs,
            totalCalls: customer.callLogs.length,
            lastCallAt: customer.callLogs.length > 0 ? 
              (customer.callLogs[0].timestamp || new Date()) : 
              customer.lastCallAt
          } 
        }
      );
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateCallLogs();
