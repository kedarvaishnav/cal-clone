import { useState, useEffect } from 'react';
import { getBookings, cancelBooking } from '../api';
import { format, isPast } from 'date-fns';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await getBookings();
    setBookings(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    load();
  };

  const filtered = bookings.filter(b => {
    const past = isPast(new Date(b.start_time));
    if (filter === 'upcoming') return !past && b.status === 'confirmed';
    if (filter === 'past') return past || b.status === 'cancelled';
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Bookings</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>See who has scheduled time with you.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['upcoming', 'past'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500,
              background: filter === f ? 'var(--accent)' : 'var(--surface)',
              color: filter === f ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--border)', cursor: 'pointer'
            }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <p>Loading...</p> : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: 'var(--text-muted)' }}>No {filter} bookings.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => (
            <div key={b.id} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'center', minWidth: 56 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {format(new Date(b.start_time), 'MMM')}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                  {format(new Date(b.start_time), 'd')}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{b.event_title}</span>
                  <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-red'}`}>
                    {b.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {format(new Date(b.start_time), 'EEEE, MMMM d · h:mm a')} – {format(new Date(b.end_time), 'h:mm a')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                  {b.booker_name} · {b.booker_email}
                </div>
              </div>
              {b.status === 'confirmed' && !isPast(new Date(b.start_time)) && (
                <button className="btn-danger" style={{ fontSize: 12, padding: '6px 12px' }}
                  onClick={() => handleCancel(b.id)}>
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}