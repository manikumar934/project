const router = require('express').Router();
const db = require('../db');

// POST /api/orders
router.post('/', async (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || !items.length)
    return res.status(400).json({ error: 'userId and items are required' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const [order] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const orderId = order.insertId;
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }
    await conn.commit();
    res.status(201).json({ message: 'Order placed', orderId, total });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: 'Order failed' });
  } finally {
    conn.release();
  }
});

// GET /api/orders/:userId
router.get('/:userId', async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.total, o.status, o.created_at,
              JSON_ARRAYAGG(JSON_OBJECT(
                'product', p.name, 'quantity', oi.quantity, 'price', oi.price
              )) as items
       FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = ?
       GROUP BY o.id`,
      [req.params.userId]
    );
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
