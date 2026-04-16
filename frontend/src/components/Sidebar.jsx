import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getEventTypes } from '../api';

const mainLinks = [
  { to: '/event-types', icon: '⚡', label: 'Event Types' },
  { to: '/availability', icon: '🗓', label: 'Availability' },
  { to: '/bookings', icon: '📋', label: 'Bookings' },
];

const bottomLinks = [
  { to: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const [publicSlug, setPublicSlug] = useState('');

  useEffect(() => {
    let ignore = false;

    getEventTypes()
      .then((res) => {
        if (!ignore) {
          setPublicSlug(res.data[0]?.slug || '');
        }
      })
      .catch(() => {
        if (!ignore) {
          setPublicSlug('');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const publicPageUrl = publicSlug ? `/johndoe/${publicSlug}` : '/event-types';

  return (
    <aside style={{
      width: 240, minHeight: '100vh',
      background: 'white', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', padding: '20px 0'
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 16
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Cal Clone</span>
        </div>
      </div>

      {/* User info */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#e0e7ff', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontWeight: 600, fontSize: 14
          }}>J</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13 }}>John Doe</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>cal.clone/johndoe</div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{ padding: '12px', flex: 1 }}>
        {mainLinks.map(link => (
          <NavLink key={link.to} to={link.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8, marginBottom: 2,
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--accent)' : 'var(--text-muted)',
            background: isActive ? '#eef2ff' : 'transparent',
            fontSize: 14, transition: 'all 0.15s', textDecoration: 'none'
          })}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Links */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>

        {/* View Public Page */}
        <a href={publicPageUrl} target="_blank" rel="noreferrer" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 8, marginBottom: 2,
          color: 'var(--text-muted)', fontSize: 14,
          textDecoration: 'none', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span>🔗</span>
          <span>View Public Page</span>
        </a>

        {/* Copy Public Link */}
        <button onClick={() => {
          if (!publicSlug) {
            alert('Create an event type first.');
            return;
          }
          navigator.clipboard.writeText(`${window.location.origin}/johndoe/${publicSlug}`);
          alert('Link copied!');
        }} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 8, marginBottom: 2,
          color: 'var(--text-muted)', fontSize: 14,
          background: 'transparent', border: 'none', width: '100%',
          cursor: 'pointer', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span>📋</span>
          <span>Copy Public Link</span>
        </button>

        {/* Refer & Earn */}
        <button onClick={() => alert('Refer & Earn coming soon!')} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 8, marginBottom: 2,
          color: 'var(--text-muted)', fontSize: 14,
          background: 'transparent', border: 'none', width: '100%',
          cursor: 'pointer', transition: 'all 0.15s'
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span>🎁</span>
          <span>Refer & Earn</span>
        </button>

        {/* Settings */}
        <NavLink to="/settings" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 12px', borderRadius: 8,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? 'var(--accent)' : 'var(--text-muted)',
          background: isActive ? '#eef2ff' : 'transparent',
          fontSize: 14, transition: 'all 0.15s', textDecoration: 'none'
        })}>
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
