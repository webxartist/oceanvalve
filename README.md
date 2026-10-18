# Ocean Valves & Equipments — OVETA Website

Next.js App Router website adapted from the supplied Butterfly Homes project. Product families and specifications are summarized from the supplied Ocean Valves & Equipments catalogue.

## Features
- Responsive industrial B2B homepage with 3-slide hero, fade transitions, slow zoom animation, arrows and dots.
- Admin-managed hero slide content/images, trusted brand logos, international client logos, company/about text, SEO and contact details.
- Continuous left-to-right trusted-logo marquee.
- MongoDB-backed product management: create, edit, delete, publish/unpublish products, multiple images, technical fields, URL slugs and per-product SEO metadata.
- Product detail pages with metadata, canonical URLs, gallery images and enquiry links. Existing catalogue entries are automatically seeded into the database the first time an admin opens Product management.
- About, Quality & Standards, Contact, admin login/dashboard, and enquiry review.
- MongoDB-backed global settings and enquiries, using the existing admin authentication from the starter project.

## Setup
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set `MONGODB_URI`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Open `/admin/login`, sign in, and use **Website content** to edit company content and **Product management** to manage catalogue items.

## Admin image workflow
Use **Upload hero or logo images** in the dashboard. Uploaded files return a URL under `/uploads/media/`; copy that URL into the appropriate hero slide or logo line and save website content. On serverless deployments, use persistent object storage (such as S3-compatible storage or Cloudinary) instead of local filesystem uploads, because deployment filesystems may be ephemeral.

## Editing hero slides and logos
One hero slide per line:
`Heading | Description | Image URL | Eyebrow`

One trusted brand per line:
`Brand name | Image URL`

One international client per line:
`Client name | Image URL`

The site falls back to three bundled hero images if no custom slides have been saved.

## Catalogue accuracy
The catalogue supplied by the user is an older brochure and references ISO 9001:2008. The site keeps the brochure's stated specifications and ranges as summaries; confirm current certifications, product availability, dimensions, pressure ratings, and applicable standards with Ocean Valves before use in a technical specification.
