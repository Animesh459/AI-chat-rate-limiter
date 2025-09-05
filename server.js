// server.js
require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(express.json());

// mount routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);

// only start server when run directly (keeps it testable)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
