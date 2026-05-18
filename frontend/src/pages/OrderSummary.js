import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function OrderSummary() {
  const { cart, total, user, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      const items = cart.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price }));
      const res = await axios.post(`${API}/api/orders`, { userId: user.id, items });
      setOrderId(res.data.orderId);
      setPlaced(true);
      clearCart();
    } catch {
      setError('Failed to place order. Please try again.');
    }
  };

  if (placed) return (
    <div style={styles.success}>
      <div style={{ fontSize: 80 }}>🎉</div>
      <h2 style={{ color: '#27AE60' }}>Order Placed Successfully!</h2>
      <p>Order ID: <strong>#{orderId}</strong></p>
      <p>Thank you, <strong>{user?.name}</strong>! We'll deliver to your address soon.</p>
      <button style={styles.btn} onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );

  if (!user) return (
    <div style={styles.success}>
      <p>Please sign up first.</p>
      <button style={styles.btn} onClick={() => navigate('/')}>Go Home</button>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Order Summary</h1>
      <div style={styles.userBox}>
        <h3>Delivering to:</h3>
        <p><strong>{user.name}</strong> · 📞 {user.phone}</p>
        <p>📍 {user.address}</p>
      </div>
      <div style={styles.items}>
        {cart.map(item => (
          <div key={item.id} style={styles.row}>
            <span>{item.emoji} {item.name}</span>
            <span>x{item.quantity}</span>
            <span style={{ color: '#C0392B', fontWeight: 'bold' }}>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div style={styles.totalRow}>
        <span>Grand Total:</span>
        <span style={{ color: '#C0392B', fontWeight: 'bold', fontSize: 22 }}>₹{total}</span>
      </div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <button style={styles.btn} onClick={placeOrder}>Confirm & Place Order</button>
    </div>
  );
}

const styles = {
  page: { maxWidth: 600, margin: '0 auto', padding: '32px 24px' },
  title: { color: '#8B1A1A', fontFamily: 'Georgia,serif', fontSize: 28, marginBottom: 20 },
  userBox: { background: '#FFF8F0', padding: 16, borderRadius: 10, marginBottom: 20, borderLeft: '4px solid #C0392B' },
  items: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  row: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: 20, padding: '14px 0', borderTop: '2px solid #eee', marginBottom: 20 },
  btn: { width: '100%', background: '#C0392B', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
  success: { textAlign: 'center', padding: 80 },
};
