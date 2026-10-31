# Absensi MGMP — PWA Wrapper

Wrapper PWA (Progressive Web App) untuk aplikasi **Absensi MGMP Bahasa Inggris Kabupaten Probolinggo** berbasis Google Apps Script. Dapat di-host gratis di **GitHub Pages**, lalu di-install di HP Android/iOS sebagai aplikasi native.

## 📁 Struktur File

```
mgmp-absensi-pwa/
├── index.html              ← halaman wrapper (iframe Apps Script + SW registration)
├── manifest.json           ← manifest PWA
├── sw.js                   ← service worker (caching offline)
├── README.md               ← file ini
└── icons/
    ├── source.png          ← ikon sumber (referensi 512x512)
    ├── icon-192.png        ← ikon 192x192 (any)
    ├── icon-512.png        ← ikon 512x512 (any)
    ├── icon-192-maskable.png   ← ikon maskable 192x192 (Android adaptive)
    ├── icon-512-maskable.png   ← ikon maskable 512x512 (Android adaptive)
    ├── apple-touch-icon.png   ← 180x180 untuk iOS
    ├── favicon-32.png
    ├── favicon-16.png
    └── favicon.ico         ← favicon multi-size (16/32/48/64)
```

## 🎨 Branding

| Element | Value |
|---------|-------|
| App Name | Absensi MGMP |
| Full Name | Absensi MGMP Bahasa Inggris Kabupaten Probolinggo |
| Theme Color | `#1a73e8` (biru Google) |
| Background | `#ffffff` (putih) |
| Logo Text | "MG" (lingkaran biru gradient) |
| Orientation | Portrait |

## ⚙️ Konfigurasi Awal (WAJIB Sebelum Deploy)

### Langkah 1 — Dapatkan URL Apps Script Anda

