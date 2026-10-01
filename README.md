# VELORA — Menswear Store (Next.js + Prisma + Postgres)

A real, deployable e-commerce codebase: storefront + a connected admin/CMS panel.
Admin changes (branding colors, hero text, navigation, footer, products, orders, coupons,
reviews) are saved to Postgres and read live by the storefront — no rebuild needed.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Prisma ORM + PostgreSQL
- Server Actions for all admin mutations (no separate REST API to secure)
- Cookie-based admin session (HMAC-signed) — see "Security notes" below

## 1. Local setup (Supabase — already provisioned)

The `velora` schema, all tables and starter data (6 products, 4 collections, 5 categories,
2 coupons) already exist in your Supabase project `veloraclothes`. Your older tables in the
`public` schema are untouched. **Do not run `prisma migrate dev` or `prisma db push`** —
the tables are already created.

```bash
npm install
cp .env.example .env
# Fill in [YOUR-PASSWORD] in DATABASE_URL and DIRECT_URL (keep &schema=velora), set
# ADMIN_PASSWORD and ADMIN_SECRET
npm run dev
```

Storefront: http://localhost:3000 — Admin: http://localhost:3000/admin-login

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — VELORA storefront + admin"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

(Create the empty repo first at github.com/new, or use `gh repo create` if you have the
GitHub CLI installed and authenticated.)

## 3. Deploy to Vercel

1. Go to vercel.com → **Add New Project** → import your GitHub repo.
2. Add Environment Variables (same as your `.env`):
   - `DATABASE_URL` (Supabase pooler URL, with `&schema=velora`)
   - `DIRECT_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
   - (optional) `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`
3. Deploy.
4. No migration step needed — the database is already set up. Use the same
   `DATABASE_URL` (pooler, port 6543) and `DIRECT_URL` values in Vercel.

Your store is now live at `your-project.vercel.app`, and `/admin-login` is your control
center — no code changes needed for day-to-day store management.

## What's real vs. simplified

**Real:** Postgres-backed products/orders/customers/reviews/coupons/categories/collections,
live-editable branding/hero/navigation/footer/announcement bar, stock decrement on order,
audit log, role-based sidebar (UI-level), CSV-free admin (data lives in your own DB so you
can query/export it directly via `psql` or any Postgres client).

**Simplified / left for you to extend:**
- Checkout simulates payment unless you wire up Stripe Checkout Sessions in `app/actions.ts`
  (`placeOrder`) using `STRIPE_SECRET_KEY`.
- No file/image upload yet — product photography is CSS placeholder art. Add Vercel Blob,
  S3, or Cloudinary and store the returned URL in `Product.images`.
- Admin auth is a single shared password + role picker (not per-user accounts). For a team,
  swap in NextAuth/Clerk with a real `AdminUser` table and hashed per-user passwords.
- No email sending (order confirmations, shipping updates) — add Resend easily inside the
  server actions in `app/admin/orders/actions.ts` and `app/actions.ts`.

## Security notes
- Change `ADMIN_PASSWORD` and `ADMIN_SECRET` before deploying — never use the example values.
- The admin session cookie is HMAC-signed and httpOnly, but this is still a single shared
  password, not per-user accounts with hashed credentials — treat it as a staff-only gate,
  not bank-grade auth.
- Rotate `ADMIN_SECRET` to instantly invalidate all existing admin sessions.
