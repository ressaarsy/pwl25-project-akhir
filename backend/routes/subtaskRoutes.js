// backend/routes/subtaskRoutes.js
const express = require('express');
const router = express.Router();
const SubtaskController = require('../controllers/SubtaskController');
const authMiddleware = require('../middleware/authMiddleware');

// Semua route di bawah ini butuh login
router.use(authMiddleware);

router.get('/:taskId', SubtaskController.getSubtasksByTask); // Ambil list
router.post('/', SubtaskController.createSubtask);           // Tambah baru
router.patch('/:id', SubtaskController.toggleSubtask);       // Centang selesai
router.delete('/:id', SubtaskController.deleteSubtask);      // Hapus

module.exports = router;