1. Buka [Apps Script editor](https://script.google.com) → project Absensi MGMP Anda
2. Klik **Deploy → Manage deployments**
3. Pilih deployment "Web app" → klik edit (✏️)
4. Copy URL yang berakhiran `/exec` (bukan `/dev`)
   - Format: `https://script.google.com/macros/s/AKfycbx.../exec`

### Langkah 2 — Ganti Placeholder di 2 File

#### A. Edit `index.html`

Cari baris ini (sekitar line 145):

```html
<iframe
  id="app"
  ...
  src="GANTI_DENGAN_URL_APPS_SCRIPT_ANDA"
  ...
></iframe>
```

Ganti `GANTI_DENGAN_URL_APPS_SCRIPT_ANDA` dengan URL deployment Anda.

#### B. Edit `sw.js`

Cari baris ini (sekitar line 16):

```js
const APPS_SCRIPT_URL =
  "GANTI_DENGAN_URL_APPS_SCRIPT_ANDA";
```

Ganti dengan URL deployment Anda yang sama.

### Langkah 3 — (Opsional) Ganti Logo/Icon

Icon default pakai teks "MG" dengan background biru gradient. Kalau mau pakai logo MGMP Anda sendiri:

1. Siapkan logo PNG transparan 512×512 px
2. Generate ulang icon pakai script:
   ```bash
   python3 scripts/generate_pwa_icons.py
   ```
   (atau edit manual: replace file di folder `icons/`)
3. Pastikan semua ukuran di-generate: 16, 32, 180, 192, 512 (any + maskable)

## 🚀 Cara Deploy ke GitHub Pages

### Langkah 1 — Buat Repository Baru

1. Buka https://github.com/new
2. Repository name: `mgmp-absensi-pwa` (atau apa punama)
3. **Public** (wajib untuk GitHub Pages gratis)
4. Centang **Add a README file**
5. Klik **Create repository**

### Langkah 2 — Upload Semua File

#### Opsi A: Upload via Web (paling mudah)

1. Di repo, klik **Add file → Upload files**
2. Drag semua isi folder `mgmp-absensi-pwa/` (termasuk subfolder `icons/`)
3. Commit changes

#### Opsi B: Upload via Git CLI

```bash
git clone https://github.com/USERNAME/mgmp-absensi-pwa.git
cd mgmp-absensi-pwa
# Salin semua file dari folder mgmp-absensi-pwa ke sini
git add .
git commit -m "Initial PWA wrapper for Absensi MGMP"
git push origin main
```

### Langkah 3 — Aktifkan GitHub Pages

1. Buka tab **Settings** di repo
2. Menu kiri → **Pages**
3. Section **Build and deployment**
   - **Source**: Deploy from a branch
   - **Branch**: `main` / `(root)` / **Save**
4. Tunggu 1-2 menit, lalu refresh halaman
5. URL Anda akan muncul, formatnya:

   ```
   https://USERNAME.github.io/mgmp-absensi-pwa/
   ```

### Langkah 4 — Verifikasi

1. Buka URL GitHub Pages di browser HP/PC
2. Buka DevTools (F12) → tab **Application**
   - **Manifest**: harus terdeteksi, nama "Absensi MGMP"
   - **Service Workers**: status "activated and is running"
3. Test install: di Chrome Android, menu (⋮) → **Install app** / **Add to Home screen**

## 📱 Cara Install di HP Android

### Via Chrome Android

1. Buka URL GitHub Pages di Chrome Android
2. Tunggu splash screen selesai → aplikasi muncul
3. Setelah 3 detik, banner "Pasang Absensi MGMP" muncul di bawah
4. Klik **Pasang** → confirm → app terpasang
5. **Alternatif**: Menu (⋮) → **Add to Home screen** / **Install app**

### Via Browser Lain (Firefox, Samsung Internet)

1. Buka URL
2. Menu browser → **Add to Home screen** atau **Install app**

### Setelah Terpasang

- Icon "Absensi MGMP" muncul di home screen HP
- Buka app → langsung fullscreen (tanpa address bar browser)
- Berperilaku seperti aplikasi native:
  - Splash screen saat loading
  - Bisa di-set sebagai default app
  - Notifikasi (kalau ditambahkan nanti)
  - Berjalan offline (shell PWA, isi Apps Script butuh internet)

## 🍎 Cara Install di iPhone/iPad (iOS Safari)

1. Buka URL GitHub Pages di **Safari** (wajib Safari, bukan Chrome iOS)
2. Tap icon **Share** (kotak dengan panah ke atas)
3. Pilih **Add to Home Screen**
4. Klik **Add**
5. Icon "Absensi MGMP" muncul di home screen

**Catatan iOS**: Apple tidak support PWA install prompt otomatis seperti Android. User harus manual lewat Share menu.

## 🔄 Update Aplikasi

### Update Konten Apps Script (server-side)

Tidak perlu deploy ulang PWA. Cukup:
1. Edit kode di Apps Script editor
2. **Deploy → New version** di Apps Script
3. User tinggal refresh app → otomatis dapat versi terbaru

### Update PWA Wrapper (shell)

Kalau ada perubahan di `index.html`, `sw.js`, atau `manifest.json`:

1. Edit file di repo GitHub
2. Naikkan versi cache di `sw.js`:
   ```js
   const CACHE_VERSION = "v1.0.1";  // ← ubah dari v1.0.0
   ```
3. Commit & push → GitHub Pages auto-deploy dalam 1-2 menit
4. User akan otomatis dapat update setelah SW selesai update (reload otomatis)

## 🔍 Fitur PWA yang Sudah Aktif

| Fitur | Status |
|-------|--------|
| Installable (Add to Home Screen) | ✅ |
| Splash screen kustom (gradient biru + "MG") | ✅ |
| Service worker dengan caching | ✅ |
| Bisa dibuka offline (shell only) | ✅ |
| Maskable icon (Android adaptive) | ✅ |
| Apple touch icon (iOS) | ✅ |
| Auto-update SW | ✅ |
| Install banner kustom | ✅ |
| Fallback UI bila iframe gagal | ✅ |
| Portrait orientation lock | ✅ |
| Shortcuts (Scan, Dashboard) | ✅ |

## ⚠️ Catatan Penting

1. **HTTPS wajib** — GitHub Pages sudah HTTPS by default ✅
2. **Service Worker butuh HTTPS atau localhost** — terpenuhi ✅
3. **Scope SW** = folder deploy. Jika app di `github.io/user/repo/`, `start_url: "./"` sudah benar.
4. **Apps Script iframe butuh internet** — PWA shell bisa offline, tapi isi iframe (Apps Script) tetap perlu koneksi.
5. **Cache size** — Apps Script sering return halaman besar. Cache akan tumbuh seiring waktu. SW otomatis bersihkan cache lama saat versi naik.
6. **Camera permission** — Untuk scan QR, browser akan minta izin kamera. Pastikan `allow="camera"` di iframe (sudah ada).
7. **Pop-up scanner** — Kalau Apps Script pakai popup window untuk kamera (seperti di app MGMP), popup akan tetap berfungsi dari PWA.

## 🛠️ Troubleshooting

### SW tidak terdaftar
- Cek DevTools → Application → Service Workers
- Pastikan tidak ada SW lama yang masih jalan → **Unregister**
- Hard refresh: `Ctrl + Shift + R`

### Icon tidak muncul di install prompt
- Pastikan **kedua** icon 192 dan 512 ada di manifest
- Pastikan `purpose` benar (`any` dan `maskable`)
- Test di Chrome DevTools → Application → Manifest → **Generate** error report

### "Add to Home screen" tidak muncul
- Chrome butuh **engagement criteria** (minimal interaksi dengan halaman)
- Pastikan SW **active** dan **manifest** valid
- Test di Chrome DevTools → Application → Manifest → klik **Install** (icon install di samping URL bar)

### Iframe blank / error CORS
- Apps Script kadang reject embed. Pastikan `X-Frame-Options` tidak di-set di response Apps Script (default Google tidak masalah)
- Coba buka URL Apps Script langsung — harus load tanpa error
- Pastikan deployment Apps Script set ke "Anyone" (bukan "Only myself")

### Camera tidak berfungsi di PWA
- Pastikan URL PWA di HTTPS (GitHub Pages sudah HTTPS)
- Cek permission: Settings HP → Apps → Chrome/PWA → Permissions → Camera → Allow
- Kalau popup kamera diblokir, izinkan popup untuk situs PWA

### Aplikasi tidak update setelah deploy baru
- Naikkan versi cache di `sw.js` (`CACHE_VERSION`)
- Hard refresh browser
- Atau: Settings HP → Apps → PWA → Clear cache

## 🌐 Custom Domain (Opsional — Bisa Dipakai)

**Ya, custom domain bisa dipakai!** GitHub Pages mendukung custom domain gratis.

### Cara Setup Custom Domain

Misalnya Anda punya domain `mgmp.probolinggokab.go.id` atau `absensimgmp.com`:

#### Langkah 1 — Tambah CNAME Record di DNS Domain Anda

Login ke panel DNS domain Anda (Namecheap, Cloudflare, Niagahoster, dll), tambah record:

| Type | Name | Value |
|------|------|-------|
| **CNAME** | `@` atau `www` | `USERNAME.github.io` |

**Contoh**:
- Domain: `absensimgmp.com`
- CNAME record: `@` → `budhiprayitno.github.io` (ganti dengan username GitHub Anda)

#### Langkah 2 — Aktifkan Custom Domain di GitHub

1. Di repo GitHub, klik tab **Settings**
2. Menu kiri → **Pages**
3. Section **Custom domain** → ketik domain Anda: `absensimgmp.com`
4. Klik **Save**
5. Centang **Enforce HTTPS** (gratis, otomatis dapat SSL sertifikat Let's Encrypt)
6. Tunggu 5-15 menit untuk DNS propagation

#### Langkah 3 — Update PWA Konfigurasi

Edit `manifest.json` — tidak ada yang perlu diubah (start_url pakai `./` relatif, otomatis pakai domain baru).

Edit `sw.js` — tidak ada yang perlu diubah (URL relatif).

**Selesai!** Akses PWA lewat: `https://absensimgmp.com/`

### Subdomain Pemerintah (Contoh)

Kalau MGMP ingin subdomain dari situs pemerintahan:
- `mgmp.probolinggokab.go.id` → CNAME ke `USERNAME.github.io`
- Butuh koordinasi dengan admin Dinas Pendidikan untuk setup DNS

### Catatan Custom Domain

- **HTTPS wajib untuk PWA** → GitHub Pages auto-provide SSL via Let's Encrypt ✅
- **DNS propagation** bisa makan 5 menit - 24 jam (biasanya <1 jam)
- **WWW vs non-WWW**: pilih salah satu, redirect otomatis dari GitHub
- **Free SSL** — tidak perlu beli sertifikat SSL terpisah

### Alternatif Hosting (Selain GitHub Pages)

Kalau tidak mau pakai GitHub Pages, alternatif gratis:

| Platform | Kelebihan | Kekurangan |
|----------|----------|------------|
| **Netlify** | Drag-drop deploy, custom domain gratis, auto HTTPS | Limit 100GB bandwidth/bulan |
| **Vercel** | Performance bagus, global CDN, custom domain | Untuk non-Next.js agak ribet |
| **Cloudflare Pages** | Unlimited bandwidth, fast, custom domain | Setup sedikit teknis |
| **Firebase Hosting** | Google ecosystem, free SSL | Limit 10GB storage |

**Saran**: Untuk MGMP, **Netlify** paling user-friendly. Drag folder → otomatis deploy + dapat URL `https://mgmp-absensi.netlify.app`.

## 📞 Bantuan

Jika ada masalah, cek:
1. Console browser (F12 → Console)
2. DevTools → Application → Manifest (cek warning)
3. DevTools → Application → Service Workers (cek error log)
4. DevTools → Network → reload (cek request yang gagal)

## 🎨 Detail Visual PWA (Yang Sudah Ditingkatkan)

- ✅ **Splash screen**: gradient biru 3-warna (#1a73e8 → #4285f4 → #1a73e8) dengan animasi background
- ✅ **Logo**: lingkaran putih berisi logo MGMP asli (emblem tengah, teks sudah ter-crop)
- ✅ **Animasi**: pulse logo + progress bar di bawah + spinner loading
- ✅ **Text hierarki**: subtitle "MGMP BAHASA INGGRIS" → title "Absensi MGMP" → "Kabupaten Probolinggo"
- ✅ **Version badge** di bawah splash
- ✅ **Install banner**: biru MGMP, muncul otomatis setelah 3 detik
- ✅ **Icons**: 4 variant (any + maskable) untuk kompatibilitas Android adaptive + iOS

## 💡 Saran Lanjutan (Opsional)

1. **Custom Logo** ✅ — sudah pakai logo MGMP asli (background biru gradient + emblem di tengah)
2. **Push Notifications** ❌ — skip (butuh Firebase Cloud Messaging, berbayar untuk skala besar)
3. **Custom Domain** ✅ — bisa dipakai gratis lewat GitHub Pages + CNAME (lihat section di atas)
4. **Play Store Listing** — package PWA jadi APK pakai [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (TWA), upload ke Play Store

---

© MGMP Bahasa Inggris Kabupaten Probolinggo · FISKLOPEDIA
