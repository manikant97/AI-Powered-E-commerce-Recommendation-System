const mongoose = require('mongoose');

// Define call log schema as a separate schema for better organization
const CallLogSchema = new mongoose.Schema({
  // Unique identifier for the call
  callId: {
    type: String,
    required: true,
    index: true
  },
  // Call status (In Progress, Completed, Failed, etc.)
  status: {
    type: String,
    enum: ['Initiated', 'In Progress', 'Completed', 'Failed', 'Missed', 'Voicemail', 'No Answer'],
    default: 'Initiated'
  },
  // Call direction (inbound/outbound)
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    default: 'outbound'
  },
  // Timestamp of when the call started
  startTime: {
    type: Date,
    default: Date.now
  },
  // Timestamp of when the call ended
  endTime: {
    type: Date
  },
  // Call duration in seconds
  duration: {
    type: Number,
    default: 0
  },
  // Phone numbers involved in the call
  fromNumber: String,
  toNumber: String,
  // Call outcome/result
  outcome: {
    type: String,
    enum: ['Interested', 'Not Interested', 'Call Back Later', 'Do Not Call', 'Wrong Number', 'Voicemail', 'No Answer'],
    default: null
  },
  // URL to the call recording if available
  recordingUrl: String,
  // Transcription of the call if available
  transcription: String,
  // Key-value pairs of call metadata
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  // Detailed call events (ringing, answered, etc.)
  events: [{
    type: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    data: mongoose.Schema.Types.Mixed
  }],
  // Call history entries (human-readable events)
  callHistory: [{
    event: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    duration: Number,
    metadata: mongoose.Schema.Types.Mixed
  }],
  // Agent who handled the call (if applicable)
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Notes about the call
  notes: String,
  // Tags for categorization
  tags: [String],
  // Whether the call requires follow-up
  requiresFollowUp: {
    type: Boolean,
    default: false
  },
  // Follow-up date if needed
  followUpDate: Date,
  // Custom fields for specific business needs
  customFields: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  
  // Status and Classification
  status: {
    type: String,
    default: 'Untouched',
    enum: ['Untouched', 'HPL', 'MPL', 'LPL', 'NPL', 'Converted', 'Do Not Contact']
  },
  
  // Contact Information
  company: {
    type: String,
    trim: true,
    default: ''
  },
  position: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  // Lead Information
  leadSource: {
    type: String,
    default: 'Manual Entry',
    enum: ['Manual Entry', 'Website', 'Referral', 'Advertisement', 'Social Media', 'Trade Show', 'Other']
  },
  leadScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // Relationship
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  
  // Communication Preferences
  preferredContactMethod: {
    type: String,
    enum: ['email', 'phone', 'sms', 'whatsapp', 'any'],
    default: 'any'
  },
  doNotCall: {
    type: Boolean,
    default: false
  },
  doNotEmail: {
    type: Boolean,
    default: false
  },
  
  // Call Tracking
  callLogs: [CallLogSchema],
  lastCallAt: {
    type: Date,
    default: null
  },
  totalCalls: {
    type: Number,
    default: 0
  },
  
  // Notes and Additional Info
  notes: String,
  tags: [String],
  customFields: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);