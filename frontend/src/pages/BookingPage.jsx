import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSlots, createBooking } from '../api';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';

export default function BookingPage() {
  const { username, slug } = useParams();
  const navigate = useNavigate();
  const [eventType, setEventType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [step, setStep] = useState('calendar'); // 'calendar' | 'time' | 'form'
  const [form, setForm] = useState({ name: '', email: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = startOfDay(new Date());
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  const startPad = startOfMonth(currentMonth).getDay();

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    const res = await getSlots(username, slug, dateStr);
    setEventType(res.data.eventType);
    setSlots(res.data.slots);
    setStep('time');
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep('form');
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const [h, m] = selectedSlot.split(':');
      const startTime = new Date(selectedDate);
      startTime.setHours(Number(h), Number(m), 0, 0);

      await createBooking({
        event_type_id: eventType.id,
        booker_name: form.name,
        booker_email: form.email,
        start_time: startTime.toISOString(),
        notes: form.notes
      });

      navigate('/booking/confirmed', {
        state: { name: form.name, event: eventType.title, date: dateStr, time: selectedSlot }
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 900, flexWrap: 'wrap' }}>

        {/* Left panel */}
        <div className="card" style={{ width: 280, flexShrink: 0 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>J</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>John Doe</div>
          {eventType ? (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{eventType.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
                🕐 {eventType.duration} minutes
              </div>
              {eventType.description && <div style={{ marginTop: 12, fontSize: 14, color: 'var(--text-muted)' }}>{eventType.description}</div>}
            </>
          ) : (
            <div style={{ fontSize: 20, fontWeight: 700 }}>{slug}</div>
          )}
          {selectedDate && (
            <div style={{ marginTop: 16, padding: '12px', background: 'var(--bg)', borderRadius: 8, fontSize: 13 }}>
              📅 {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              {selectedSlot && <div style={{ marginTop: 4, color: 'var(--accent)', fontWeight: 600 }}>🕐 {selectedSlot}</div>}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="card" style={{ flex: 1, minWidth: 300 }}>

          {/* STEP: Calendar */}
          {step === 'calendar' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <button className="btn-secondary" style={{ padding: '4px 10px' }}
                  onClick={() => setCurrentMonth(m => addDays(startOfMonth(m), -1))}>‹</button>
                <span style={{ fontWeight: 600 }}>{format(currentMonth, 'MMMM yyyy')}</span>
                <button className="btn-secondary" style={{ padding: '4px 10px' }}
                  onClick={() => setCurrentMonth(m => addDays(endOfMonth(m), 1))}>›</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 8 }}>
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
                {Array(startPad).fill(null).map((_, i) => <div key={`pad-${i}`} />)}
                {days.map(day => {
                  const past = isBefore(day, today);
                  const selected = selectedDate && isSameDay(day, selectedDate);
                  return (
                    <button key={day.toISOString()} onClick={() => !past && handleDateSelect(day)}
                      disabled={past}
                      style={{
                        aspectRatio: '1', borderRadius: '50%', border: 'none',
                        background: selected ? 'var(--accent)' : 'transparent',
                        color: selected ? 'white' : past ? 'var(--text-light)' : 'var(--text)',
                        cursor: past ? 'not-allowed' : 'pointer',
                        fontWeight: selected ? 600 : 400,
                        fontSize: 13
                      }}>
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP: Time Slots */}
          {step === 'time' && (
            <div>
              <button className="btn-secondary" style={{ marginBottom: 16, fontSize: 13 }}
                onClick={() => setStep('calendar')}>← Back</button>
              <h3 style={{ fontWeight: 600, marginBottom: 16 }}>
                {selectedDate && format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              {slots.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                  No available slots on this day.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {slots.map(slot => (
                    <button key={slot} onClick={() => handleSlotSelect(slot)}
                      style={{
                        padding: '12px', border: '1px solid var(--border)',
                        borderRadius: 8, background: 'white', fontWeight: 500,
                        textAlign: 'center', fontSize: 15, color: 'var(--text)',
                        transition: 'all 0.15s', cursor: 'pointer'
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text)'; }}>
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP: Booking Form */}
          {step === 'form' && (
            <div>
              <button className="btn-secondary" style={{ marginBottom: 16, fontSize: 13 }}
                onClick={() => setStep('time')}>← Back</button>
              <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Enter your details</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                {selectedDate && format(selectedDate, 'EEEE, MMMM d')} at {selectedSlot}
              </p>
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label>Your name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Jane Smith" />
                </div>
                <div className="form-group">
                  <label>Email address *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required placeholder="jane@example.com" />
                </div>
                <div className="form-group">
                  <label>Additional notes</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Anything you'd like to share..." />
                </div>
                {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: 12 }}>
                  {loading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}