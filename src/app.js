const express = require('express');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware for parsing JSON
app.use(express.json());

// Middleware for serving static files
app.use(express.static(path.join(__dirname, '../public')));

// Use the main routes
app.use('/', mainRoutes);

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server on port 3006
app.listen(PORT, () => {
    console.log(`Project F is running on http://localhost:${PORT}`);
});
