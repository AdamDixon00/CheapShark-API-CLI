import express from 'express';
import { searchByKeyword, getGameInfoById, findStoreById } from '../services/api.js';
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

        // Save the keyword to search_history_keyword collection
        await db.insert('search_history_keyword', { keyword });

        res.json(minimalResponse);
    } catch (error) {
        console.error('Error in games search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const game = await getGameInfoById(id);

        if (!id) {
            return res.status(400).json({ error: 'Did not find game!' });
        }

        // More info on game
        const store = await findStoreById(game.deals[0].storeID);
        const storeName = store.storeName;
        const response = 
        {
            name: game.info.title,
            price: game.deals[0].price,
            store: storeName,
            dealId: game.deals[0].dealID
        }

        // Save the keyword to search_history_keyword collection
        await db.insert('search_history_keyword', { id });

        res.json(response);

    } catch (error) {
        console.error('Error in games search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router; 