const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const aiController = require('../controllers/aiLeadController');
const retellController = require('../controllers/retellController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(authenticateToken);

// Regular customer routes
router.get('/', controller.getAllCustomers);
router.post('/', controller.createCustomer);
router.put('/:id', controller.updateCustomer);
router.delete('/:id', controller.deleteCustomer);

// AI Lead Generation route - protected by auth middleware
router.post('/ai-generate', aiController.generateLeads);

// Call management routes (auth already applied globally)
router.post('/:id/call', retellController.callLead);

// Webhook endpoint must bypass authentication and handle raw JSON
router.post(
  '/webhook/call',
  express.json({
    verify: (req, res, buf) => {
      try {
        req.rawBody = buf.toString();
      } catch (e) {
        console.error('Error parsing webhook body:', e);
      }
    },
  }),
  (req, res, next) => {
    // Log incoming webhook request
    console.log('Received webhook request:', {
      method: req.method,
      url: req.originalUrl,
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString(),
    });
    next();
  },
  retellController.handleCallEvent
);

// Test route for debugging lead saving
router.post('/test-save', aiController.testSaveLead);

// Get call logs
router.get('/calls/logs', controller.getCallLogs);

module.exports = router;
