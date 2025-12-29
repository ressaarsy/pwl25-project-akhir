# Project Pemrograman Web Lanjut  
## Sistem Manajemen Tugas Mahasiswa

## Anggota Kelompok
1. **Muh. Ressa Arsy Ma’rif** (F1D022137)  
2. **Fadila Rahmania** (F1D02310048)  
3. **Fitri Nufa Dastana** (F1D02310052)  

## Ringkasan Proyek
Proyek ini merupakan pengembangan **Sistem Manajemen Tugas Mahasiswa** berbasis web yang menerapkan arsitektur **REST API** menggunakan **Node.js**, **Express.js**, dan **MySQL** sebagai backend. Sistem ini menyediakan fungsionalitas **CRUD (Create, Read, Update, Delete)** untuk pengelolaan data tugas mahasiswa, baik tugas individu maupun tugas kelompok.

Pada sisi **backend**, aplikasi dikembangkan dengan struktur folder yang terorganisir menggunakan pola **MVC (Model–View–Controller)** untuk memisahkan logika bisnis, pengelolaan data, dan pengendalian alur aplikasi. Sistem dilengkapi dengan autentikasi berbasis **JWT (JSON Web Token)** yang memungkinkan pengguna melakukan registrasi, login, serta mengakses endpoint tertentu yang bersifat privat, seperti data profil pengguna dan daftar tugas milik masing-masing user. Validasi token dilakukan melalui **middleware autentikasi** sebelum pengguna dapat mengakses resource yang dilindungi.

Pada sisi **frontend**, aplikasi dibangun sebagai **Single Page Application (SPA)** menggunakan **Vue 3** yang mengonsumsi REST API melalui HTTP request. Navigasi halaman dikelola menggunakan **Vue Router**, termasuk pemisahan antara halaman publik dan halaman yang memerlukan autentikasi pengguna. Konfigurasi environment seperti koneksi database dan secret key JWT dikelola menggunakan file **.env** untuk menjaga keamanan serta fleksibilitas sistem.

## Cara Menjalankan Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
2. Install dependency:
   ```
   npm install
3. Buat file .env di dalam folder backend, lalu isi dengan konfigurasi berikut:
   ```DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=pwl_db
   PORT=3000
   JWT_SECRET=rahasia123
4. Jalankan server:
   ```
   npm start
   ```
Jika berhasil, terminal akan menampilkan:
```
Server running on port 3000
```
## Cara Run Frontend
1. Buka terminal baru (backend tetap berjalan), lalu masuk ke folder frontend:
   ```bash
   cd frontend
2. Install dependency Vue:
   ```
   npm install
3. Jalankan mode development:
   ```
   npm run dev
   ```
Aplikasi dapat diakses melalui browser pada alamat:
```
http://localhost:5173
```
## Daftar Endpoint 
Base URL
```bash
http://localhost:3000/api
```
1. app.use('/api/auth', authRoutes)``` dengan endpoint:
   - ```router.post('/register', register)```
     
     URL: http://localhost:3000/api/auth/register
     
     Deskripsi: Mendaftarkan akun pengguna baru.
     
   - router.post('/login', login)```
     
     URL: http://localhost:3000/api/auth/login
     
     Deskripsi: Login pengguna untuk mendapatkan Token JWT.
     
   - router.get('/profile-data', verifyToken, getUserProfile)
     
     URL: http://localhost:3000/api/auth/profile-data
     
     Deskripsi: Mengambil data profil user (Protected Route).

2. ```app.use('/api/tasks', taskRoutes)``` dengan endpoint:
   - ```router.get('/stats', verifyToken, getTaskStats)```
     
     URL: http://localhost:3000/api/tasks/stats
     
     Deskripsi: Mengambil data statistik performa mingguan untuk grafik.
   
   - ```router.get('/', verifyToken, getAllTasks)```

     URL: http://localhost:3000/api/tasks

     Deskripsi: Mengambil daftar semua tugas milik user.
   
   - ```router.post('/', verifyToken, createTask)```

     URL: http://localhost:3000/api/tasks

     Deskripsi: Membuat tugas baru.

   - ```router.put('/:id', verifyToken, updateTask)```

     URL: http://localhost:3000/api/tasks/{id}

     Deskripsi: Mengupdate data tugas secara lengkap (Judul, Deskripsi, dll).

   - ```router.patch('/:id/status', verifyToken, updateStatus)```

     URL: http://localhost:3000/api/tasks/{id}/status

     Deskripsi: Quick update untuk mengubah status tugas saja.

   - ```router.delete('/:id', verifyToken, deleteTask)```

     URL: http://localhost:3000/api/tasks/{id}

     Deskripsi: Menghapus tugas.

3. ```app.use('/api/subtasks', subtaskRoutes)``` dengan endpoint:

   - ```router.get('/:taskId', verifyToken, getSubtasksByTask)```

     URL: http://localhost:3000/api/subtasks/{taskId}

     Deskripsi: Melihat daftar sub-tugas berdasarkan ID Tugas Utama.

   - ```router.post('/', verifyToken, createSubtask)```

     URL: http://localhost:3000/api/subtasks

     Deskripsi: Menambahkan sub-tugas baru.

   - ```router.patch('/:id', verifyToken, toggleSubtask)```

     URL: http://localhost:3000/api/subtasks/{id}

     Deskripsi: Mengubah status checklist sub-tugas (Selesai/Belum).
   
   - ```router.delete('/:id', verifyToken, deleteSubtask)```

     URL: http://localhost:3000/api/subtasks/{id}

     Deskripsi: Menghapus sub-tugas.

## Entity Relationship Diagram

<img width="1299" height="264" alt="Project PWL-Page-1 drawio" src="https://github.com/user-attachments/assets/528635c7-e33d-4b83-85b9-0edcb544fbae" />

Entity Relationship Diagram (ERD) pada sistem ini terdiri dari tiga tabel utama, yaitu **users**, **task**, dan **subtask**. Tabel **users** menyimpan data pengguna, sedangkan tabel **task** digunakan untuk mencatat tugas yang dibuat oleh masing-masing pengguna. Hubungan antara **users** dan **task** bersifat one-to-many, artinya satu pengguna dapat memiliki banyak tugas, namun setiap tugas hanya dimiliki oleh satu pengguna.

Selanjutnya, tabel **task** berelasi one-to-many dengan tabel **subtask**. Relasi ini memungkinkan satu tugas dipecah menjadi beberapa sub-tugas agar pekerjaan lebih terstruktur. Setiap sub-tugas terhubung ke tugas utama melalui **task_id**, sehingga jika tugas utamanya dihapus, rincian subtask-nya juga otomatis ikut terhapus.
