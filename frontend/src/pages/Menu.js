import { useState } from 'react';
import { categories, products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Menu() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? products : products.filter(p => {
    const cat = categories.find(c => c.id === p.category_id);
    return cat?.slug === active;
  });

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Our Full Menu</h1>
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(active === 'all' ? styles.active : {}) }} onClick={() => setActive('all')}>All Items</button>
        {categories.map(c => (
          <button key={c.slug} style={{ ...styles.tab, ...(active === c.slug ? styles.active : {}) }} onClick={() => setActive(c.slug)}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>
      <div style={styles.grid}>
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px' },
  title: { textAlign: 'center', color: '#8B1A1A', fontFamily: 'Georgia,serif', fontSize: 30, marginBottom: 24 },
  tabs: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 },
  tab: { background: '#fff', border: '2px solid #C0392B', color: '#C0392B', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', fontWeight: 500 },
  active: { background: '#C0392B', color: '#fff' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 20 },
};
