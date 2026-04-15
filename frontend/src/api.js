import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const getUser = () => API.get('/user');
export const getEventTypes = () => API.get('/event-types');
export const createEventType = (data) => API.post('/event-types', data);
export const updateEventType = (id, data) => API.put(`/event-types/${id}`, data);
export const deleteEventType = (id) => API.delete(`/event-types/${id}`);
export const getAvailability = () => API.get('/availability');
export const updateAvailability = (data) => API.put('/availability', data);
export const getBookings = () => API.get('/bookings');
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);
export const getSlots = (username, slug, date) =>
  API.get(`/slots/${username}/${slug}?date=${date}`);
export const createBooking = (data) => API.post('/bookings', data);