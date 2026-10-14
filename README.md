# Hostel Bus Movement & Student Registration Portal

A responsive frontend prototype for digitally recording hostel students' bus movements.

## Files
- `index.html` — page structure and movement registration form
- `style.css` — responsive visual design
- `script.js` — form validation, demo record storage, dashboard views, search and CSV export

## Run locally
Open `index.html` in a modern web browser.

## Publish with GitHub Pages
1. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select branch `main` and folder `/(root)`, then save.
5. Wait for GitHub Pages to finish publishing.

## Important limitations
This is a frontend demonstration. Records are stored in the browser's `localStorage`, so they are not shared between different browsers or devices. The role selector is only a demonstration and is not authentication or access control.

Before using real student information, connect a backend database (such as Firebase or Supabase), implement verified sign-in and server-side role-based permissions, and apply appropriate privacy/security controls. Do not put passwords, API secrets, or real student records in a public repository.
