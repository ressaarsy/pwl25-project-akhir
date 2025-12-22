const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Pastikan path ini benar

// --- REGISTER (Sama seperti sebelumnya) ---
exports.register = (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi!" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  User.create({ nama, email, password: hashedPassword }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal mendaftar" });
    }
    res.json({ message: 'Register berhasil' });
  });
};

// --- LOGIN (Update: Sertakan 'nama' di token) ---
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, result) => {
    if (err || result.length === 0) return res.status(401).json({ message: 'Email tidak ditemukan' });

    const user = result[0];
    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) return res.status(401).json({ message: 'Password salah' });

    // PENTING: Token menyimpan nama agar frontend bisa langsung pakai
    const token = jwt.sign(
      { id: user.id, nama: user.nama, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  });
};

// --- GET PROFILE DATA (Update Khusus Database Kamu) ---
exports.getProfileData = (req, res) => {
  const userId = req.user.id;

  // 1. Ambil Nama User
  const queryUser = "SELECT nama, email FROM users WHERE id = ?";

  // 2. Hitung Statistik Tugas
  // Sesuai gambar database kamu:
  // - Total Tugas = Semua baris di tabel tasks milik user ini
  // - Selesai = Baris dimana kolom 'is_completed' bernilai 1
  const queryStats = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_completed = 1 THEN 1 ELSE 0 END) as completed
    FROM tasks 
    WHERE user_id = ?
  `;

  db.query(queryUser, [userId], (err, userResult) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    if (userResult.length === 0) return res.status(404).json({ message: "User tidak ditemukan" });

    const user = userResult[0];

    db.query(queryStats, [userId], (err, statsResult) => {
      // Setup nilai default jika user belum punya tugas sama sekali
      let total = 0;
      let completed = 0;

      if (statsResult && statsResult.length > 0) {
        total = statsResult[0].total || 0;
        completed = statsResult[0].completed || 0; // Mengambil hasil SUM
      }

      // Hitung persen produktivitas
      const productivity = total === 0 ? 0 : Math.round((completed / total) * 100);

      res.json({
        user: {
          name: user.nama,  // Mengambil kolom 'nama' dari tabel users
          email: user.email
        },
        stats: {
          total: total,
          completed: completed,
          productivity: productivity
        }
      });
    });
  });
};