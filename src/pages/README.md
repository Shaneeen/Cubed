# Pages Guide

This folder is for page-level guidance and route ownership notes. The app currently uses the Next.js App Router, so the actual route files live in `src/app`, but this folder gives the team a clear place to document page responsibilities.

## Page Ownership

- `Customer side`: public browsing, product catalogue, cart, and pickup reservation flow
- `Merchant side`: product management, stock updates, and cube or shelf location management
- `Store owner side`: merchant management, product visibility, and order control

## What Belongs Here

- Route planning notes
- Page ownership breakdowns
- Screen content checklists
- Handoff notes for Dev 1, Dev 2, and Dev 3

## Recommended Page Map

- Home page: customer-facing landing and catalogue entry
- Product page: item details and cart actions
- Merchant dashboard: product CRUD and inventory control
- Admin dashboard: merchant management and order review

## Notes

- Keep actual route code in `src/app`
- Keep shared UI in `src/components`
- Keep business logic in `src/features`
- Keep Supabase helpers in `src/lib/supabase`
