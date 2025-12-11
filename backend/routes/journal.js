const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Get all journal entries for a user
router.get('/', async (req, res) => {
    const userId = req.userId;
    try {
        const result = await pool.query(
            `SELECT id, date, mood_rating, note, trigger_ids, created_at
            FROM journals
            WHERE user_id = $1
            ORDER BY date DESC`,
            [userId]
        );

        // Parse trigger_ids if they are stored as JSON string
        const entries = result.rows.map(row => {
            let triggers = [];
            if (row.trigger_ids) {
                try {
                    triggers = typeof row.trigger_ids === 'string'
                        ? JSON.parse(row.trigger_ids)
                        : row.trigger_ids;
                } catch (e) {
                    triggers = [];
                }
            }
            return { ...row, triggers };
        });

        res.json({ entries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new journal entry
router.post('/', async (req, res) => {
    const userId = req.userId;
    const { date, mood_rating, note, trigger_ids } = req.body;

    try {
        const triggersJson = trigger_ids ? JSON.stringify(trigger_ids) : '[]';

        const result = await pool.query(
            `INSERT INTO journals (user_id, date, mood_rating, note, trigger_ids)
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [userId, date || new Date().toISOString(), mood_rating, note, triggersJson]
        );

        res.status(201).json({ id: result.rows[0].id, message: 'Entry created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error while creating journal entry' });
    }
});

module.exports = router;
