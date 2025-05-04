import express from 'express';
import dotenv from 'dotenv';
import gameRoutes from './routes/games.js';
import db from './services/db.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Initialize database connection
db.connect();

// Middleware
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 