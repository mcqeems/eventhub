# Eventhub

Eventhub adalah aplikasi manajemen acara berbasis web yang dibangun menggunakan arsitektur backend modern. Aplikasi ini memungkinkan penyelenggara acara untuk mengelola data acara, mendaftarkan peserta, serta memberikan akses publik bagi calon peserta untuk melihat acara yang akan datang.

## A. Penjelasan Project

Project ini dikembangkan menggunakan framework backend **NestJS** yang beroperasi di atas lingkungan **Node.js**. Arsitektur aplikasi mengadopsi pola MVC (Model-View-Controller) dengan antarmuka yang di-render secara server-side menggunakan **Handlebars (hbs)**. 

Fitur utama yang tersedia:
- Autentikasi menggunakan **JSON Web Token (JWT)** berbasis cookies dan header.
- Halaman publik untuk melihat daftar acara yang akan datang.
- Dashboard admin (panel) untuk manajemen acara secara penuh (Create, Read, Update, Delete).
- Manajemen peserta acara, yang terhubung langsung dengan relasi acara menggunakan **Prisma ORM**.
- Filter pencarian dinamis dengan autocomplete khusus pada halaman manajemen peserta.

## B. Desain Database

Database aplikasi dikelola secara deklaratif menggunakan **Prisma Schema** yang terhubung ke database **MySQL** (atau **MariaDB**).

![ERD Eventhub](images/erd_eventhub.png)

Berikut adalah entitas utama dalam sistem:

1. **Table `events`**
   - Menyimpan informasi detail mengenai acara.
   - Kolom: `id`, `name`, `date`, `location`, `max`, `min`, `created_at`.
   - Memiliki relasi one-to-many ke tabel `participants`.

2. **Table `participants`**
   - Menyimpan informasi peserta yang terdaftar pada sebuah acara.
   - Kolom: `id`, `name`, `email`, `institusi`, `jurusan`, `semester`, `event_id`, `created_at`.
   - Menggunakan `event_id` sebagai foreign key yang merujuk ke tabel `events`.

3. **Table `users`**
   - Menyimpan informasi akun admin atau staf untuk mengakses dashboard panel.
   - Kolom: `id`, `username`, `password`, `role`, `created_at`.
   - `password` di-hash menggunakan **bcrypt** sebelum disimpan.
   - Menggunakan enum `users_role` (STAFF atau ADMIN) untuk hak akses.

## C. Panduan Manual dan Screenshot Aplikasi

Bagian ini merupakan panduan visual untuk menggunakan setiap halaman yang tersedia di dalam aplikasi.

### 1. Halaman Login & Registrasi
**URL:** `/sign-in` dan `/sign-up`
- **Fungsi:** Halaman ini digunakan oleh staf atau admin untuk mendapatkan akses ke dalam sistem panel. Registrasi membutuhkan input spesifik (termasuk secret key pada environment tertentu) untuk memvalidasi pendaftaran akun baru.
- **Screenshot:** 
  ![Sign In](images/sign-in.png)
  ![Sign Up](images/sign-up.png)

### 2. Halaman Beranda & Publik Acara
**URL:** `/` dan `/events`
- **Fungsi:** Halaman yang dapat diakses tanpa melakukan login. Calon peserta dapat melihat seluruh daftar acara yang akan datang. Tersedia juga fitur pencarian sederhana di bagian atas untuk memfilter acara berdasarkan nama. Peserta juga dapat masuk ke halaman registrasi acara tertentu.
- **Screenshot:** 
  ![Home](images/home.png)
  ![Public Events](images/events.png)
  ![Event Registration](images/events-registration.png)

### 3. Dashboard Panel
**URL:** `/panel`
- **Fungsi:** Halaman utama setelah admin berhasil melakukan proses login. Halaman ini memberikan navigasi yang bersih dan terstruktur menuju modul manajemen acara dan peserta.
- **Screenshot:** 
  ![Dashboard](images/dashboard.png)

