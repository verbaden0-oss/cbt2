const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Get all CBT exercises for a user
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM CBTExercises WHERE user_id = $1 ORDER BY completed_at DESC', [req.userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new CBT exercise entry
router.post('/', async (req, res) => {
    const { type, content_json } = req.body;
    if (!type || !content_json) {
        return res.status(400).json({ error: 'Exercise type and content are required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO CBTExercises (user_id, type, content_json, completed_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id',
            [req.userId, type, JSON.stringify(content_json)]
        );
        res.status(201).json({ id: result.rows[0].id, type, content_json, completed_at: new Date() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
