import { useLocation, Link } from 'react-router-dom';

export default function BookingConfirm() {
  const { state } = useLocation();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', textAlign: 'center', padding: 40 }}>
        <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✓</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Booking Confirmed!</h1>
        {state ? (
          <div style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>
            <p>Hi {state.name},</p>
            <p>Your <strong>{state.event}</strong> on</p>
            <p>{state.date} at {state.time} has been confirmed.</p>
            <p style={{ marginTop: 8 }}>A confirmation has been recorded.</p>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Your booking is confirmed!</p>
        )}
        <Link to="/event-types">
          <button className="btn-secondary">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}