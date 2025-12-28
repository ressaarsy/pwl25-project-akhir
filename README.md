# Project Pemrograman Web Lanjut

Anggota Kelompok: 
1. Muh. Ressa Arsy Ma’rif (F1D022137)
2. Fadila Rahmania (F1D02310048)
3. Fitri Nufa Dastana (F1D02310052) 

## Ringkasan Proyek
Proyek ini merupakan pengembangan **Sistem Manajemen Tugas Mahasiswa** berbasis web yang menerapkan arsitektur REST API menggunakan Node.js, Express.js, dan MySQL sebagai backend. Sistem ini menyediakan fungsionalitas CRUD (Create, Read, Update, Delete) untuk pengelolaan data tugas mahasiswa, baik tugas individu maupun kelompok.

**Backend** dikembangkan dengan struktur folder yang rapi menggunakan pola **MVC (Model–View–Controller)** guna memisahkan logika bisnis, pengelolaan data, dan pengendalian alur aplikasi. Sistem juga dilengkapi dengan autentikasi berbasis **JWT (JSON Web Token)** yang memungkinkan pengguna melakukan registrasi, login, serta mengakses endpoint tertentu yang dilindungi, seperti data profil pengguna dan daftar tugas milik masing-masing pengguna. Proses verifikasi token dilakukan melalui **middleware autentikasi** sebelum pengguna dapat mengakses resource yang bersifat privat.

Pada sisi **frontend**, aplikasi dibangun sebagai Single Page Application (SPA) menggunakan **Vue 3**, yang mengonsumsi REST API melalui mekanisme HTTP request. Vue Router digunakan untuk mengatur navigasi halaman, termasuk pemisahan antara halaman publik dan halaman yang memerlukan autentikasi pengguna. Konfigurasi environment seperti koneksi database dan secret key JWT dikelola menggunakan file .env untuk menjaga keamanan dan fleksibilitas konfigurasi.

## Cara Run Backend
<img width="1528" height="563" alt="gambar" src="https://github.com/user-attachments/assets/22a4ca8b-723c-46de-8b1d-db1233605007" />

## Cara Run Frontend
<img width="1146" height="723" alt="gambar" src="https://github.com/user-attachments/assets/e80fa13e-51a9-455e-ba9e-b666a9dcfed6" />

## Daftar Endpoint 
**1. AUTH**

POST   /api/auth/register

POST   /api/auth/login

GET    /api/auth/profile-data

**2. TUGAS (TASKS – CRUD)**

GET    /api/tasks

POST   /api/tasks

PUT    /api/tasks/:id

DELETE /api/tasks/:id

**3. SUB TUGAS (SUBTASKS)**

POST   /api/tasks/:taskId/subtasks

PATCH  /api/subtasks/:id

DELETE /api/subtasks/:id

## Entity Relationship Diagram

<img width="1299" height="264" alt="Project PWL-Page-1 drawio" src="https://github.com/user-attachments/assets/528635c7-e33d-4b83-85b9-0edcb544fbae" />


Sistem ini terdiri dari tiga entitas utama, yaitu **users**, **task**, dan **subtask**. Tabel **users** menyimpan data mahasiswa sebagai pengguna sistem, sedangkan tabel **task** menyimpan informasi tugas atau proyek yang dibuat oleh pengguna, dengan relasi one-to-many di mana satu pengguna dapat memiliki banyak task. Setiap task dapat dipecah menjadi beberapa subtask yang tersimpan pada tabel **subtask**, juga dengan relasi one-to-many, untuk mendukung pengelolaan pekerjaan secara lebih rinci. Struktur relasi ini memungkinkan sistem mengelola tugas mahasiswa secara hierarkis, terstruktur, dan efisien, mulai dari pengguna, tugas utama, hingga rincian subtugas.




