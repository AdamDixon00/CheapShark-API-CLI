// routes/history.js
import express from 'express';
import db from '../services/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { type } = req.query;

  // Validate the query parameter
  if (!type || !['keywords', 'selections'].includes(type)) {
    return res.status(400).json({ error: 'Query parameter "type" must be either "keywords" or "selections"' });
  }

  try {
    if (type === 'selections') {
      const selections = await db.find('SearchHistorySelection');

      // Remove MongoDB _id from each object before returning
      const cleanSelections = selections.map(({ _id, ...rest }) => rest);

      return res.json(cleanSelections);
    }

    // History Keywords: Optionally handle keywords if needed later 
    // (currently is being worked on by Anthony)
    res.status(204).end();

  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

