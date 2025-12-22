const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../middleware/authMiddleware'); // Pastikan path ini benar sesuai struktur foldermu

// Route Public
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Route Private (Perlu Login) - Ini yang dipanggil ProfileView
router.get('/profile-data', verifyToken, AuthController.getProfileData);

module.exports = router;