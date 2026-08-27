# Homepage brand-reskin backup — 2026-08-20

Snapshot of the homepage frontend taken **before** applying the OneLnk brand
system (bone/navy + orange #F3801E, Archivo/IBM Plex Mono, sharp corners).

## What's here
- `landing-page/` — full copy of `resources/js/pages/landing-page/` (index.tsx + all 30 components)
- `onelnk-landing.css` — copy of `resources/css/onelnk-landing.css`

## To revert the homepage to the pre-brand look
From the project root (`C:\laragon\www\onelnk`):

```bash
cp -r backups/homepage-2026-08-20/landing-page/. resources/js/pages/landing-page/
cp backups/homepage-2026-08-20/onelnk-landing.css resources/css/onelnk-landing.css
```

Then remove the font `<link>` added for the reskin in
`resources/views/app.blade.php` (the `fonts.bunny.net` line loading
**archivo** + **ibm-plex-mono**), and rebuild:

```bash
node node_modules/vite/bin/vite.js build
```

That's the whole revert — the brand reskin touched only these files plus that
one font-link line.
