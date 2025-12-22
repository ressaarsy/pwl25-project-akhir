const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.get('/stats', TaskController.getTaskStats);

// RUTE BARU UNTUK PROFILE
router.get('/profile-data', TaskController.getUserProfile); 

router.get('/:id', TaskController.getTaskById);
router.patch('/:id/status', TaskController.updateStatus);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;