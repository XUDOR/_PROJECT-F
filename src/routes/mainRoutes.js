const express = require('express');
const axios = require('axios'); // For forwarding data to Project A
const router = express.Router();

// Route to receive job data from Project D and forward it to Project A
router.post('/api/communication', async (req, res) => {
    try {
        const jobData = req.body;
        console.log('Received job data from Project D:', jobData);

        // Forward the job data to Project A
        const response = await axios.post('http://localhost:3001/api/receive-jobs', jobData);

        console.log('Forwarded job data to Project A:', response.data);
        res.status(200).json({ message: 'Job data sent to Project A successfully', data: response.data });
    } catch (error) {
        console.error('Error forwarding job data to Project A:', error.message);
        res.status(500).json({ error: 'Failed to forward job data to Project A.' });
    }
});

// Route to provide sample notifications
router.get('/api/notifications', (req, res) => {
    const sampleNotification = {
        job_title: 'DevOps Engineer',
        company_name: 'CloudWorks Inc.',
        timestamp: new Date().toISOString()
    };

    res.json(sampleNotification);
});

module.exports = router;
