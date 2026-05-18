const router = require('express').Router();
const db = require('../db');

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  const { name, phone, address } = req.body;
  if (!name || !phone || !address)
    return res.status(400).json({ error: 'name, phone, and address are required' });
  try {
    const [result] = await db.query(
      'INSERT INTO users (name, phone, address) VALUES (?, ?, ?)',
      [name, phone, address]
    );
    res.status(201).json({ message: 'Signup successful', userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ error: 'Phone number already registered' });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
