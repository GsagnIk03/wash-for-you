import React from 'react';

const Footer: React.FC = () => {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const links = [
    { label: 'Our Story', id: 'history' },
    { label: 'Services',  id: 'services' },
    { label: 'Pricing',   id: 'pricing' },
    { label: 'Contact',   id: 'contact' },
  ];

  return (
    <footer style={{
      background: '#0A2540',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '40px 5%',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 20,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.1rem', fontWeight: 700, color: '#fff',
      }}>
        Wash For<span style={{ color: '#3ECFCF' }}>You</span> — Kolkata
      </div>

      <ul style={{ display: 'flex', gap: 28, listStyle: 'none', flexWrap: 'wrap' }}>
        {links.map(l => (
          <li key={l.id}>
            <FooterLink label={l.label} onClick={() => scrollTo(l.id)} />
          </li>
        ))}
      </ul>

      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)' }}>
        © {new Date().getFullYear()} Wash For You. All rights reserved. 🌿
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.85rem',
        color: hovered ? '#3ECFCF' : 'rgba(255,255,255,0.5)',
        transition: 'color 0.35s ease',
      }}
    >
      {label}
    </button>
  );
};

export default Footer;
