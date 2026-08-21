# Play Store / PWABuilder cheat sheet — শব্দকোষ

**এক জায়গায় সঠিক তিনটি মান | Three correct values in one place**

| # | Field | ✅ Use this | ❌ Do NOT use |
|---|--------|-------------|----------------|
| 1 | **Package ID** | `studio.ai.service_5743.twa` | `io.github.akikto.twa` (PWABuilder/Bubblewrap auto-default) |
| 2 | **App / manifest URL** | `https://akikto.github.io/offline-dictionary/` | `https://akikto.github.io/` (root — serves **DentaCare**, wrong app) |
| 3 | **Icon** | Dictionary icon (অ + D, blue/gold) from `public/icon.png` | DentaCare icon, Bangladesh flag 🇧🇩 |

---

## PWABuilder / Bubblewrap URL

Paste **exactly** this manifest URL (not the site root):

```
https://akikto.github.io/offline-dictionary/manifest.json
```

App start URL (scope):

```
https://akikto.github.io/offline-dictionary/
```

**Why not root?** `https://akikto.github.io/manifest.json` returns a **different app** (DentaCare dental clinic). PWABuilder will pick the wrong name, icon, and package hints.

---

## Package ID (Play Console)

```
studio.ai.service_5743.twa
```

- Set in repo: `android/twa-manifest.json` → `packageId`
- Enforced in: `scripts/generate-android-twa.mjs` (`PLAY_PACKAGE_ID`)
- CI env: `PLAY_PACKAGE_ID=studio.ai.service_5743.twa` in `.github/workflows/android-build.yml`

After `npm run android:generate`, verify:

```bash
npm run android:verify   # needs a built AAB; checks package + versionCode >= 2
```

---

## Icons — where they live

| File | Purpose |
|------|---------|
| `public/icon.svg` | Source (অ + D dictionary mark, blue/gold) |
| `public/icon.png` | 512×512 — TWA launcher + maskable |
| `public/pwa-192.png`, `public/pwa-512.png` | PWA manifest icons |
| `manifest.json` / `public/manifest.json` | Absolute URLs under `/offline-dictionary/` |

Regenerate PNGs from SVG:

```bash
npm run icons:generate
```

Live URLs (must return **200**):

- https://akikto.github.io/offline-dictionary/icon.png
- https://akikto.github.io/offline-dictionary/manifest.json

---

## versionCode

Play Console already used **1**. Every new upload needs **2 or higher**.

Source of truth: `android/twa-manifest.json` → `appVersionCode` (currently **3**).

Bump before each Play upload, then:

```bash
TWA_HOST=akikto.github.io TWA_START_URL=/offline-dictionary/ npm run android:generate
npm run android:package   # build + copy AAB + verify package ID
```

---

## Regenerate Android TWA (Bubblewrap)

```bash
TWA_HOST=akikto.github.io \
TWA_START_URL=/offline-dictionary/ \
PLAY_PACKAGE_ID=studio.ai.service_5743.twa \
npm run android:generate
```

Then build:

```bash
npm run android:build
# or full pipeline:
npm run android:package
```

---

## Common mistakes (বারবার যা ভুল হয়)

1. **Package ID** — PWABuilder suggests `io.github.akikto.twa` from hostname. **Override** to `studio.ai.service_5743.twa`.
2. **URL** — Using `https://akikto.github.io/` loads DentaCare, not শব্দকোষ. Always use `/offline-dictionary/` path.
3. **Icon** — Root or wrong manifest pulls DentaCare or old icons. Use manifest URL above; icons come from `public/icon.png`.

---

## Asset links

Digital Asset Links for TWA: `public/.well-known/assetlinks.json` (deployed with the site).

Package name in assetlinks must match: `studio.ai.service_5743.twa`.

More detail: [`android/README.md`](../android/README.md)
