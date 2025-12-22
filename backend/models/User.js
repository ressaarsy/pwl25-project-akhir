// backend/models/User.js

const db = require('../config/db'); // Sesuaikan path db kamu

const User = {
  // Fungsi Create
  create: (newUser, callback) => {
    // Pastikan "nama" ada di dalam kurung INSERT dan VALUES
    const query = "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)";
    
    db.query(
      query,
      [newUser.nama, newUser.email, newUser.password], 
      (err, res) => {
        if (err) {
          console.log("Error inserting user:", err);
          callback(err, null);
          return;
        }
        callback(null, { id: res.insertId, ...newUser });
      }
    );
  },

  // Fungsi FindByEmail (biarkan jika sudah jalan)
  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, res);
    });
  }
};

module.exports = User;