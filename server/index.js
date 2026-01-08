const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Serve Static Frontend Assets (Fixes Vercel blank page)
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Handle React Routing (SPA) - Send all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
