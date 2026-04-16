# Cal Clone

A Calendly-style scheduling app with:

- `frontend/`: React + Vite UI
- `backend/`: Express API + PostgreSQL

## Features

- Public booking page
- Event type management
- Weekly availability management
- Booking management
- Email confirmations with Gmail via Nodemailer
- Automatic database initialization on backend startup

## Project Structure

```text
cal-clone/
  backend/
    index.js
    db.js
    initDb.js
    schema.sql
  frontend/
    src/
  render.yaml
```

## Environment Files

This repo uses local `.env` files for development.

### 1. Backend env

Create `backend/.env` with:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/calclone
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

What each value does:

- `PORT`: backend server port
- `DATABASE_URL`: PostgreSQL connection string
- `EMAIL_USER`: Gmail address used for sending booking emails
- `EMAIL_PASS`: Gmail App Password for that Gmail account

### 2. Frontend env

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

What it does:

- `VITE_API_URL`: frontend API base URL for local development

### 3. Do not use `frontend/src/.env`

That file is not needed. Vite reads env files from the frontend project root, so only `frontend/.env` should be used.

## Before Running Locally

Make sure you have:

- Node.js installed
- npm installed
- PostgreSQL installed and running
- a local PostgreSQL database named `calclone`
- a Gmail App Password if you want email sending to work

## Local Setup

### Backend

```bash
cd backend
npm install
npm start
```

What happens on backend startup:

- `.env` is loaded
- PostgreSQL connects using `DATABASE_URL`
- `schema.sql` is applied
- a default user is inserted if needed
- default weekly availability is inserted if missing

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs on Vite, and it calls the backend using `VITE_API_URL`.

## Deployment

This repo is prepared for deployment on Render.

### What was changed to make deployment easier

The following deployment changes were added:

- `render.yaml` was added so Render can create the app service and PostgreSQL database from the repo
- `backend/index.js` was updated to serve the built frontend files from `frontend/dist` in production
- `backend/db.js` was updated to require `DATABASE_URL` from environment variables instead of storing the DB password in source code
- `.gitignore` was updated so nested `.env` files are ignored

### How deployment works now

Render will:

- create one Node web service
- create one PostgreSQL database
- build the frontend
- run the backend
- serve both frontend and API from one deployed app

That means you do not need separate frontend and backend hosting for this setup.

## What You Should Do Now

### Step 1. Open Render

Go to Render and sign in:

- https://render.com/

### Step 2. Create a Blueprint deployment

Use your GitHub repo and let Render detect `render.yaml`.

Render docs:

- https://render.com/docs/infrastructure-as-code
- https://render.com/docs/your-first-deploy

### Step 3. Let Render create these resources

- Web Service: `cal-clone`
- Postgres Database: `cal-clone-db`

### Step 4. Add secret env vars in Render

In the Render web service settings, add:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

You do not need to manually add `DATABASE_URL` because `render.yaml` already links it from the Render Postgres database.

### Step 5. Deploy

Start the deployment and wait for the build to finish.

## How Long Deployment Usually Takes

Typical time:

- Render setup in dashboard: 5 to 10 minutes
- first build and deploy: 5 to 15 minutes

So usually the whole process takes about 10 to 25 minutes for a first deployment.

If there is a failed build or missing env var, it can take longer.

## Important Deployment Notes

### Database

Your deployed app needs a PostgreSQL database. Render will create this from `render.yaml`.

### Emails

Booking emails will only work if:

- `EMAIL_USER` is set
- `EMAIL_PASS` is set
- the Gmail account has a valid App Password

### Frontend API URL in production

You do not need `frontend/.env` on Render for production in this setup. The frontend can use same-origin `/api` once served by the backend.

## Troubleshooting

### App crashes on startup

Check:

- `DATABASE_URL` exists in backend env
- PostgreSQL is reachable
- Render database was created successfully

### Emails fail

Check:

- `EMAIL_USER` is correct
- `EMAIL_PASS` is a Gmail App Password, not your normal Gmail password

### Frontend loads but API fails

Check:

- backend service is healthy
- `/test-db` works
- database is connected

## Safety Notes

- `.env` files are ignored by git
- no `.env` files should be committed
- secrets should only live in local `.env` files or in Render environment variables

## Useful Commands

### Start backend

```bash
cd backend
npm start
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
