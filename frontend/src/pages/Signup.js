import { useState } from 'react';
import axios from 'axios';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Signup() {
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [msg, setMsg] = useState('');
  const { setUser } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/users/signup`, form);
      setUser({ ...form, id: res.data.userId });
      setMsg('✅ Signup successful!');
      setTimeout(() => navigate('/menu'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Signup failed.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ fontSize: 56, textAlign: 'center' }}>🏪</div>
        <h2 style={styles.title}>Create Your Account</h2>
        <p style={styles.sub}>Sign up to place orders at Sri Lakshmi Rama Sweets & Bakery</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <textarea style={{ ...styles.input, height: 90 }} placeholder="Delivery Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          <button style={styles.btn} type="submit">Sign Up</button>
          {msg && <p style={{ textAlign: 'center', color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F0', padding: 24 },
  card: { background: '#fff', borderRadius: 16, padding: '40px 36px', maxWidth: 440, width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title: { textAlign: 'center', color: '#8B1A1A', fontFamily: 'Georgia,serif', fontSize: 24, margin: '12px 0 6px' },
  sub: { textAlign: 'center', color: '#777', fontSize: 14, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: { padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, outline: 'none', resize: 'vertical' },
  btn: { background: '#C0392B', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
};
