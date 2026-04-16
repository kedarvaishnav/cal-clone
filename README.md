# Cal Clone

Cal Clone is a Calendly-style scheduling app built with React, Express, and PostgreSQL. It lets users create event types, manage weekly availability, share a public booking page, and receive booking confirmation emails.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- Email: Nodemailer with Gmail App Passwords

## Features

- Create and manage event types
- Set weekly availability
- Share a public booking link
- Book time slots
- View and manage bookings
- Send booking confirmation emails

## Project Structure

```text
cal-clone/
  backend/
    db.js
    index.js
    initDb.js
    schema.sql
  frontend/
    src/
  render.yaml
```

## Clone the Project

```bash
git clone https://github.com/kedarvaishnav/cal-clone.git
cd cal-clone
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- a PostgreSQL database created named `calclone`
- a Gmail App Password if you want email sending to work

## Environment Setup

### Backend

Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/calclone
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### Important

- Use only `frontend/.env`
- Do not use `frontend/src/.env`
- Keep `.env` files private and never commit them

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Run the Project Locally

Open two terminals.

### Terminal 1: Start backend

```bash
cd backend
npm start
```

The backend will:

- connect to PostgreSQL
- create tables from `schema.sql` if needed
- seed a default user and availability if missing

### Terminal 2: Start frontend

```bash
cd frontend
npm run dev
```

Then open the local frontend URL shown by Vite, usually:

```text
http://localhost:5173
```

## Default Local Flow

After starting both services, you can:

1. open the dashboard
2. create an event type
3. open the public booking page
4. make a test booking
5. check whether confirmation emails are sent

## Useful Commands

### Start backend in development mode

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

### Build frontend

```bash
cd frontend
npm run build
```

## Deployment

This project is also prepared for deployment on Render using `render.yaml`.

Live app:

```text
https://cal-clone-fkq6.onrender.com
```

## Troubleshooting

### Database connection error

Check that:

- PostgreSQL is running
- the `calclone` database exists
- `DATABASE_URL` is correct in `backend/.env`

### Emails are not sending

Check that:

- `EMAIL_USER` is correct
- `EMAIL_PASS` is a Gmail App Password
- Gmail 2-Step Verification is enabled

### Frontend cannot reach backend

Check that:

- backend is running on port `5000`
- `VITE_API_URL` in `frontend/.env` is correct

## Notes

- The Render free instance may sleep after inactivity
- The first request after sleep can take a little time
