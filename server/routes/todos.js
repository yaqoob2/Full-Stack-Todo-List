const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

// Get all todos for user
router.get('/', async (req, res) => {
    try {
        const [todos] = await db.execute('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create todo
router.post('/', async (req, res) => {
    const { title, description, due_date, reminder_at } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO todos (user_id, title, description, due_date, reminder_at) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, title, description, due_date, reminder_at]
        );
        const [newTodo] = await db.execute('SELECT * FROM todos WHERE id = ?', [result.insertId]);
        res.status(201).json(newTodo[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update todo
router.put('/:id', async (req, res) => {
    const { title, description, is_completed, due_date, reminder_at, timer_seconds } = req.body;
    try {
        // Check ownership
        const [existing] = await db.execute('SELECT * FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Todo not found' });

        await db.execute(
            'UPDATE todos SET title = ?, description = ?, is_completed = ?, due_date = ?, reminder_at = ?, timer_seconds = ? WHERE id = ?',
            [
                title || existing[0].title,
                description || existing[0].description,
                is_completed !== undefined ? is_completed : existing[0].is_completed,
                due_date !== undefined ? due_date : existing[0].due_date,
                reminder_at !== undefined ? reminder_at : existing[0].reminder_at,
                timer_seconds !== undefined ? timer_seconds : existing[0].timer_seconds,
                req.params.id
            ]
        );

        const [updated] = await db.execute('SELECT * FROM todos WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete todo
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
