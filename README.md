# 🚀 SIMRS-Demo (Laravel + Inertia.js + React + PrimeReact + TailwindCSS)

Ini adalah project starter untuk membangun aplikasi full-stack menggunakan **Laravel**, **Inertia.js**, **React**, **PrimeReact**, dan **Tailwind CSS**. Cocok untuk sistem informasi seperti SIMRS, ERP, CRM, dan aplikasi skala menengah-besar lainnya.

---

## 🛠️ Stack Teknologi

| Layer         | Teknologi         |
|---------------|-------------------|
| Backend       | Laravel 10.x      |
| Frontend      | React + Inertia.js|
| UI Component  | PrimeReact        |
| Styling       | Tailwind CSS      |
| Routing       | Laravel Web Routes (SPA via Inertia) |
| Authentication| Laravel Breeze (Inertia + React) |

---

## 🚧 Instalasi

### 1. Clone Repo

```bash
https://github.com/nurzaman-now/simrs-test.git
cd simrs-test

composer install
cp .env.example .env
php artisan key:generate

# Setup database di .env
php artisan migrate --seed
php artisan storage:link
```

# 🚀 Menjalankan Aplikasi

```bash
npm install
npm run dev
php artisan serve
```

# 📚 Dokumentasi
Untuk dokumentasi lengkap, silakan kunjungi [Laravel](https://laravel.com/docs/10.x), [Inertia.js](https://inertiajs.com/), [React](https://reactjs.org/docs/getting-started.html), [PrimeReact](https://primefaces.org/primereact/showcase/#/), dan [Tailwind CSS](https://tailwindcss.com/docs).

# Akun
Silahkan cek file `database/seeders/UserSeeder.php` untuk melihat akun yang sudah dibuat.
