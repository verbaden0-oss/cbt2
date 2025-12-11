const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Get all journal entries for a user
router.get('/', async (req, res) => {
    const userId = req.userId;
    try {
        // Simple select, assuming trigger_ids is stored as text (JSON string or comma separated)
        // If we want to expand triggers, we would need to fetch them separately or handle it in UI
        const result = await pool.query(
            `SELECT id, date, mood_rating, note, trigger_ids, created_at
            FROM journals
            WHERE user_id = ?
            ORDER BY date DESC`,
            [userId]
        );

        // Parse trigger_ids if they are stored as JSON string
        const entries = result.rows.map(row => ({
            ...row,
            triggers: row.trigger_ids ? JSON.parse(row.trigger_ids) : []
        }));

        res.json({ entries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new journal entry
router.post('/', async (req, res) => {
    const userId = req.userId;
    const { date, mood_rating, note, trigger_ids } = req.body; // trigger_ids is array

    try {
        // SQLite doesn't support RETURNING in all versions/drivers easily.
        // We will use the db wrapper's ability to return lastID if we fix it, 
        // or just run INSERT and then assume success.

        const triggersJson = trigger_ids ? JSON.stringify(trigger_ids) : '[]';

        const result = await pool.query(
            `INSERT INTO journals (user_id, date, mood_rating, note, trigger_ids)
             VALUES (?, ?, ?, ?, ?)`,
            [userId, date || new Date().toISOString(), mood_rating, note, triggersJson]
        );

        // Assuming pool.query returns { lastID: ... } for inserts (we need to update db.js to ensure this)
        res.status(201).json({ id: result.lastID, message: 'Entry created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while creating journal entry' });
    }
});

module.exports = router;
