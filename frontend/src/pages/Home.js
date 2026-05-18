import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useCart } from '../CartContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Home() {
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [msg, setMsg] = useState('');
  const { setUser } = useCart();
  const navigate = useNavigate();

  const filtered = products.filter(p => p.category_id === activeTab);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/users/signup`, form);
      setUser({ ...form, id: res.data.userId });
      setMsg('✅ Signup successful! You can now place orders.');
      setForm({ name: '', phone: '', address: '' });
    } catch (err) {
      setMsg(err.response?.data?.error || '❌ Signup failed. Try again.');
    }
  };

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroEmoji}>🏪</div>
          <h1 style={styles.heroTitle}>Sri Lakshmi Rama Sweets and Bakery</h1>
          <p style={styles.heroSub}>Established Since 1993 · Serving Happiness for 30+ Years</p>
          <p style={styles.heroContact}>📞 8522933933</p>
          <button style={styles.heroBtn} onClick={() => navigate('/menu')}>Explore Our Menu</button>
        </div>
      </div>

      {/* Categories */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Categories</h2>
        <div style={styles.catGrid}>
          {categories.map(c => (
            <div key={c.id} style={styles.catCard} onClick={() => { setActiveTab(c.id); document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); }}>
              <div style={styles.catIcon}>{c.icon}</div>
              <div style={styles.catName}>{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div id="products" style={{ ...styles.section, background: '#FFF8F0' }}>
        <h2 style={styles.sectionTitle}>Our Products</h2>
        <div style={styles.tabs}>
          {categories.map(c => (
            <button key={c.id} style={{ ...styles.tab, ...(activeTab === c.id ? styles.tabActive : {}) }} onClick={() => setActiveTab(c.id)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        <div style={styles.productGrid}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>

      {/* Signup */}
      <div id="signup" style={styles.section}>
        <h2 style={styles.sectionTitle}>Sign Up to Order</h2>
        <form style={styles.form} onSubmit={handleSignup}>
          <input style={styles.input} placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input style={styles.input} placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <textarea style={{ ...styles.input, height: 80 }} placeholder="Delivery Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
          <button style={styles.submitBtn} type="submit">Sign Up & Start Ordering</button>
          {msg && <p style={{ textAlign: 'center', color: msg.startsWith('✅') ? 'green' : 'red' }}>{msg}</p>}
        </form>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>🏪 Sri Lakshmi Rama Sweets and Bakery · Est. 1993 · 📞 8522933933</p>
        <p style={{ fontSize: 13, marginTop: 4 }}>© 2024 All Rights Reserved</p>
      </footer>
    </div>
  );
}

const styles = {
  hero: { background: 'linear-gradient(135deg,#8B1A1A 0%,#C0392B 50%,#E74C3C 100%)', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: { textAlign: 'center', padding: 40 },
  heroEmoji: { fontSize: 72, marginBottom: 10 },
  heroTitle: { color: '#FFD700', fontSize: 36, fontFamily: 'Georgia,serif', margin: '0 0 10px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' },
  heroSub: { color: '#FFE4B5', fontSize: 18, margin: '0 0 8px' },
  heroContact: { color: '#FFD700', fontSize: 20, fontWeight: 'bold', margin: '0 0 20px' },
  heroBtn: { background: '#FFD700', color: '#8B1A1A', border: 'none', padding: '12px 32px', borderRadius: 25, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
  section: { padding: '48px 24px', maxWidth: 1100, margin: '0 auto' },
  sectionTitle: { textAlign: 'center', fontSize: 28, color: '#8B1A1A', fontFamily: 'Georgia,serif', marginBottom: 32 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 20 },
  catCard: { background: 'linear-gradient(135deg,#FFF3E0,#FFE0B2)', borderRadius: 12, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' },
  catIcon: { fontSize: 48, marginBottom: 8 },
  catName: { fontWeight: 'bold', color: '#8B1A1A', fontSize: 16 },
  tabs: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 },
  tab: { background: '#fff', border: '2px solid #C0392B', color: '#C0392B', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontWeight: 500 },
  tabActive: { background: '#C0392B', color: '#fff' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 },
  form: { maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 },
  input: { padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, outline: 'none', resize: 'vertical' },
  submitBtn: { background: '#C0392B', color: '#fff', border: 'none', padding: '13px', borderRadius: 8, fontSize: 16, fontWeight: 'bold', cursor: 'pointer' },
  footer: { background: '#8B1A1A', color: '#FFE4B5', textAlign: 'center', padding: '24px 16px' },
};
