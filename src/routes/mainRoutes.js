const express = require('express');
const router = express.Router();

// Route to receive job data from Project D and forward it to Project A
router.post('/api/communication', async (req, res) => {
    try {
        const jobData = req.body;
        console.log('Received job data from Project D:', jobData);

        // Forward the job data to Project A
        const response = await fetch('http://localhost:3001/api/receive-jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData),
        });

        if (!response.ok) {
            throw new Error(`Failed to forward data: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('Forwarded job data to Project A:', responseData);

        res.status(200).json({ message: 'Job data sent to Project A successfully', data: responseData });
    } catch (error) {
        console.error('Error forwarding job data to Project A:', error.message);
        res.status(500).json({ error: 'Failed to forward job data to Project A.' });
    }
});

// Route to provide sample notifications
router.get('/api/notifications', (req, res) => {
    const sampleNotification = {
        job_title: 'DevOps Engineer',
        company_name: 'CloudWorks Inc.'
    };

    res.json(sampleNotification);
});

module.exports = router;
