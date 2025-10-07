const express = require('express');
const router = express.Router();
const { recordCall } = require('../controllers/aiLeadController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/ai/record-call
// @desc    Webhook to record a call from an AI agent
// @access  Public (or protected if a token is provided by the service)
router.post('/record-call', recordCall);

module.exports = router;
