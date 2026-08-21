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

## Signing (Play upload key)

Play Console only accepts updates signed with the **same upload key** as the first release.

| | Fingerprint |
| --- | --- |
| **Required upload SHA1** (Play Console) | `24:7A:A9:16:C7:B3:60:7F:66:59:84:B8:84:4F:06:19:A0:B9:EA:0A` |
| **Matching SHA256** (`assetlinks.json`) | `49:56:54:FE:B4:3D:BF:37:1E:3C:A5:A2:56:9C:22:58:11:1D:64:B3:41:CC:44:2B:38:4B:B0:92:8C:71:BA:D5` |
| **CI temporary key SHA1** (do not upload) | `A3:F4:F0:B4:0F:B2:34:77:54:A4:0F:D5:8E:6C:EE:CA:32:CD:83:B5` |

PWABuilder / AI Studio creates `signing.keystore` plus a `signing-key-info.txt` with:

- **Alias:** `my-key-alias`
- **Keystore + key password:** from your `signing-key-info.txt` (not committed)

### One-time setup

1. Copy your original `signing.keystore` into the repo root (same folder as `signing-key-info.txt`).
2. Run:

```bash
node scripts/setup-android-signing.mjs ./signing.keystore
# or: npm run android:signing -- ./signing.keystore
```

This copies the keystore to `android/android.keystore` and writes `android/keystore.properties` (both gitignored).

3. Build and verify:

```bash
npm run android:package
```

`npm run android:verify` checks package ID, `versionCode`, and upload-key SHA1.

### Bengali quick guide (স্থানীয় সেটআপ)

**শুধু একটি ফাইল লাগবে:** AI Studio / PWABuilder থেকে ডাউনলোড করা `signing.keystore` (পাসওয়ার্ড/alias ইতিমধ্যে `signing-key-info.txt`-এ আছে)।

1. Cursor চ্যাটে **`signing.keystore`** ফাইলটি আপলোড/অ্যাটাচ করুন (📎 আইকন)।
2. Agent-কে বলুন: “signing.keystore দিয়েছি, AAB বানাও” — অথবা টার্মিনালে:
   ```bash
   npm run android:play-release
   ```
3. Play Console-এ আপলোড করুন: `android/dist/shobdokosh-1.0.1-versionCode-2.aab`

**সতর্কতা:** GitHub Actions-এ বিল্ড করা AAB (`A3:F4:F0:B4…` SHA1) Play-এ আপলোড করবেন না — সেটা CI-এর অস্থায়ী কী দিয়ে সাইন করা।

## Signing blocker (legacy note)

Place the Play upload keystore at `android/android.keystore` (or run `scripts/setup-android-signing.mjs`) before a release build.

## CI artifacts (GitHub Actions)

Workflow: [`.github/workflows/android-build.yml`](../.github/workflows/android-build.yml)

On push/PR to `main` (or manual **Run workflow**), Actions builds and uploads:

| Artifact | Contents |
| --- | --- |
| `android-apk` | Signed release APK for sideloading |
| `android-aab` | Signed release AAB for Play Console |

Download from the workflow run page → **Artifacts** (bottom of the summary).

Optional repo secrets for Play-compatible signing (same key as versionCode 1):

- `ANDROID_KEYSTORE_BASE64` — base64 of original `signing.keystore`
- `ANDROID_KEYSTORE_PASSWORD` — keystore password from `signing-key-info.txt`
- `ANDROID_KEY_ALIAS` — **`my-key-alias`**
- `ANDROID_KEY_PASSWORD` — key password (usually same as keystore password)

Encode locally: `base64 -w0 signing.keystore > signing.keystore.b64`

Without these secrets, CI uses a temporary key (`SHA1 A3:F4:F0:B4…`) so you can still download installable builds; **Play Store uploads require the original upload keystore** (`SHA1 24:7A:A9:16…`).
