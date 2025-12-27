// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();
const errorHandler = require('./middleware/errorMiddleware'); // --- BARU (Syarat UAS) ---

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const subtaskRoutes = require('./routes/subtaskRoutes'); // --- BARU ---

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes); // --- BARU ---

// Test Server
app.get('/', (req, res) => {
  res.send('Backend PWL jalan 🚀');
});

// Middleware Error Handler (Wajib ditaruh PALING BAWAH sebelum listen)
app.use(errorHandler); // --- BARU (Syarat UAS) ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});