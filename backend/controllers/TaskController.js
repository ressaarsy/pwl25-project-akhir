const db = require('../config/db');

// 1. AMBIL SEMUA TUGAS (Dashboard)
exports.getAllTasks = (req, res) => {
    const userId = req.user.id;
    const filter = req.query.filter; 
    
    let sql = 'SELECT * FROM tasks WHERE user_id = ?';
    let params = [userId];

    // Filter Waktu
    if (filter === 'today') {
        sql += ' AND DATE(deadline) = CURDATE()';
    } else if (filter === 'this_week') {
        sql += ' AND deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)';
    }
    
    // Sorting: Status 'Done' selalu di bawah (1), sisanya di atas (0).
    // Lalu urutkan berdasarkan deadline terdekat.
    sql += ` ORDER BY CASE WHEN status = 'Done' THEN 1 ELSE 0 END ASC, deadline ASC`;

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
        
        const tasks = results.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,           
            category: task.category || 'General', 
            deadline_date: task.deadline,
            created_at: task.created_at
        }));
        
        res.json({ tasks });
    });
};

// 2. BUAT TUGAS BARU
exports.createTask = (req, res) => {
    const { title, description, category, deadline, status } = req.body;
    const userId = req.user.id;

    if (!title) return res.status(400).json({ message: "Judul kosong!" });

    const finalCategory = category || 'General';
    const finalStatus = status || 'To Do';
    const finalDeadline = deadline || null;
    const isCompleted = finalStatus === 'Done' ? 1 : 0;

    const sql = 'INSERT INTO tasks (user_id, title, description, category, deadline, status, is_completed) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [userId, title, description, finalCategory, finalDeadline, finalStatus, isCompleted], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Berhasil membuat tugas', id: result.insertId });
    });
};

// 3. UPDATE STATUS (Quick Action)
exports.updateStatus = (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body; 
    const isCompleted = status === 'Done' ? 1 : 0;

    const sql = 'UPDATE tasks SET status = ?, is_completed = ? WHERE id = ?';
    db.query(sql, [status, isCompleted, taskId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Status updated' });
    });
};

// 4. GET DETAIL TUGAS
exports.getTaskById = (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.id; 

    const sql = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
    db.query(sql, [taskId, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length === 0) return res.status(404).json({ message: "Tugas tidak ditemukan" });
        res.json(result[0]);
    });
};

// 5. UPDATE TUGAS (Edit Full)
exports.updateTask = (req, res) => {
    const taskId = req.params.id;
    const { title, description, category, deadline } = req.body;
    
    const sql = 'UPDATE tasks SET title = ?, description = ?, category = ?, deadline = ? WHERE id = ?';
    db.query(sql, [title, description, category, deadline, taskId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Tugas berhasil diupdate' });
    });
};

// 6. DELETE TUGAS
exports.deleteTask = (req, res) => {
    const taskId = req.params.id;
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [taskId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Tugas berhasil dihapus' });
    });
};

// 7. AMBIL STATISTIK PERFORMA
exports.getTaskStats = (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT * FROM tasks WHERE user_id = ?';
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json(err);

        // Hitung awal minggu (Senin) dan akhir minggu (Minggu)
        const now = new Date();
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay() || 7; // Ubah Minggu (0) jadi 7
        if (day !== 1) startOfWeek.setHours(-24 * (day - 1)); 
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); 
        endOfWeek.setHours(23, 59, 59, 999);

        let completed = 0;
        let overdue = 0;
        // Index 0=Senin, 6=Minggu
        let weeklyData = { done: [0,0,0,0,0,0,0], progress: [0,0,0,0,0,0,0] };

        results.forEach(task => {
            const deadline = new Date(task.deadline);
            const isDone = task.status === 'Done';
            
            // Hitung total completed & overdue
            if (isDone) completed++;
            if (!isDone && deadline < new Date().setHours(0, 0, 0, 0)) overdue++;

            // Hitung data grafik mingguan
            if (deadline >= startOfWeek && deadline <= endOfWeek) {
                let dayIndex = deadline.getDay(); 
                // Konversi: Minggu(0) -> 6, Senin(1) -> 0
                dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; 

                if (isDone) weeklyData.done[dayIndex]++;
                else weeklyData.progress[dayIndex]++;
            }
        });

        // Hitung persentase
        let totalWeeklyTasks = weeklyData.done.reduce((a, b) => a + b, 0) + weeklyData.progress.reduce((a, b) => a + b, 0);
        let progressPercentage = totalWeeklyTasks === 0 ? 0 : Math.round((weeklyData.done.reduce((a, b) => a + b, 0) / totalWeeklyTasks) * 100);

        res.json({
            summary: { completed_total: completed, overdue_total: overdue, progress_percentage: progressPercentage },
            chart: weeklyData
        });
    });
};


// 8. AMBIL DATA PROFILE (FIXED)
exports.getUserProfile = (req, res) => {
    const userId = req.user.id;

    // --- PERBAIKAN DISINI ---
    // SALAH: 'SELECT username, ...' 
    // BENAR: 'SELECT nama, ...' (Sesuai database kamu)
    const sqlUser = 'SELECT nama, email FROM users WHERE id = ?';
    
    const sqlTasks = 'SELECT status FROM tasks WHERE user_id = ?';

    db.query(sqlUser, [userId], (err, userResult) => {
        if (err) return res.status(500).json(err);
        
        if (userResult.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = userResult[0];

        db.query(sqlTasks, [userId], (err, taskResult) => {
            if (err) return res.status(500).json(err);

            const totalTasks = taskResult.length;
            const completedTasks = taskResult.filter(t => t.status === 'Done').length;
            const productivity = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

            res.json({
                user: {
                    // --- PERBAIKAN DISINI JUGA ---
                    // SALAH: user.username
                    // BENAR: user.nama
                    name: user.nama, 
                    email: user.email
                },
                stats: {
                    total: totalTasks,
                    completed: completedTasks,
                    productivity: productivity
                }
            });
        });
    });
};