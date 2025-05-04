import express from 'express';
import { searchByKeyword } from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();

/**
 * GET /games
 * Searches for games by keyword and returns a minimal JSON response
 * Query parameters:
 *   - keyword: The search term to look for games
 */
router.get('/', async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({ error: 'Keyword parameter is required' });
        }

        // Search for games using the API
        const games = await searchByKeyword(keyword);

        // Transform the response to include only display and identifier
        const minimalResponse = games.map(game => ({
            display: game.external,
            identifier: game.gameID
        }));

        // Save the keyword if it doesn't exist
        await db.update(
            'search_history_keyword',
            { keyword },
            { keyword }
        );

        res.json(minimalResponse);
    } catch (error) {
        console.error('Error in games search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 