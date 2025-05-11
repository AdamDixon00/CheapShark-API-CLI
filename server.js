import express from 'express';
import db from './services/db.js';

import gameRoutes from './routes/games.js';
import historyRouter from './routes/history.js';

// Create Express app
const app = express();

// Initialize database connection
db.connect();

// Middleware
app.use(express.json());

// Routes
app.use('/games', gameRoutes);
app.use('/history', historyRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8888;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const shutdown = async () => {
    // await the close mongo db connection
    await db.close();

    // close the server
    server.close(() => {
        console.log('Server shutdown.');
        process.exit(0);
    });
};

// SIGINT - manual interruption (ex: ctrl + c on Mac)
// SIGTERM - polite terminate (ex: docker shutting down the process)
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);