const express = require('express');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// POST endpoint to receive bundled data
app.post('/api/communication', (req, res) => {
    console.log('Received bundled data:', req.body);
    res.status(200).json({ message: 'Bundled data received successfully', data: req.body });
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
