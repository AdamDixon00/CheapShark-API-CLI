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
      // Fetch all selections from the database
      const cursor = await db.find('SearchHistorySelection');
      
      // Convert the cursor to an array
      const selections = await cursor.toArray();

      // Check if the cursor is empty
      if (selections.length === 0) {
        return res.status(204).end(); // No content
      }
      const selectionsList = selections.map(doc => ({ 
          title: doc.game.info.title,
          dealPrice: doc.game.deals[0].price
        }));

      return res.json(selectionsList);
    }
    if (type === 'keywords') {
      // Fetch all keywords from the database
      const cursor = await db.find('SearchHistoryKeyword');

      // Convert the cursor to an array
      const keywords = await cursor.toArray();

      // Check if the cursor is empty
      if (keywords.length === 0) {
        return res.status(204).end(); // No content
      }

      // Only return the keyword field from each document
      const keywordList = keywords.map(doc => ({ keyword: doc.keyword }));
      return res.json(keywordList);
    }

    res.status(204).end();

  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

