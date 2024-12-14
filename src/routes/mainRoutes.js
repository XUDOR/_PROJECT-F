const express = require('express');
const axios = require('axios');
const { PROJECT_A_URL } = require('../../config/const'); // Import URL from const.js
const router = express.Router();

// In-memory storage for notifications and API messages
const notifications = [];
const apiMessages = [];

router.get('/api/api-messages', (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching
    res.json(apiMessages);
});

// ------------------- API STATUS ROUTE ------------------- //

router.get('/api/status', (req, res) => {
    res.json({
        status: 'active',
        version: '1.0',
        message: 'Project F (Communication) is running'
    });
});

// ------------------- RECEIVE NOTIFICATIONS ------------------- //
router.post('/api/notifications', (req, res) => {
    const { message } = req.body;
    const timestamp = new Date().toISOString();

    notifications.push({ message, timestamp });
    apiMessages.push({ message: `Notification: ${message}`, timestamp }); // Add to API messages

    res.status(200).json({ message: 'Notification received' });
});


// ------------------- FETCH API MESSAGES ------------------- //
router.get('/api/api-messages', (req, res) => {
    const messagesToSend = [...apiMessages];
    apiMessages.length = 0; // Clear the array after sending the messages
    res.json(messagesToSend);
});

module.exports = router;



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

// ------------------- NOTIFICATIONS ROUTES ------------------- //

// Route to receive notifications from other services (e.g., Project B)
router.post('/api/notifications', (req, res) => {
    const { message } = req.body;
    if (message) {
        const notification = { message, timestamp: new Date().toISOString() };
        notifications.push(notification);
        console.log(`Notification received: ${message}`);
        res.status(200).json({ success: true, message: 'Notification received.' });
    } else {
        res.status(400).json({ error: 'Message is required.' });
    }
});

// Route to fetch notifications
router.get('/api/notifications', (req, res) => {
    res.json(notifications);
});

// ------------------- API MESSAGES ROUTES ------------------- //

// Route to fetch API messages (system-level logs)
router.get('/api/api-messages', (req, res) => {
    res.json(apiMessages);
});

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
