import express from 'express';
import * as api from '../services/api.js';
import db from '../services/db.js';

const router = express.Router();

/**
 * GET /deals
 * 
 * Query parameters:
 *   - id: The search term to look for deals
 */

router.get('/', async (req, res) => {
    try{
        //destructure query from the request object
        const { query} = req;
        //destructure remaining from query object 
        const { deal } = query;

        //Validate the query parameter
        if (!deal) {
            return res.status(400).json({ error: 'Missing required query parameter: deal' });
        }

        //Search for game deal using the API
        const gameDeal = await api.findDeal(deal);

        // Handle case where no deal is found
        if (!gameDeal) {
            return res.status(404).json({ error: 'Deal not found' });
        }

        res.status(200).json(gameDeal);
    } catch (err) {
        console.error('Error in deal search:', err);
        res.status(500).json({ error: err });
    }

})

export default router;