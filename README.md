# Tatweer Tracking System

Professional bilingual shipment tracking system for logistics companies, with a public customer tracking page and a protected admin dashboard.

## Features

- Public tracking page for customers
- Protected admin dashboard with login
- Arabic and English support with RTL and LTR switching
- Dark mode and responsive UI
- Shipment timeline, progress bar, and delivery estimate
- Search history for customer lookups
- Shipment analytics in admin dashboard
- WhatsApp notification support through Twilio, WATI, or mock mode
- Render-ready backend deployment

## Project Structure

- `index.html` public tracking page
- `admin.html` protected admin dashboard
- `style.css` full UI styling
- `script.js` frontend logic
- `config.js` frontend API base URL config
- `server.js` Node.js backend server
- `data/shipments.json` local shipment storage
- `render.yaml` Render deployment configuration
- `.env.example` environment variable template

## Local Run

1. Copy `.env.example` to `.env`
2. Set your admin credentials and provider values
3. Start the app:

```bash
node server.js
```

4. Open:

- `http://localhost:3000/index.html`
- `http://localhost:3000/admin.html`

## Important Data Storage Note

This project now supports two storage drivers:

- `sqlite` for local development
- `supabase` for a free cloud database that survives Render redeploys

If you stay on Render Free, use `supabase`. Render Free does not preserve local files across restarts or redeploys.

For local development:

```env
STORAGE_DRIVER=sqlite
DATA_FILE_PATH=./data/shipments.json
SUGGESTIONS_FILE_PATH=./data/suggestions.json
DATABASE_FILE_PATH=./data/tatweer-tracking.sqlite
AUDIT_LOG_FILE_PATH=./data/audit-log.jsonl
```

For Render Free with Supabase:

```env
STORAGE_DRIVER=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AUDIT_LOG_FILE_PATH=./data/audit-log.jsonl
```

The app can migrate your existing local JSON data into Supabase automatically on first successful connection if the Supabase tables are empty.

## Default Admin Login

- Username: `admin`
- Password: `admin123`

Change these before production use.

## Render Deployment

This repo includes `render.yaml` for quick deployment.

For a fully free setup, use Supabase:

1. Create a free Supabase project
2. Open the SQL Editor and run [supabase-schema.sql](./supabase-schema.sql)
3. In Supabase, copy:
   - Project URL
   - service_role key
4. In Render, set:

```env
STORAGE_DRIVER=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AUDIT_LOG_FILE_PATH=./data/audit-log.jsonl
```

This keeps the app on Render Free while storing the actual shipment data in Supabase.

### Same Render service for frontend and backend

No `API_BASE_URL` change is usually needed because the frontend falls back to the current domain automatically.

### Separate frontend and backend services

Update `config.js` if your frontend and backend are on different services:

```js
window.APP_CONFIG = {
  API_BASE_URL: "https://your-backend-service.onrender.com",
  APP_BASE_URL: ""
};
```

Set these Render backend environment variables:

```env
STORAGE_DRIVER=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
AUDIT_LOG_FILE_PATH=/var/data/audit-log.jsonl
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=replace-with-a-strong-secret
TRACKING_BASE_URL=https://your-frontend-service.onrender.com
ALLOWED_ORIGINS=https://your-frontend-service.onrender.com
WHATSAPP_PROVIDER=mock
```

## WhatsApp Providers

### Mock mode

```env
WHATSAPP_PROVIDER=mock
```

### Twilio

```env
WHATSAPP_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### WATI

```env
WHATSAPP_PROVIDER=wati
WATI_INSTANCE_ID=your_instance_id
WATI_ACCESS_TOKEN=your_access_token
```

## Security Notes

- Keep `.env` out of GitHub
- Never expose provider API keys in frontend files
- Admin authentication is stored in `localStorage` using a signed token
