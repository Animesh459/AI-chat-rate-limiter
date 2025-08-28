// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Import route modules
const chatRoutes = require('./src/routes/chat');

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Define a simple home route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the AI Chat Rate Limiter API!');
});

// Use the chat routes
app.use('/api', chatRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});