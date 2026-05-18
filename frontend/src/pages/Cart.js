import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, total, user } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <div style={{ fontSize: 80 }}>🛒</div>
      <h2>Your cart is empty</h2>
      <button style={styles.btn} onClick={() => navigate('/menu')}>Browse Menu</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Your Cart</h1>
      <div style={styles.items}>
        {cart.map(item => (
          <div key={item.id} style={styles.row}>
            <span style={styles.emoji}>{item.emoji}</span>
            <div style={styles.info}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.price}>₹{item.price} each</div>
            </div>
            <div style={styles.qtyBox}>
              <button style={styles.qBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>−</button>
              <span style={styles.qty}>{item.quantity}</span>
              <button style={styles.qBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
            </div>
            <div style={styles.subtotal}>₹{item.price * item.quantity}</div>
            <button style={styles.del} onClick={() => removeFromCart(item.id)}>🗑</button>
          </div>
        ))}
      </div>
      <div style={styles.summary}>
        <div style={styles.totalRow}><span>Total:</span><span style={styles.totalAmt}>₹{total}</span></div>
        {!user && <p style={{ color: '#C0392B', textAlign: 'center' }}>Please <a href="/#signup">sign up</a> before placing an order.</p>}
        <button style={styles.btn} disabled={!user} onClick={() => navigate('/order-summary')}>
          Proceed to Order
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 800, margin: '0 auto', padding: '32px 24px' },
  title: { color: '#8B1A1A', fontFamily: 'Georgia,serif', fontSize: 28, marginBottom: 24 },
  empty: { textAlign: 'center', padding: 80 },
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  row: { display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '14px 18px', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.08)' },
  emoji: { fontSize: 36 },
  info: { flex: 1 },
  name: { fontWeight: 600, fontSize: 16 },
  price: { color: '#777', fontSize: 13 },
  qtyBox: { display: 'flex', alignItems: 'center', gap: 8 },
  qBtn: { background: '#C0392B', color: '#fff', border: 'none', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 },
  qty: { fontWeight: 'bold', fontSize: 16, minWidth: 24, textAlign: 'center' },
  subtotal: { fontWeight: 'bold', color: '#C0392B', minWidth: 60, textAlign: 'right' },
  del: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 },
  summary: { marginTop: 24, background: '#FFF8F0', padding: 20, borderRadius: 10 },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  totalAmt: { color: '#C0392B' },
  btn: { width: '100%', background: '#C0392B', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
};
