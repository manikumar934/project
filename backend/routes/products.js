const router = require('express').Router();
const db = require('../db');

// GET /api/products?category=sweets
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = `SELECT p.*, c.name as category_name, c.slug
                 FROM products p JOIN categories c ON p.category_id = c.id`;
    const params = [];
    if (category) {
      query += ' WHERE c.slug = ?';
      params.push(category);
    }
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
