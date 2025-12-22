require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // <--- FILE BARU

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // <--- FILE BARU

// Test Server
app.get('/', (req, res) => {
  res.send('Backend PWL jalan 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});