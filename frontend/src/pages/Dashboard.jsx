import { useState, useEffect } from 'react';
import { getEventTypes, getBookings } from '../api';
import { format, isPast } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [eventTypes, setEventTypes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEventTypes(), getBookings()]).then(([et, bk]) => {
      setEventTypes(et.data);
      setBookings(bk.data);
      setLoading(false);
    });
  }, []);

  const upcomingBookings = bookings.filter(
    b => !isPast(new Date(b.start_time)) && b.status === 'confirmed'
  );

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
          Welcome back, John Doe!
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
            {eventTypes.length}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Event Types
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
            {upcomingBookings.length}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Upcoming Bookings
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)' }}>
            {bookings.length}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Total Bookings
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Upcoming Bookings</h2>
          <Link to="/bookings">
            <button className="btn-secondary" style={{ fontSize: 13 }}>View All</button>
          </Link>
        </div>
        {upcomingBookings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <p style={{ color: 'var(--text-muted)' }}>No upcoming bookings yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingBookings.slice(0, 3).map(b => (
              <div key={b.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ textAlign: 'center', minWidth: 48 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    {format(new Date(b.start_time), 'MMM')}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                    {format(new Date(b.start_time), 'd')}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{b.event_title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {b.booker_name} · {format(new Date(b.start_time), 'h:mm a')}
                  </div>
                </div>
                <span className="badge badge-green">confirmed</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Types */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Your Event Types</h2>
          <Link to="/event-types">
            <button className="btn-secondary" style={{ fontSize: 13 }}>Manage</button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {eventTypes.map(et => (
            <div key={et.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: et.is_active ? 'var(--success)' : 'var(--text-light)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{et.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {et.duration} min · /johndoe/{et.slug}
                </div>
              </div>
              <button className="btn-secondary" style={{ fontSize: 13 }}
                onClick={() => navigator.clipboard.writeText(
                  `${window.location.origin}/johndoe/${et.slug}`
                )}>
                Copy Link
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}