### 4. Manajemen Acara (Events Panel)
**URL:** `/panel/events`
- **Fungsi:** Antarmuka tabel yang menampilkan seluruh data acara. Admin dapat menekan tombol `[+] Search Filters` untuk memunculkan form pencarian spesifik (berdasarkan nama, tanggal, dan lokasi). Terdapat juga aksi untuk melihat detail, mengubah, dan menghapus acara. Sistem memberikan validasi ketat, sehingga acara yang masih memiliki peserta tidak dapat dihapus.
- **Screenshot:** 
  ![Manage Events](images/manage-events.png)
  ![Manage Events Filter](images/manage-events-filter.png)
  ![Manage Events Create](images/manage-events-create.png)
  ![Manage Events Update](images/manage-events-update.png)
  ![Manage Events Details](images/manage-events-details.png)

### 5. Manajemen Peserta (Participants Panel)
**URL:** `/panel/participants`
- **Fungsi:** Antarmuka tabel yang memuat seluruh pendaftaran peserta. Dilengkapi dengan filter pencarian canggih dengan layout grid. Fitur unggulan di halaman ini adalah **autocomplete** pada filter Event ID; saat admin mengetik nama acara, sistem secara otomatis merender daftar acara terkait untuk dipilih.
- **Screenshot:** 
  ![Manage Participants](images/manage-participants.png)
  ![Manage Participants Create](images/manage-participants-create.png)
  ![Manage Participants Update](images/manage-participants-update.png)
  ![Manage Participants Details](images/manage-participants-details.png)

## D. Dependency Utama

Proyek ini dibangun di atas beberapa dependensi inti yang stabil, antara lain:
- **@nestjs/core & @nestjs/common** (v11.0.1) - Framework utama infrastruktur backend.
- **@prisma/client** (v7.8.0) - ORM untuk interaksi efisien dengan database relasional.
- **hbs** (v4.2.1) - Template engine untuk merender antarmuka pengguna di sisi server HTML.
- **@nestjs/jwt** (v11.0.2) - Implementasi standar untuk pembuatan dan verifikasi keamanan token.
- **bcrypt** (v6.0.0) - Library kriptografi untuk melakukan algoritma hashing pada password.
- **cookie-parser** (v1.4.7) - Middleware express untuk membaca dan mengelola token sesi yang disimpan dalam cookies browser.
- **zod** (v4.4.3) - Validasi ketat terhadap skema tipe data.

## E. Informasi Lain Untuk Developer Selanjutnya

Untuk meneruskan pengembangan project ini, berikut adalah panduan inisiasi lokal:

1. **Instalasi Modul:**
   Jalankan perintah instalasi menggunakan package manager (direkomendasikan npm).
   ```bash
   npm install
   ```

2. **Pengaturan Environment Variables:**
   Aplikasi membutuhkan file konfigurasi `.env` di direktori utama proyek. Pastikan variabel berikut dikonfigurasi dengan benar sesuai lingkungan lokal anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/nama_database"
   JWT_SECRET="secret_token_anda"
   ```

3. **Migrasi Database:**
   Lakukan generate pada Prisma client dan jalankan pembaruan skema agar struktur database MySQL anda tersinkronisasi.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Menjalankan Server:**
   Jalankan mode development untuk mengaktifkan fitur live-reload yang mempermudah proses modifikasi kode.
   ```bash
   npm run start:dev
   ```
   Aplikasi secara bawaan akan berjalan dan dapat diakses melalui browser pada port `3000`.

5. **Pengujian API (API Testing):**
   Terdapat spesifikasi pengujian Postman yang komprehensif di dalam folder `api_specs`. Konfigurasi ini memiliki fitur pre-request scripts otomatis untuk injeksi variabel autentikasi dinamis dan manajemen ID siklus hidup acara. Anda dapat mengimpor file `eventhub.json` dan `eventhub_env_postman.json` ke dalam aplikasi Postman untuk menjalankan pengujian validasi dari ujung ke ujung tanpa perlu memanipulasi ID secara manual.
