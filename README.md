# Sistem Manajemen Kos / Sewa Properti + Github OAuth

Sistem berbasis Service-Oriented Architecture untuk manajemen properti kos dan booking kamar.

## Identitas

### Nama : Muhammad Fakhry Zacky Putra
### NIM : 2410511009
### Kelas : A
### Mata Kuliah : Pembangunan Perangkat Lunak Berorientasi Servis

## Arsitektur

```
Client / Postman
      │
      ▼
  [Gateway]  :4000
      │
      ├──► [auth-service]      :5001  Node.js + Express
      ├──► [kos-service]  :8000  PHP Laravel 11
      └──► [booking-service]   :5002  Node.js + Express

Semua service terhubung ke MySQL dengan database terpisah: auth_db, kos_db, booking_db
```

## Tech Stack

| Komponen | Teknologi |
|---|---|
| API Gateway | Node.js + Express |
| Auth Service | Node.js + Express |
| Kos Service | PHP Laravel 11 (MVC) |
| Booking Service | Node.js + Express |
| Database | MySQL |
| Containerization | Docker + Docker Compose |
| Auth | JWT + GitHub |

## Cara Menjalankan

```bash
# 1. Clone repository
git clone https://github.com/abcdefakhry/uts-pplos-a-2410511009.git
cd uts-pplos-a-2410511009

# 2. Buat file .env dari template
cp .env.example .env
# Edit .env dan isi nilai yang diperlukan

# 3. Jalankan semua service
docker-compose up --build

# 4. Akses API melalui gateway
# http://localhost:4000
```

## Peta Endpoint

Semua endpoint diakses melalui `http://localhost:4000`.

### Auth (`/auth`)
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/auth/register` | — |
| POST | `/auth/login` | — |
| POST | `/auth/refresh-token` | — |
| POST | `/auth/logout` | ✓ |
| GET | `/auth/github` | — |
| GET | `/auth/github/callback` | — |

### Kos (`/properties`, `/rooms`)
| Method | Endpoint | Auth |
|---|---|---|
| GET | `/properties` | — |
| POST | `/properties` | ✓ |
| GET | `/properties/:id` | — |
| PUT | `/properties/:id` | ✓ |
| DELETE | `/properties/:id` | ✓ |
| GET | `/rooms` | — |
| POST | `/rooms` | ✓ |
| GET | `/rooms/:id` | — |
| PUT | `/rooms/:id` | ✓ |
| DELETE | `/rooms/:id` | ✓ |
| GET | `/owners` | — |
| POST | `/owners` | ✓ |
| GET | `/owners/:id` | — |
| PUT | `/owners/:id` | ✓ |
| DELETE | `/owners/:id` | ✓ |

### Booking & Pembayaran (`/bookings`)
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/bookings` | ✓ |
| GET | `/bookings` | ✓ |
| GET | `/bookings/:id` | ✓ |
| PUT | `/bookings/:id/status` | ✓ |
| DELETE | `/bookings/:id` | ✓ |

## Demo Video

[Demo Video](TBA)


