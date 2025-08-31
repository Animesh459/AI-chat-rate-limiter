// server.js

const express = require('express');
const app = express();
const PORT = 3000;

// Import the route files
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

// Middleware to parse JSON bodies
app.use(express.json());

// Use the imported routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});