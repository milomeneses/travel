# Next.js + Vercel migration guide (step-by-step)

## When this approach makes sense
- You want a modern frontend stack, fast deployments, previews, and easy hosting on Vercel.
- You don’t need shared hosting PHP features on the front-end, or are fine moving them to serverless APIs.

## What you can reuse from current hosting
- **Domain**: You can keep the current domain and point it to Vercel when ready.
- **Database**: If the DB is accessible from the public internet, you can connect from Vercel using environment variables.
  - If the DB is only reachable locally (127.0.0.1), you’ll need to move it to a public host or use a tunnel/VPN.

## Step 1 — Create a new Next.js app
```bash
npx create-next-app@latest stkitts-campaign
```
- Choose **TypeScript** if you want type safety.
- Use the **App Router** (recommended for new projects).

## Step 2 — Build the campaign page
- Create your main page at `app/page.tsx`.
- Build components for:
  - Header/nav
  - Hero section
  - Campaign/story section
  - Activities
  - Plan your visit
  - Reserve form

## Step 3 — Add CMS-like admin editing
Option A (faster): Use a headless CMS
- Examples: **Sanity**, **Contentful**, **Strapi**.
- You get a built-in admin panel.

Option B (custom admin)
- Create `/app/admin/page.tsx`.
- Use an API route to read/write JSON or database entries.
- You can store content blocks in a database and update in real time.

## Step 4 — Store configuration in Vercel
- In Vercel: **Project → Settings → Environment Variables**
- Add:
  - `DATABASE_URL` (if DB is public)
  - `GA_MEASUREMENT_ID`
  - `GTM_CONTAINER_ID`
  - `GSC_VERIFICATION`

## Step 5 — Connect domain to Vercel
- Go to **Vercel → Domains** and add your domain.
- Update DNS records:
  - `A` record to `76.76.21.21` for root domain
  - `CNAME` to `cname.vercel-dns.com` for subdomain

## Step 6 — Deploy
- Connect the GitHub repo to Vercel.
- Push to `main` and Vercel auto-deploys.

## Notes on hosting and DB
- If you need PHP features, Vercel won’t run PHP natively.
- For your DB, you likely need to move it to a managed DB (PlanetScale, Supabase, Neon, or Hostinger with public access).

## Recommendation
If the project will grow and needs quick deployments + previews, **Next.js + Vercel** is a solid choice. If you rely heavily on PHP, keep the current setup or migrate PHP endpoints to serverless APIs.
