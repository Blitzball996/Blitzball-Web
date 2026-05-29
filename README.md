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

## Analytics (optional)

If you want visitor metrics, the recommended path is **Cloudflare Web Analytics** (free, no cookies, accessible from China):

1. Sign up at <https://dash.cloudflare.com/?to=/:account/web-analytics>
2. Add your site, copy the JS token
3. Paste this before `</body>` in each `.html` page:

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_TOKEN_HERE"}'></script>
```

Other free options:
- Umami Cloud — 10k events/month free, self-hostable
- Plausible — open source, self-hosting free
- GoatCounter — free for personal use, no cookies

## License

MIT
