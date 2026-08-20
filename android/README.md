# Android TWA packaging (শব্দকোষ)

Trusted Web Activity wrapper for Play Store uploads. Package ID matches the existing listing:

`studio.ai.service_5743.twa`

**Do not use Bubblewrap’s auto-generated package** (`io.github.akikto.twa` from hostname `akikto.github.io`). Play Console rejects AABs unless the package is exactly `studio.ai.service_5743.twa` (the AI Studio listing ID). This repo pins that ID in `twa-manifest.json`, `app/build.gradle`, and `scripts/generate-android-twa.mjs`.

## Versioning

| Field | Value |
| --- | --- |
| `versionCode` (`appVersionCode`) | **2** |
| `versionName` (`appVersion`) | **1.0.1** |

Source of truth: [`twa-manifest.json`](./twa-manifest.json) → applied to `app/build.gradle` when regenerating.

Play Console rejected `versionCode` **1** (“already been used”). Upload an AAB built with **2** or higher.

## Regenerate project

```bash
# GitHub Pages project site (default for this repo):
TWA_HOST=akikto.github.io TWA_START_URL=/offline-dictionary/ npm run android:generate

# Other hosts:
TWA_HOST=your-cloud-run-or-deploy-host.example.com npm run android:generate
```

Icons are taken from `public/icon.png` (dictionary অ+D mark).

## Build the AAB

Requires JDK 17+ and Android SDK command-line tools.

```bash
# From repo root — build, copy to android/dist/, verify package + versionCode:
npm run android:package

# Or step by step:
npm run android:build
node scripts/copy-aab.mjs
npm run android:verify
```

Signed output (when signing is configured):

- `android/app/build/outputs/bundle/release/app-release.aab`
- Convenience copies (local builds): `android/dist/shobdokosh-1.0.1-versionCode-2.aab` and `android/dist/শব্দকোষ.aab`

Verified with bundletool: `versionCode=2`, `versionName=1.0.1`, package `studio.ai.service_5743.twa`.

Or with Bubblewrap (after `~/.bubblewrap/config.json` exists):

```bash
cd android
npx bubblewrap build
# → ./app-release-bundle.aab
```

## Signing blocker

Play will only accept an update signed with the **same upload key** as the previous AAB. The SHA-256 in `public/.well-known/assetlinks.json` is:

`49:56:54:FE:B4:3D:BF:37:1E:3C:A5:A2:56:9C:22:58:11:1D:64:B3:41:CC:44:2B:38:4B:B0:92:8C:71:BA:D5`

Place that keystore at `android/android.keystore` (or update `signingKey` in `twa-manifest.json`) before a release build.

## CI artifacts (GitHub Actions)

Workflow: [`.github/workflows/android-build.yml`](../.github/workflows/android-build.yml)

On push/PR to `main` (or manual **Run workflow**), Actions builds and uploads:

| Artifact | Contents |
| --- | --- |
| `android-apk` | Signed release APK for sideloading |
| `android-aab` | Signed release AAB for Play Console |

Download from the workflow run page → **Artifacts** (bottom of the summary).

Optional repo secrets for Play-compatible signing (same key as versionCode 1):

- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

Without these secrets, CI uses a temporary key so you can still download installable builds; Play Store updates require the original upload keystore.
