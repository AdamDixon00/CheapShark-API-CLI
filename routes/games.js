import express from 'express';
import * as api from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();

/**
 * GET /game
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
        const games = await api.searchByKeyword(keyword);

        // Transform the response to include only display and identifier
        const minimalResponse = games.map(game => ({
            display: game.external,
            identifier: game.gameID
        }));

        // Save the keyword to search_history_keyword collection
        // Check if keyword already exists
        const cursor = await db.find('SearchHistoryKeyword', { keyword });
        const existing = await cursor.toArray();

        if (existing.length === 0) {
            await db.insert('SearchHistoryKeyword', { keyword, games });
        } else {
            console.log('Keyword already exists, skipping insert.');
        }

        res.json(minimalResponse);
    } catch (error) {
        console.error('Error in games search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * returns a game and its cheapest deal
 *
 * @api {GET} /game/:gameId
 * @apiParam {string} gameId
 *      the ID of a game
 * 
 * @apiExample localhost:8888/game/<gameID>
 * 
 */
router.get('/:gameId', async (req, res) => {
    try {
        //destructure gameId from the request route parameters object
        const { gameId } = req.params;

        //Validate the route parameter
        if (!gameId) {
            return res.status(400).json({ error: 'Missing required query parameter: gameId' });
        }

        //Search for game deal using the API
        const game = await api.getGameInfoById(gameId);

        // Handle case where no deal is found
        if (!game) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // find store for deal
        const store = await api.findStoreById(game.deals[0].storeID);
        const storeName = store.storeName;

        // format data to be sent to mongo database
        const detailedResponse = 
        {
            name: game.info.title,
            gameId: gameId,
            price:game.deals[0].price,
            store: storeName,
            dealID: game.deals[0].dealID
        }

        // Save the game to search_history_id collection
        // Check if game already exists
        const cursor = await db.find('SearchHistorySelection', { gameId } );
        const existing = await cursor.toArray();

        if (existing.length === 0) {
            await db.insert('SearchHistorySelection', { gameId, game });
        } else {
            console.log('ID already exists, skipping insert.');
        }

        res.json(detailedResponse);
    } catch (err) {
        console.error('Error in deal search:', err);
        res.status(500).json({ error: err });
    }
});

export default router; 