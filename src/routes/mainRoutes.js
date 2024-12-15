const express = require('express');
const axios = require('axios');
const { PROJECT_A_URL } = require('../../config/const'); // Import URL from const.js
const router = express.Router();

// In-memory storage for notifications and API messages
const notifications = [];
const apiMessages = [];

// ------------------- API STATUS ROUTE ------------------- //
router.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0',
        message: 'Project F (Communication) is running'
    });
});

// ------------------- NOTIFICATIONS ROUTES ------------------- //
// POST: Receive notifications
router.post('/api/notifications', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    const timestamp = new Date().toISOString();
    notifications.push({ message, timestamp });
    
    // Also log as an API message for system-level tracking
    apiMessages.push({ message: `Notification: ${message}`, timestamp });

    console.log(`Notification received: ${message}`);
    res.status(200).json({ success: true, message: 'Notification received.' });
});

// GET: Fetch notifications
router.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

// ------------------- API MESSAGES ROUTES ------------------- //
// POST: Receive API messages (system-level logs)
router.post('/api/messages', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    apiMessages.push({ message: `API Message: ${message}`, timestamp: new Date().toISOString() });
    res.status(200).json({ message: 'API message received' });
});

// GET: Fetch and optionally clear API messages
router.get('/api/api-messages', (req, res) => {
    // Decide on how you want to handle the messages.
    // For example, return all current messages without clearing them:
    res.set('Cache-Control', 'no-store'); // Prevent caching
    res.json(apiMessages);
});

// ------------------- JOB DATA FORWARDING ------------------- //
// Route to receive job data from Project D and forward it to Project A
router.post('/api/communication', async (req, res) => {
    try {
        const jobData = req.body;
        console.log('Received job data from Project D:', jobData);

        // Forward the job data to Project A using PROJECT_A_URL
        const response = await axios.post(PROJECT_A_URL, jobData);
        console.log('Forwarded job data to Project A:', response.data);

        // Log API message
        apiMessages.push({ message: 'Job data forwarded to Project A', timestamp: new Date().toISOString() });
        
        res.status(200).json({ message: 'Job data sent to Project A successfully', data: response.data });
    } catch (error) {
        console.error('Error forwarding job data to Project A:', error.message);

        // Log API error message
        apiMessages.push({ message: `Error forwarding job data: ${error.message}`, timestamp: new Date().toISOString() });
        
        res.status(500).json({ error: 'Failed to forward job data to Project A.' });
    }
});

// ------------------- HEALTH CHECK ROUTES ------------------- //
// Check the health of connected services (e.g., Project A)
router.get('/api/health', async (req, res) => {
    const services = {
        ProjectA: PROJECT_A_URL,
    };

    const healthChecks = await Promise.all(
        Object.entries(services).map(async ([name, url]) => {
            try {
                const response = await axios.get(url);
                return { name, status: response.data.status, message: response.data.message };
            } catch (error) {
                return { name, status: 'unreachable', message: error.message };
            }
        })
    );

    res.json({ systemHealth: healthChecks });
});

module.exports = router;
