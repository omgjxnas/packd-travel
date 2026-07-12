# PACKD — Packing Cubes

Storefront-style front-end concept for **Packd**, a fictional travel-gear brand. Built with React (loaded via CDN, no build step) and deployed as a static site through GitHub Pages.

## Features

- Home page with a hero section and product grid, driven by a lightweight tweak/config object
- Product detail view with an image carousel (multiple angles per product)
- Search overlay for filtering products
- User profile page with a loyalty/tier system and redeemable rewards
- Toast notifications for user feedback

## Tech stack

- React 18 + Babel Standalone (via CDN, no build tooling)
- Vanilla CSS
- GitHub Pages for deployment

## Project structure

- `index.html` — entry point, loads React/Babel from CDN and mounts the app
- `app.js` — all components and application logic (home, product detail, search, profile)
- `styles.css` — global styles
- `uploads/` — product photography and imagery

## Assets

All product photography and imagery in this repo is AI-generated. Packd is a fictional brand created for prototyping and design purposes only — it is not a real company or product.

## Running locally

No build step is required. Clone the repo and open `index.html` in a browser, or serve the folder with any static file server.
