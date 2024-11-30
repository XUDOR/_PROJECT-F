const express = require('express');
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Example API endpoint
app.get('/api/data', (req, res) => {
    res.json({ message: 'Welcome to Project F API!' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Project F is running on http://localhost:${PORT}`);
});
