import { useCart } from '../CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  return (
    <div style={styles.card}>
      <div style={styles.imgBox}>{product.emoji}</div>
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.desc}</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price}</span>
          <button style={styles.btn} onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'default' },
  imgBox: { background: 'linear-gradient(135deg,#FFF3E0,#FFE0B2)', fontSize: 64, textAlign: 'center', padding: '20px 0' },
  body: { padding: '12px 16px' },
  name: { margin: '0 0 4px', fontSize: 16, color: '#333', fontWeight: 600 },
  desc: { margin: '0 0 10px', fontSize: 13, color: '#777' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#C0392B' },
  btn: { background: '#C0392B', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
};
