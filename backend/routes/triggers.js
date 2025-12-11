const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

// Get all triggers for a user
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Triggers WHERE user_id = $1 ORDER BY name', [req.userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a new trigger
router.post('/', async (req, res) => {
    const { name, category } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Trigger name is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO Triggers (user_id, name, category) VALUES ($1, $2, $3) RETURNING id',
            [req.userId, name, category]
        );
        res.status(201).json({ id: result.rows[0].id, user_id: req.userId, name, category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update a trigger
router.put('/:id', async (req, res) => {
    const { name, category } = req.body;
    const { id } = req.params;
    if (!name) {
        return res.status(400).json({ error: 'Trigger name is required' });
    }
    try {
        const result = await pool.query(
            'UPDATE Triggers SET name = $1, category = $2 WHERE id = $3 AND user_id = $4',
            [name, category, id, req.userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Trigger not found or user not authorized' });
        }
        res.json({ id, user_id: req.userId, name, category });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a trigger
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Triggers WHERE id = $1 AND user_id = $2', [id, req.userId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Trigger not found or user not authorized' });
        }
        res.status(204).send(); // No Content
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
