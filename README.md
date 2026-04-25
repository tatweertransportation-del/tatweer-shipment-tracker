# Tatweer Tracking System

Tatweer Tracking System is a professional bilingual shipment tracking platform designed for logistics operations. It provides a customer-facing tracking experience and a protected admin dashboard for managing shipments, documents, updates, ratings, and customer feedback.

## Overview

The system is built to support real shipment workflows with a clean public interface and an operations-focused admin area. It is designed for Arabic and English usage, supports RTL and LTR layouts, and follows a modern logistics-style visual identity.

## Core Experience

- Public shipment tracking page for customers
- Protected admin dashboard for shipment management
- Arabic and English support with dynamic RTL/LTR switching
- Dark mode and light mode support
- Responsive design for desktop and mobile
- Shipment timeline, status progress, and estimated delivery view
- Search history for customer lookups
- Shipment document access with per-shipment password protection
- Customer ratings and suggestions connected to the admin panel
- WhatsApp-ready customer communication workflow
- Analytics and activity monitoring inside the admin dashboard

## Main Sections

### Customer Tracking Interface

The public page allows customers to:

- Search by tracking number
- View shipment status and progress
- Follow shipment milestones and last update details
- Access shipment documents securely
- Submit ratings and feedback
- Contact support through linked channels

### Admin Dashboard

The admin experience allows operations teams to:

- Log in to a protected control panel
- Create and update shipments
- Manage shipment files and customer access passwords
- Review customer suggestions and ratings
- Monitor shipment analytics and recent activity
- Export shipment data and maintain backups

## Design Direction

The interface is styled to feel close to a real logistics company system, with:

- Clean corporate presentation
- Tatweer-branded visual styling
- Strong Arabic and English readability
- Simple customer footer and contact access
- Dashboard layouts focused on speed and clarity for operations work

## Security Direction

The project includes a hardened admin authentication flow and server-side protections intended to improve operational safety, including protected admin sessions, request validation, security headers, and cross-site request protections for admin actions.

## Project Structure

- `index.html` public tracking page
- `admin.html` protected admin dashboard
- `style.css` full visual styling
- `script.js` frontend logic and bilingual behavior
- `config.js` frontend configuration
- `server.js` backend server and API logic
- `db.js`, `sqlite-db.js`, `supabase-db.js` data layer files
- `render.yaml` deployment blueprint
- `RIGHTS.md` ownership and rights notice

## Rights

This project is proprietary to Tatweer Logistics Services.

- Brand name, logo, and visual identity assets are reserved
- Source code and related project materials may not be reused without permission
- Additional rights details are available in [RIGHTS.md](./RIGHTS.md)
