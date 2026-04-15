import { useState, useEffect } from 'react';
import { getEventTypes, createEventType, updateEventType, deleteEventType } from '../api';

const DURATIONS = [15, 30, 45, 60, 90, 120];

function EventTypeModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { title: '', slug: '', description: '', duration: 30 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
          {initial ? 'Edit Event Type' : 'New Event Type'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input value={form.title} onChange={e => {
              const t = e.target.value;
              setForm(f => ({ ...f, title: t, slug: f.slug || t.toLowerCase().replace(/\s+/g, '-') }));
            }} required placeholder="30 Minute Meeting" />
          </div>
          <div className="form-group">
            <label>URL Slug</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required placeholder="30min" />
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              cal.clone/johndoe/{form.slug || 'your-slug'}
            </p>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief description..." />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}>
              {DURATIONS.map(d => <option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
          {error && <p style={{ color: 'var(--danger)', marginBottom: 12, fontSize: 13 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | event object
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await getEventTypes();
    setEventTypes(res.data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (modal === 'new') {
      await createEventType(form);
    } else {
      await updateEventType(modal.id, form);
    }
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    await deleteEventType(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Event Types</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Create events people can book through your booking page.</p>
        </div>
        <button className="btn-primary" onClick={() => setModal('new')}>+ New Event Type</button>
      </div>

      {loading ? <p style={{ color: 'var(--text-muted)' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {eventTypes.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: 'var(--text-muted)' }}>No event types yet. Create your first one!</p>
            </div>
          )}
          {eventTypes.map(et => (
            <div key={et.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: et.is_active ? 'var(--success)' : 'var(--text-light)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{et.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                  /{et.slug} · {et.duration} min
                </div>
                {et.description && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{et.description}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-secondary" style={{ fontSize: 13 }}
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/johndoe/${et.slug}`)}>
                  Copy Link
                </button>
                <button className="btn-secondary" style={{ fontSize: 13 }} onClick={() => setModal(et)}>Edit</button>
                <button className="btn-danger" style={{ fontSize: 13 }} onClick={() => handleDelete(et.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <EventTypeModal
          initial={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}