import React, { useState, useRef } from 'react';
import { useInView, useEmailJS } from '../hooks';
import { CONTACT_INFO, EMAILJS_CONFIG } from '../data';
import type { BookingFormData, ToastState } from '../types';

interface ContactProps {
  preselectedService?: string;
  onServiceConsumed?: () => void;
}

const SERVICES = [
  'Essential Clean', 'Premium Detail', 'Ultimate Spa',
  'Engine Bay Steam Clean', 'Tyre & Alloy Wheel Clean',
  'SUV / Commercial Wash', 'Add-on Only', 'General Query',
];
const VEHICLES = ['Hatchback', 'Sedan', 'SUV / MUV', 'Commercial Van', 'Motorcycle / Scooter'];

const Contact: React.FC<ContactProps> = ({ preselectedService, onServiceConsumed }) => {
  const emailJSReady = useEmailJS(EMAILJS_CONFIG.publicKey);

  const [form, setForm] = useState<BookingFormData>({
    from_name: '', from_email: '', phone: '',
    service: '', vehicle: '', preferred_date: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: '', status: 'idle' });

  // Apply preselected plan from Pricing section
  React.useEffect(() => {
    if (preselectedService) {
      setForm(f => ({ ...f, service: preselectedService }));
      onServiceConsumed?.();
    }
  }, [preselectedService]);

  const showToast = (message: string, isError = false) => {
    setToast({ message, status: isError ? 'error' : 'success' });
    setTimeout(() => setToast({ message: '', status: 'idle' }), 6000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailJSReady) {
      showToast('Email service not loaded yet. Please try again.', true);
      return;
    }

    setSubmitting(true);
    const ejs = (window as any).emailjs;

    const payload = {
      ...form,
      preferred_date: form.preferred_date || 'Not specified',
      message: form.message || 'No additional notes.',
      to_email: EMAILJS_CONFIG.businessEmail,
      business_name: 'Wash For You',
    };

    try {
      await ejs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateToOwner, payload);
      await ejs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateToUser, {
        ...payload,
        to_email: form.from_email,
      });
      showToast('✅ Booking submitted! A confirmation email is on its way to you.');
      setForm({ from_name: '', from_email: '', phone: '', service: '', vehicle: '', preferred_date: '', message: '' });
    } catch (err) {
      console.error(err);
      showToast('❌ Something went wrong. Please call us directly or try again.', true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{
      padding: '100px 5%',
      background: 'linear-gradient(160deg, #0A2540 0%, #0F3875 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: -200, left: -200,
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(62,207,207,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 80, alignItems: 'start',
        position: 'relative', zIndex: 2,
      }}>
        <ContactInfo />
        <BookingForm
          form={form}
          submitting={submitting}
          toast={toast}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

/* ─── Left: Contact Info ─── */
const ContactInfo: React.FC = () => {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`fade-up${inView ? ' visible' : ''}`}>
      <div className="section-label" style={{ color: '#3ECFCF' }}>Get in Touch</div>
      <h2 className="section-title" style={{ color: '#fff' }}>
        Visit, Call,<br />or Book Online
      </h2>
      <p className="section-sub" style={{ color: 'rgba(255,255,255,0.65)' }}>
        We're here every day of the week. Drop by any of our Kolkata locations,
        give us a call, or fill the form to book your slot.
      </p>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {CONTACT_INFO.map((c, i) => (
          <ContactCard key={i} icon={c.icon} label={c.label} value={c.value} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 28 }}>
        {['Mon – Sat: 8 AM – 8 PM', 'Sunday: 9 AM – 6 PM'].map(h => (
          <span key={h} style={{
            background: 'rgba(41,121,216,0.25)',
            border: '1px solid rgba(41,121,216,0.4)',
            borderRadius: 8, padding: '6px 14px',
            fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500,
          }}>{h}</span>
        ))}
      </div>
    </div>
  );
};

const ContactCard: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => {
  const [hovered, setHovered] = React.useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? ' visible' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 14, padding: '20px 22px',
        display: 'flex', alignItems: 'center', gap: 16,
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div style={{
        width: 46, height: 46, flexShrink: 0,
        background: 'rgba(62,207,207,0.18)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 3 }}>{label}</div>
        <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.95rem' }}>{value}</div>
      </div>
    </div>
  );
};

/* ─── Right: Booking Form ─── */
interface BookingFormProps {
  form: BookingFormData;
  submitting: boolean;
  toast: ToastState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px',
  border: '1.5px solid rgba(41,121,216,0.2)',
  borderRadius: 10,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.92rem', color: '#0A2540',
  background: '#F3F8FF',
  outline: 'none',
  transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
};

const FocusableInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? '#2979D8' : 'rgba(41,121,216,0.2)',
        background: focused ? '#fff' : '#F3F8FF',
        boxShadow: focused ? '0 0 0 4px rgba(41,121,216,0.1)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const FocusableSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <select
      {...props}
      style={{
        ...inputStyle,
        borderColor: focused ? '#2979D8' : 'rgba(41,121,216,0.2)',
        background: focused ? '#fff' : '#F3F8FF',
        boxShadow: focused ? '0 0 0 4px rgba(41,121,216,0.1)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  );
};

const BookingForm: React.FC<BookingFormProps> = ({ form, submitting, toast, onChange, onSubmit }) => {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [btnHovered, setBtnHovered] = React.useState(false);

  return (
    <div
      ref={ref}
      className={`fade-up${inView ? ' visible' : ''}`}
      style={{
        background: '#fff', borderRadius: 24, padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(10,37,64,0.18)',
      }}
    >
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.5rem', fontWeight: 800,
        color: '#0A2540', marginBottom: 6,
      }}>
        Book a Service or Send a Query
      </div>
      <div style={{ fontSize: '0.88rem', color: '#4A6FA5', marginBottom: 32 }}>
        We'll confirm your booking via email within 30 minutes.
      </div>

      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormGroup label="Full Name *">
            <FocusableInput type="text" name="from_name" value={form.from_name}
              onChange={onChange} placeholder="Rahul Sharma" required />
          </FormGroup>
          <FormGroup label="Phone / WhatsApp *">
            <FocusableInput type="tel" name="phone" value={form.phone}
              onChange={onChange} placeholder="+91 98300 00000" required />
          </FormGroup>
        </div>

        <FormGroup label="Email Address *">
          <FocusableInput type="email" name="from_email" value={form.from_email}
            onChange={onChange} placeholder="rahul@example.com" required />
        </FormGroup>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormGroup label="Service Required *">
            <FocusableSelect name="service" value={form.service} onChange={onChange} required>
              <option value="" disabled>Select a service…</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </FocusableSelect>
          </FormGroup>
          <FormGroup label="Vehicle Type *">
            <FocusableSelect name="vehicle" value={form.vehicle} onChange={onChange} required>
              <option value="" disabled>Select vehicle…</option>
              {VEHICLES.map(v => <option key={v}>{v}</option>)}
            </FocusableSelect>
          </FormGroup>
        </div>

        <FormGroup label="Preferred Date & Time">
          <FocusableInput type="datetime-local" name="preferred_date"
            value={form.preferred_date} onChange={onChange} />
        </FormGroup>

        <FormGroup label="Additional Notes / Query">
          <FocusableTextarea name="message" value={form.message} onChange={onChange}
            rows={4} placeholder="Any special requests, add-ons, or questions…" />
        </FormGroup>

        <button
          type="submit"
          disabled={submitting}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: '100%', padding: 15,
            background: 'linear-gradient(135deg, #2979D8, #1A4F8A)',
            color: '#fff', border: 'none', borderRadius: 12,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '1rem', fontWeight: 700,
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1,
            boxShadow: btnHovered && !submitting
              ? '0 12px 30px rgba(41,121,216,0.45)'
              : '0 6px 20px rgba(41,121,216,0.35)',
            transform: btnHovered && !submitting ? 'translateY(-2px)' : 'none',
            transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          {submitting ? '⏳ Sending…' : '📅 Submit Booking / Query'}
        </button>

        <p style={{ fontSize: '0.78rem', color: '#4A6FA5', textAlign: 'center', marginTop: 12 }}>
          🔒 Your information is safe with us. We never share your data.
        </p>

        {toast.status !== 'idle' && (
          <div style={{
            background: toast.status === 'success' ? '#E8F7F0' : '#FEF0F0',
            border: `1.5px solid ${toast.status === 'success' ? '#27AE60' : '#E74C3C'}`,
            color: toast.status === 'success' ? '#1A7245' : '#922B2B',
            borderRadius: 10, padding: '14px 18px',
            fontSize: '0.88rem', fontWeight: 500,
            marginTop: 16, textAlign: 'center',
            animation: 'heroFadeUp 0.4s ease',
          }}>
            {toast.message}
          </div>
        )}
      </form>
    </div>
  );
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{
      display: 'block', fontSize: '0.82rem', fontWeight: 600,
      color: '#0A2540', marginBottom: 7, letterSpacing: '0.02em',
    }}>
      {label}
    </label>
    {children}
  </div>
);

const FocusableTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      {...props}
      style={{
        ...inputStyle,
        resize: 'vertical',
        borderColor: focused ? '#2979D8' : 'rgba(41,121,216,0.2)',
        background: focused ? '#fff' : '#F3F8FF',
        boxShadow: focused ? '0 0 0 4px rgba(41,121,216,0.1)' : 'none',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

export default Contact;
