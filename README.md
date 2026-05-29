# Blitzball Labs — Company Website

Static landing site for [Blitzball Labs](https://github.com/Blitzball996) — native AI tools for creators and engineers.

## Pages

- **index.html** — Landing page (company overview, products, philosophy, FAQ)
- **blitz.html** — [Blitz DAW](https://github.com/Blitzball996/AIDAW) product page
- **closecrab.html** — [CloseCrab](https://github.com/Blitzball996/CloseCrab-Unified) product page

## Features

- Pure HTML/CSS/JS — no build step, no framework
- Three.js 3D background (icosahedron + particles)
- CSS-drawn DAW mixer, 4OSC synth, FX rack, piano roll mockups (animated)
- Multi-language switcher (12 languages, manual translations)
- Dark neon theme · cohesive purple+cyan palette
- Works on `file://` and `http://` protocols

## Local development

```bash
# Run local server (recommended for language switcher)
./serve.bat
# or
python -m http.server 8080
```

Open <http://localhost:8080>.

## Languages

i18n JSON files live in `assets/i18n/`. The switcher mounts to the nav automatically and supports:
EN · 中文 · 日本語 · 한국어 · Español · Français · Deutsch · Русский · Português · Italiano · العربية · हिन्दी

## License

MIT
