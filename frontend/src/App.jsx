import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import EventTypes from './pages/EventTypes';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import BookingPage from './pages/BookingPage';
import BookingConfirm from './pages/BookingConfirm';

export default function App() {
  return (
    <Routes>
      {/* Public booking page - no sidebar */}
      <Route path="/:username/:slug" element={<BookingPage />} />
      <Route path="/booking/confirmed" element={<BookingConfirm />} />

      {/* Admin routes with sidebar */}
      <Route path="/*" element={
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '32px', maxWidth: 900 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/event-types" element={<EventTypes />} />
              <Route path="/availability" element={<Availability />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </main>
        </div>
      } />
    </Routes>
  );
}