# Synthector Site (React + Vite)

This repo builds a static site (Vite build output) and deploys it to **GitHub Pages** via **GitHub Actions**.

## Local development

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

Build output is in `dist/`.

## Deploy to GitHub Pages

1) Push to GitHub (branch: `main`).

2) In GitHub:
   - Repo → **Settings** → **Pages**
   - Under **Build and deployment**, select **Source: GitHub Actions**

3) The included workflow deploys automatically on every push to `main`:
   - `.github/workflows/pages.yml`

## Custom domain (Synthector.com)

This repo includes `public/CNAME` with:

```
Synthector.com
```

After your first successful deploy:
- Repo → Settings → Pages → **Custom domain** → set `Synthector.com`
- Enable **Enforce HTTPS** once available.

## Notes

- `public/privacy.html` is a static privacy policy page served at `/privacy.html`.
- Static files in `public/` are copied into the build output.
