import React from 'react';
import { useInView } from '../hooks';
import { PRICING_PLANS, ADDONS } from '../data';
import type { PricingPlan, AddonItem } from '../types';

interface PricingProps {
  onSelectPlan: (planName: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => (
  <section id="pricing" style={{ padding: '100px 5%', background: '#fff' }}>
    <div style={{ marginBottom: 56 }}>
      <div className="section-label">Transparent Pricing</div>
      <h2 className="section-title">Simple, Honest Rates</h2>
      <p className="section-sub">
        No hidden charges. No upselling. Just premium eco-friendly steam wash
        at fair prices across Kolkata.
      </p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 28, alignItems: 'start',
    }}>
      {PRICING_PLANS.map((plan, i) => (
        <PricingCard
          key={i}
          plan={plan}
          delay={i * 100}
          onSelect={() => onSelectPlan(plan.name)}
        />
      ))}
    </div>

    {/* Add-ons */}
    <div style={{ marginTop: 72 }}>
      <h3 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5rem', fontWeight: 800,
        color: '#0A2540', marginBottom: 28,
        textAlign: 'center',
      }}>
        À La Carte Add-Ons
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
      }}>
        {ADDONS.map((addon, i) => (
          <AddonCard key={i} addon={addon} delay={i * 80} />
        ))}
      </div>
    </div>
  </section>
);

const PricingCard: React.FC<{
  plan: PricingPlan;
  delay: number;
  onSelect: () => void;
}> = ({ plan, delay, onSelect }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);
  const [btnHovered, setBtnHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? ' visible' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20,
        padding: '40px 32px',
        border: plan.featured ? 'none' : '2px solid #E8F1FB',
        background: plan.featured
          ? 'linear-gradient(160deg, #0A2540, #1A4F8A)'
          : '#fff',
        color: plan.featured ? '#fff' : '#0A2540',
        transform: plan.featured
          ? hovered ? 'scale(1.04) translateY(-6px)' : 'scale(1.04)'
          : hovered ? 'translateY(-6px)' : 'none',
        boxShadow: plan.featured || hovered
          ? '0 20px 60px rgba(10,37,64,0.18)'
          : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative',
        transitionDelay: `${delay}ms`,
      }}
    >
      {plan.featured && (
        <div style={{
          position: 'absolute', top: -14, left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, #3ECFCF, #6FE0E0)',
          color: '#0A2540',
          fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '5px 18px', borderRadius: 50,
          whiteSpace: 'nowrap',
        }}>
          ⭐ Most Chosen
        </div>
      )}

      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.3rem', fontWeight: 700, marginBottom: 6,
      }}>
        {plan.name}
      </div>
      <div style={{
        fontSize: '0.85rem', marginBottom: 24,
        color: plan.featured ? 'rgba(255,255,255,0.6)' : '#4A6FA5',
      }}>
        {plan.tagline}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>₹</span>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '3rem', fontWeight: 900, lineHeight: 1,
        }}>
          {plan.price.toLocaleString('en-IN')}
        </span>
      </div>
      <div style={{
        fontSize: '0.82rem', marginBottom: 28,
        color: plan.featured ? 'rgba(255,255,255,0.55)' : '#4A6FA5',
      }}>
        {plan.vehicleNote}
      </div>

      <ul style={{ listStyle: 'none', marginBottom: 32 }}>
        {plan.features.map((f, i) => (
          <li key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: '0.9rem', padding: '7px 0',
            borderBottom: plan.featured
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(41,121,216,0.08)',
          }}>
            <span style={{
              width: 20, height: 20, flexShrink: 0,
              background: plan.featured ? 'rgba(62,207,207,0.25)' : '#E8F1FB',
              color: plan.featured ? '#3ECFCF' : '#2979D8',
              borderRadius: '50%',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800,
            }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%', padding: 14,
          borderRadius: 12,
          border: plan.featured ? 'none' : `2px solid ${btnHovered ? 'transparent' : '#2979D8'}`,
          background: plan.featured
            ? btnHovered
              ? 'linear-gradient(135deg, #27B5B5, #1E9B9B)'
              : 'linear-gradient(135deg, #3ECFCF, #27B5B5)'
            : btnHovered ? '#2979D8' : 'transparent',
          color: plan.featured ? '#0A2540' : btnHovered ? '#fff' : '#2979D8',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.95rem', fontWeight: 700,
          cursor: 'pointer',
          boxShadow: plan.featured
            ? btnHovered
              ? '0 10px 28px rgba(62,207,207,0.5)'
              : '0 6px 20px rgba(62,207,207,0.35)'
            : 'none',
          transform: plan.featured && btnHovered ? 'translateY(-2px)' : 'none',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        Book This Plan
      </button>
    </div>
  );
};

const AddonCard: React.FC<{ addon: AddonItem; delay: number }> = ({ addon, delay }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? ' visible' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#E8F1FB' : '#F3F8FF',
        border: '1px solid rgba(41,121,216,0.12)',
        borderRadius: 14, padding: '22px 18px',
        textAlign: 'center',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{addon.emoji}</div>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{addon.name}</div>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.25rem', fontWeight: 900, color: '#2979D8',
      }}>
        ₹{addon.price}
      </div>
    </div>
  );
};

export default Pricing;
