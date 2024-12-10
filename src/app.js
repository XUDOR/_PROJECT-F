const express = require('express');
const axios = require('axios'); // For forwarding data to Project A
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// POST endpoint to receive bundled data and forward it to Project A
app.post('/api/communication', async (req, res) => {
    try {
        console.log('Received bundled data:', req.body);

        // Forward the job data to Project A
        await axios.post('http://localhost:3001/api/receive-jobs', req.body);

        res.status(200).json({ message: 'Job data sent to Project A successfully' });
    } catch (error) {
        console.error('Error sending job data to Project A:', error.message);
        res.status(500).json({ error: 'Failed to send job data to Project A.' });
    }
});

// Example GET API endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Welcome to Project F API!' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server on port 3006
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Project F is running on http://localhost:${PORT}`);
});
