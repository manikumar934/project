import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/')}>
        <span style={styles.logo}>🏪</span>
        <div>
          <div style={styles.brandName}>Sri Lakshmi Rama</div>
          <div style={styles.brandSub}>Sweets & Bakery</div>
        </div>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/menu" style={styles.link}>Menu</Link>
        <Link to="/signup" style={styles.link}>Sign Up</Link>
        <Link to="/cart" style={styles.cartBtn}>
          🛒 Cart {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: 'linear-gradient(135deg,#8B1A1A,#C0392B)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', position: 'sticky', top: 0, zIndex: 100 },
  brand: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
  logo: { fontSize: 32 },
  brandName: { color: '#FFD700', fontWeight: 'bold', fontSize: 18, fontFamily: 'Georgia,serif' },
  brandSub: { color: '#FFE4B5', fontSize: 12 },
  links: { display: 'flex', gap: 20, alignItems: 'center' },
  link: { color: '#FFE4B5', textDecoration: 'none', fontWeight: 500, fontSize: 15 },
  cartBtn: { background: '#FFD700', color: '#8B1A1A', padding: '6px 14px', borderRadius: 20, textDecoration: 'none', fontWeight: 'bold', position: 'relative' },
  badge: { background: '#8B1A1A', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: 11, marginLeft: 4 },
};
