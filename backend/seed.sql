-- seed.sql
INSERT INTO users (name, username, email, timezone)
VALUES ('John Doe', 'johndoe', 'john@example.com', 'Asia/Kolkata')
ON CONFLICT (username) DO NOTHING;

INSERT INTO event_types (user_id, title, slug, description, duration)
VALUES
  (1, '15 Minute Meeting', '15min', 'A quick 15-minute check-in', 15),
  (1, '30 Minute Meeting', '30min', 'Standard 30-minute meeting', 30),
  (1, '1 Hour Session', '1hr', 'In-depth 1-hour session', 60);

INSERT INTO availability (user_id, day_of_week, start_time, end_time, is_available)
VALUES
  (1, 1, '09:00', '17:00', true),
  (1, 2, '09:00', '17:00', true),
  (1, 3, '09:00', '17:00', true),
  (1, 4, '09:00', '17:00', true),
  (1, 5, '09:00', '17:00', true);

INSERT INTO bookings (event_type_id, booker_name, booker_email, start_time, end_time, status)
VALUES
  (2, 'Alice Smith', 'alice@example.com', NOW() + INTERVAL '1 day' + INTERVAL '10 hours', NOW() + INTERVAL '1 day' + INTERVAL '10 hours 30 minutes', 'confirmed'),
  (1, 'Bob Jones', 'bob@example.com', NOW() + INTERVAL '2 days' + INTERVAL '14 hours', NOW() + INTERVAL '2 days' + INTERVAL '14 hours 15 minutes', 'confirmed'),
  (3, 'Carol White', 'carol@example.com', NOW() - INTERVAL '3 days' + INTERVAL '11 hours', NOW() - INTERVAL '3 days' + INTERVAL '12 hours', 'confirmed');