import { useState, useEffect } from 'react';
import { getAvailability, updateAvailability } from '../api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DEFAULT_SLOTS = DAYS.map((_, i) => ({
  day_of_week: i, start_time: '09:00', end_time: '17:00',
  is_available: i >= 1 && i <= 5
}));

export default function Availability() {
  const [slots, setSlots] = useState(DEFAULT_SLOTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAvailability().then(res => {
      if (res.data.length === 0) return;
      const map = {};
      res.data.forEach(r => { map[r.day_of_week] = r; });
      setSlots(DEFAULT_SLOTS.map(s => map[s.day_of_week]
        ? { ...s, ...map[s.day_of_week] } : s));
    });
  }, []);

  const update = (i, field, val) => {
    setSlots(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };

  const handleSave = async () => {
    setSaving(true);
    await updateAvailability(slots);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Availability</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Set when you're available for bookings.</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Weekly Hours</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Asia/Kolkata timezone</div>
        </div>

        {slots.map((slot, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '12px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none'
          }}>
            <div style={{ width: 110 }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                cursor: 'pointer', marginBottom: 0
              }}>
                <input type="checkbox" checked={slot.is_available}
                  onChange={e => update(i, 'is_available', e.target.checked)}
                  style={{ width: 'auto' }} />
                <span style={{ fontWeight: 500, fontSize: 14 }}>{DAYS[slot.day_of_week]}</span>
              </label>
            </div>

            {slot.is_available ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                <input type="time" value={slot.start_time} style={{ maxWidth: 120 }}
                  onChange={e => update(i, 'start_time', e.target.value)} />
                <span style={{ color: 'var(--text-muted)' }}>–</span>
                <input type="time" value={slot.end_time} style={{ maxWidth: 120 }}
                  onChange={e => update(i, 'end_time', e.target.value)} />
              </div>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Unavailable</span>
            )}
          </div>
        ))}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}