require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const db = require('./db');

const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'bakery-backend' }));

app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

async function initDB() {
  const conn = await db.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(15) NOT NULL UNIQUE,
      address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      slug VARCHAR(50) NOT NULL UNIQUE
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      image_url VARCHAR(255),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  await conn.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Seed categories and products if empty
  const [cats] = await conn.query('SELECT COUNT(*) as cnt FROM categories');
  if (cats[0].cnt === 0) {
    await conn.query(`INSERT INTO categories (name, slug) VALUES
      ('Sweets','sweets'),('Hot Items','hot-items'),('Pastries','pastries'),
      ('Cakes','cakes'),('Cool Drinks','cool-drinks')`);

    await conn.query(`INSERT INTO products (category_id, name, price, image_url) VALUES
      (1,'Kaju Katli',120.00,'/images/kaju-katli.jpg'),
      (1,'Gulab Jamun',60.00,'/images/gulab-jamun.jpg'),
      (1,'Rasgulla',50.00,'/images/rasgulla.jpg'),
      (1,'Mysore Pak',80.00,'/images/mysore-pak.jpg'),
      (1,'Laddu',40.00,'/images/laddu.jpg'),
      (2,'Samosa',15.00,'/images/samosa.jpg'),
      (2,'Veg Puff',20.00,'/images/veg-puff.jpg'),
      (2,'Mirchi Bajji',10.00,'/images/mirchi-bajji.jpg'),
      (2,'Cutlet',25.00,'/images/cutlet.jpg'),
      (2,'Spring Roll',30.00,'/images/spring-roll.jpg'),
      (3,'Chocolate Pastry',60.00,'/images/choc-pastry.jpg'),
      (3,'Black Forest Pastry',65.00,'/images/bf-pastry.jpg'),
      (3,'Vanilla Pastry',55.00,'/images/vanilla-pastry.jpg'),
      (3,'Butterscotch Pastry',60.00,'/images/bs-pastry.jpg'),
      (3,'Red Velvet Pastry',70.00,'/images/rv-pastry.jpg'),
      (4,'Chocolate Cake',450.00,'/images/choc-cake.jpg'),
      (4,'Pineapple Cake',400.00,'/images/pineapple-cake.jpg'),
      (4,'Black Forest Cake',500.00,'/images/bf-cake.jpg'),
      (4,'Fruit Cake',480.00,'/images/fruit-cake.jpg'),
      (4,'Red Velvet Cake',550.00,'/images/rv-cake.jpg'),
      (5,'Coca Cola',40.00,'/images/coca-cola.jpg'),
      (5,'Sprite',40.00,'/images/sprite.jpg'),
      (5,'Fanta',40.00,'/images/fanta.jpg'),
      (5,'Mango Juice',50.00,'/images/mango-juice.jpg'),
      (5,'Chocolate Milkshake',80.00,'/images/choc-milkshake.jpg')`);
  }
  conn.release();
  console.log('Database initialized');
}

initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB init failed:', err); process.exit(1); });
