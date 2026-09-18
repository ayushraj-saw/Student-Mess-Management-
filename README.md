# 🍽️ Smart Mess Management System

A Vercel-ready, frontend-only Smart Mess Management System built for hackathons.

## Features

### Student Portal
- Student login
- Dashboard
- Weekly menu
- Meal booking
- Attendance/meal history
- Feedback
- Complaints
- Notifications
- Profile

### Admin Portal
- Admin login
- Dashboard analytics
- Menu management
- Student management
- Meal/booking overview
- Feedback and complaint monitoring
- Food wastage tracking
- Announcements

## Demo Login

### Student
Email: `student@demo.com`
Password: `student123`

### Admin
Email: `admin@demo.com`
Password: `admin123`

## Deploy to Vercel

### Option 1 — GitHub
1. Upload this folder to a GitHub repository.
2. Go to Vercel.
3. Import the GitHub repository.
4. Framework Preset: **Other**
5. Build Command: leave empty.
6. Output Directory: `.`
7. Deploy.

### Option 2 — Vercel CLI

```bash
npm install -g vercel
vercel
```

No build step is required.

## Data Storage

This version uses browser `localStorage`, so it works immediately on Vercel without a separate backend.

For a production/hackathon final version, replace localStorage with a real database such as Supabase/PostgreSQL and server-side authentication.

## Important

The demo authentication is intentionally client-side for an immediately deployable prototype. Do not use these credentials or client-side authentication for production.
