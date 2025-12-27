// backend/controllers/SubtaskController.js
const db = require('../config/db');

// 1. Ambil Subtask berdasarkan ID Tugas
exports.getSubtasksByTask = (req, res) => {
    const taskId = req.params.taskId;
    const sql = 'SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at ASC';
    db.query(sql, [taskId], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
};

// 2. Tambah Subtask Baru
exports.createSubtask = (req, res) => {
    const { task_id, title, estimated_minutes, target_date } = req.body;
    
    if (!task_id || !title) {
        return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const sql = 'INSERT INTO subtasks (task_id, title, estimated_minutes, target_date) VALUES (?, ?, ?, ?)';
    db.query(sql, [task_id, title, estimated_minutes || 0, target_date || null], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Subtask dibuat', id: result.insertId });
    });
};

// 3. Ubah Status Selesai (Check/Uncheck)
exports.toggleSubtask = (req, res) => {
    const id = req.params.id;
    const { is_completed } = req.body; // Kirim true/false atau 1/0
    
    const sql = 'UPDATE subtasks SET is_completed = ? WHERE id = ?';
    db.query(sql, [is_completed, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Status subtask diupdate' });
    });
};

// 4. Hapus Subtask
exports.deleteSubtask = (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM subtasks WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Subtask dihapus' });
    });
};