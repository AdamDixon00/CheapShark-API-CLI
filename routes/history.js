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
      const selections = await db.find('SearchHistorySelection');
      
      // Convert the cursor to an array
      const cursor = await selections.toArray();

      // Check if the cursor is empty
      if (cursor.length === 0) {
        return res.status(204).end(); // No content
      }

      return res.json(cursor);
    }
    if (type === 'keywords') {
      // Fetch all keywords from the database
      const keywords = await db.find('SearchHistoryKeyword');

      // Convert the cursor to an array
      const cursor = await keywords.toArray();

      // Check if the cursor is empty
      if (cursor.length === 0) {
        return res.status(204).end(); // No content
      }

      return res.json(cursor);
    }

    res.status(204).end();

  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

