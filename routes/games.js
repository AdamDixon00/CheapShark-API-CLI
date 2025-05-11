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
            cheapestDealID: game.cheapestDealID
        }));

        // Save the keyword to search_history_keyword collection
        await db.insert('SearchHistoryKeyword', { keyword });

        res.json(minimalResponse);
    } catch (error) {
        console.error('Error in games search:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * returns a game and its cheapest deal
 *
 * @api {GET} /game/:dealId
 * @apiParam {string} dealId
 *      the ID of a game's deal
 * 
 * @apiExample localhost:8888/game/<dealId>
 * 
 */
router.get('/:dealId', async (req, res) => {
    try {
        //destructure dealId from the request route parameters object
        const { dealId } = req.params;

        //Validate the route parameter
        if (!dealId) {
            return res.status(400).json({ error: 'Missing required query parameter: dealId' });
        }

        //Search for game deal using the API
        const gameDeal = await api.findDeal(dealId);

        // Handle case where no deal is found
        if (!gameDeal) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        // format data to be sent to mongo database
        const data = {
            name : gameDeal.gameInfo.name,
            cheapestPrice : gameDeal.cheapestPrice.price,
            dealId : dealId            
        };

        // save the selected cheapest deal id of a game onto mongo database
        db.insert('SearchHistorySelection', {data});

        res.status(200).json({data});
    } catch (err) {
        console.error('Error in deal search:', err);
        res.status(500).json({ error: err });
    }
});

export default router; 