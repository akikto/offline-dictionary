# Android TWA packaging (শব্দকোষ)

Trusted Web Activity wrapper for Play Store uploads.

**Quick reference:** [`docs/PLAYSTORE.md`](../docs/PLAYSTORE.md) — Bengali + English cheat sheet (package ID, URL, icons).

## Correct values (do not change casually)

| Field | Value |
| --- | --- |
| Package ID | `studio.ai.service_5743.twa` |
| App URL | `https://akikto.github.io/offline-dictionary/` |
| Manifest URL | `https://akikto.github.io/offline-dictionary/manifest.json` |
| Icon source | `public/icon.png` (অ + D dictionary mark) |
| `versionCode` | **≥ 2** (see `twa-manifest.json`) |

Bubblewrap/PWABuilder auto-generates `io.github.akikto.twa` from the hostname — **wrong** for this Play listing. `scripts/generate-android-twa.mjs` forces `PLAY_PACKAGE_ID`.

## Versioning

Source of truth: [`twa-manifest.json`](./twa-manifest.json) → applied to `app/build.gradle` when regenerating.

Play Console rejected `versionCode` **1** (“already been used”). Upload an AAB built with **2** or higher.

## Regenerate project

```bash
TWA_HOST=akikto.github.io \
TWA_START_URL=/offline-dictionary/ \
PLAY_PACKAGE_ID=studio.ai.service_5743.twa \
npm run android:generate
```

## Build and verify AAB

Requires JDK 17+ and Android SDK command-line tools.

```bash
npm run android:package
# → builds AAB, copies to android/dist/, verifies package ID + versionCode
```

Signed output (when signing is configured):

- `android/app/build/outputs/bundle/release/app-release.aab`
- Convenience copies: `android/dist/shobdokosh-versionCode-*.aab` and `android/dist/শব্দকোষ.aab`

Or manually:

```bash
cd android
./gradlew bundleRelease
node ../scripts/verify-aab-package.mjs
```

## Signing

Play will only accept an update signed with the **same upload key** as the previous AAB. The SHA-256 in `public/.well-known/assetlinks.json` is:

`49:56:54:FE:B4:3D:BF:37:1E:3C:A5:A2:56:9C:22:58:11:1D:64:B3:41:CC:44:2B:38:4B:B0:92:8C:71:BA:D5`

Place that keystore at `android/android.keystore` (never commit) before a release build.

## CI artifacts (GitHub Actions)

Workflow: [`.github/workflows/android-build.yml`](../.github/workflows/android-build.yml)

On push/PR to `main` (or manual **Run workflow**), Actions builds and uploads `android-apk` and `android-aab` artifacts.

Optional repo secrets for Play-compatible signing:

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Without these secrets, CI uses a temporary key so you can still download installable builds; Play Store updates require the original upload keystore.
