<template>
  <div class="app-container">
    <header class="header">
      <div class="header-text">
        <h1 class="page-title">Tugas Harian</h1>
        <p class="subtitle">Kelola tugas dengan efisien</p>
      </div>
      <div class="avatar-circle" @click="$router.push('/profile')">
        {{ userInitials }}
      </div>
    </header>

    <div class="filter-row">
      <button class="filter-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8C96A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
      </button>

      <div class="filter-group">
        <button :class="['chip-btn', { active: currentFilter === 'today' }]" @click="fetchTasks('today')">Hari Ini</button>
        <button :class="['chip-btn', { active: currentFilter === 'this_week' }]" @click="fetchTasks('this_week')">Minggu Ini</button>
        <button :class="['chip-btn', { active: currentFilter === 'all' }]" @click="fetchTasks('all')">Semua</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Total</span>
        <span class="stat-value text-white">{{ taskStats.total }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Selesai</span>
        <span class="stat-value text-green">{{ taskStats.done }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Progress</span>
        <span class="stat-value text-blue">{{ taskStats.progress }}</span>
      </div>
    </div>

    <div class="content-area">
      <p v-if="isLoading" class="loading-text">Sedang memuat data...</p>
      <div v-else-if="tasks.length === 0" class="empty-state"><p>Belum ada tugas.</p></div>
      
      <div v-else class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-card" @click="goToDetail(task.id)">
          <div class="checkbox-wrapper" @click.stop="updateTaskStatus(task.id, task.status)">
            <div :class="['custom-radio', { checked: task.status === 'Done' }]">
              <svg v-if="task.status === 'Done'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          </div>

          <div class="task-details">
            <div class="task-header-row">
                <h3 :class="['task-title', { struck: task.status === 'Done' }]">{{ task.title }}</h3>
                <button class="delete-icon-btn" @click.stop="quickDelete(task.id)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>

            <div class="tag-container">
                <span class="category-pill">{{ task.category }}</span>
                <span v-if="getDeadlineStatus(task) === 'overdue'" class="pill pill-overdue">⚠️ Telat!</span>
                <span v-else-if="getDeadlineStatus(task) === 'urgent'" class="pill pill-urgent">🔥 Segera!</span>
            </div>
            
            <p class="task-desc">{{ task.description || 'Tidak ada deskripsi' }}</p>
            
            <div class="task-meta">
              <span :class="['status-badge', getStatusClass(task.status)]">{{ task.status }}</span>
              <span :class="['task-date', getDateColorClass(task)]">
                📅 {{ formatDate(task.deadline_date) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="fab" @click="showCreateModal = true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>

    <nav class="bottom-nav">
      <div class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="nav-label">Home</span>
      </div>
      <div class="nav-item" @click="$router.push('/performance')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        <span class="nav-label">Performa</span>
      </div>
      <div class="nav-item" @click="$router.push('/profile')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span class="nav-label">Profile</span>
      </div>
    </nav>

    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal-content animate-pop">
        <div class="modal-header">
            <h3 class="modal-title">Tambah Tugas</h3>
            <button class="close-btn" @click="showCreateModal = false">×</button>
        </div>
        
        <div class="form-group">
            <label>Judul</label>
            <input v-model="newTask.title" placeholder="Apa yang ingin dikerjakan?" class="input-field" />
        </div>

        <div class="form-row">
            <div class="form-group half">
                <label>Kategori</label>
                <div class="select-wrapper">
                    <select v-model="newTask.category" class="input-field">
                    <option disabled value="">Pilih...</option>
                    <option>Design</option>
                    <option>Development</option>
                    <option>Marketing</option>
                    <option>Personal</option>
                    <option>General</option>
                    </select>
                </div>
            </div>
            <div class="form-group half">
                <label>Deadline</label>
                <input type="date" v-model="newTask.deadline" class="input-field" />
            </div>
        </div>
        
        <div class="form-group">
            <label>Deskripsi (Opsional)</label>
            <textarea v-model="newTask.description" placeholder="Detail tugas..." class="input-field area"></textarea>
        </div>

        <div class="form-group">
          <label>Status Awal</label>
          <div class="status-grid">
             <button :class="['status-option', { active: newTask.status === 'To Do' }]" @click="newTask.status = 'To Do'">
                <span class="dot-indicator todo"></span> To Do
             </button>
             <button :class="['status-option', { active: newTask.status === 'In Progress' }]" @click="newTask.status = 'In Progress'">
                <span class="dot-indicator progress"></span> Process
             </button>
             <button :class="['status-option', { active: newTask.status === 'Done' }]" @click="newTask.status = 'Done'">
                <span class="dot-indicator done"></span> Done
             </button>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showCreateModal = false" class="btn-text">Batal</button>
          <button @click="createNewTask" class="btn-primary-full">Simpan Tugas</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://localhost:3000/api'; 

export default {
  name: 'TaskDashboard',
  data() {
    return {
      tasks: [],
      currentFilter: 'all', 
      taskStats: { total: 0, done: 0, progress: 0 },
      isLoading: false,
      showCreateModal: false,
      newTask: { title: '', description: '', category: '', deadline: '', status: 'To Do' },
      userName: '' 
    };
  },
  computed: {
    token() { return localStorage.getItem('userToken'); },
    authHeader() { return { headers: { 'Authorization': `Bearer ${this.token}` } }; },
    userInitials() {
      if (!this.userName) return 'US';
      return this.userName.substring(0, 2).toUpperCase();
    }
  },
  watch: { '$route': function() { this.fetchTasks(this.currentFilter); } },
  created() { 
    this.fetchTasks('all'); 
    this.fetchUserData(); 
  },
  methods: {
    async fetchUserData() {
      if (!this.token) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/auth/profile-data`, this.authHeader);
        this.userName = response.data.user.name;
      } catch (err) { console.error("Gagal ambil nama user", err); }
    },

    async fetchTasks(filterType) {
      if (!this.token) { this.$router.push('/login'); return; }
      this.isLoading = true;
      this.currentFilter = filterType; 
      try {
        const response = await axios.get(`${API_URL}/tasks?filter=${filterType}`, this.authHeader);
        this.tasks = response.data.tasks || [];
        this.updateStats(this.tasks);
      } catch (err) { if (err.response && err.response.status === 401) this.logout(); } 
      finally { this.isLoading = false; }
    },
    goToDetail(taskId) { this.$router.push(`/tasks/${taskId}`); },
    updateStats(tasks) {
      this.taskStats.total = tasks.length;
      this.taskStats.done = tasks.filter(t => t.status === 'Done').length;
      this.taskStats.progress = tasks.length - this.taskStats.done;
    },
    async quickDelete(taskId) {
        if(confirm("Hapus tugas ini?")) {
            try {
                await axios.delete(`${API_URL}/tasks/${taskId}`, this.authHeader);
                this.tasks = this.tasks.filter(t => t.id !== taskId);
                this.updateStats(this.tasks);
            } catch (err) { alert('Gagal hapus'); }
        }
    },
    async updateTaskStatus(taskId, currentStatus) {
        const newStatus = currentStatus === 'Done' ? 'To Do' : 'Done';
        try {
            await axios.patch(`${API_URL}/tasks/${taskId}/status`, { status: newStatus }, this.authHeader);
            const task = this.tasks.find(t => t.id === taskId);
            if (task) { task.status = newStatus; this.updateStats(this.tasks); }
        } catch (err) { alert('Gagal update status'); }
    },
    async createNewTask() {
        if(!this.newTask.title) return alert("Judul wajib!");
        if(!this.newTask.deadline) return alert("Deadline wajib!");
        try {
            await axios.post(`${API_URL}/tasks`, this.newTask, this.authHeader);
            this.showCreateModal = false;
            this.newTask = { title: '', description: '', category: '', deadline: '', status: 'To Do' };
            this.fetchTasks(this.currentFilter);
        } catch (err) { alert("Gagal buat tugas"); }
    },
    logout() { localStorage.removeItem('userToken'); this.$router.push('/login'); },
    getStatusClass(status) {
      if (status === 'Done') return 'badge-done';
      if (status === 'In Progress') return 'badge-progress';
      return 'badge-todo';
    },
    getDeadlineStatus(task) {
        if (task.status === 'Done') return 'safe';
        const deadline = new Date(task.deadline_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); deadline.setHours(0, 0, 0, 0);
        const diffTime = deadline - today; 
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays < 0) return 'overdue';
        if (diffDays >= 0 && diffDays <= 3) return 'urgent';
        return 'safe';
    },
    getDateColorClass(task) {
        const status = this.getDeadlineStatus(task);
        if (status === 'overdue') return 'text-danger';
        if (status === 'urgent') return 'text-warning';
        return '';
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric'});
    }
  }
};
</script>

<style scoped>
.app-container { min-height: 100vh; background-color: #03061A; color: white; padding: 24px 20px 100px 20px; font-family: 'Segoe UI', sans-serif; }
.header { display: flex; justify-content: space-between; margin-bottom: 24px; align-items: center; }
.page-title { font-size: 24px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px; }
.subtitle { font-size: 14px; color: #8C96A8; margin: 0; }
.avatar-circle { width: 44px; height: 44px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 700; color: white; border: 2px solid rgba(255,255,255,0.1); }

/* Filter & Header Refined */
.filter-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
.filter-btn { background: #121629; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.filter-group { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; }
.chip-btn { background: #121629; color: #8C96A8; border: 1px solid rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 12px; white-space: nowrap; transition: 0.2s; }
.chip-btn.active { background: #007bff; color: white; border-color: #007bff; }

/* Stats Card Refined */
.stats-grid { display: flex; gap: 12px; margin-bottom: 24px; }
.stat-card { flex: 1; background: #121629; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); }
.stat-label { font-size: 12px; color: #8C96A8; margin-bottom: 4px; }
.stat-value { font-size: 20px; font-weight: 700; }
.text-green { color: #2ECC71; } .text-blue { color: #007bff; }

/* Task List Refined */
.task-list { display: flex; flex-direction: column; gap: 16px; }
.task-card { background: #121629; border-radius: 16px; padding: 20px; display: flex; gap: 16px; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); transition: 0.2s; position: relative; }
.task-card:hover { border-color: #2A3042; transform: translateY(-2px); }
.checkbox-wrapper { padding-top: 4px; }
.custom-radio { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #565E75; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.custom-radio.checked { background: #2ECC71; border-color: #2ECC71; color: #03061A; }
.task-details { flex: 1; display: flex; flex-direction: column; }
.task-header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
.task-title { font-size: 16px; font-weight: 600; margin: 0; line-height: 1.4; }
.task-title.struck { text-decoration: line-through; color: #565E75; }
.delete-icon-btn { background: transparent; border: none; cursor: pointer; color: #8C96A8; padding: 0 0 0 10px; transition: 0.2s; }
.delete-icon-btn:hover { color: #e74c3c; }
.tag-container { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; flex-wrap: wrap; }
.category-pill { font-size: 10px; color: #8C96A8; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px; }
.pill { font-size: 10px; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
.pill-overdue { background: #e74c3c; } .pill-urgent { background: #e67e22; }

/* FIX CSS WARNING */
.task-desc { 
  font-size: 12px; 
  color: #8C96A8; 
  margin: 0 0 12px 0; 
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden; 
}

.task-meta { display: flex; justify-content: space-between; align-items: center; }
.task-date { font-size: 11px; color: #8C96A8; }
.status-badge { font-size: 10px; padding: 4px 10px; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.badge-progress { background: rgba(0, 123, 255, 0.15); color: #60a5fa; }
.badge-done { background: rgba(46, 204, 113, 0.15); color: #2ECC71; }
.badge-todo { background: rgba(71, 85, 105, 0.5); color: #cbd5e1; }
.fab { position: fixed; bottom: 90px; right: 20px; width: 56px; height: 56px; border-radius: 50%; background: #007bff; color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,123,255,0.4); transition: 0.2s; }
.fab:hover { transform: scale(1.05); }

/* Bottom Nav */
.bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 70px; background: rgba(18, 22, 41, 0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; color: #565E75; gap: 6px; cursor: pointer; transition: 0.3s; width: 60px; }
.nav-icon { width: 24px; height: 24px; stroke: #565E75; transition: 0.3s; }
.nav-label { font-size: 10px; font-weight: 500; }
.nav-item.active { color: #007bff; }
.nav-item.active .nav-icon { stroke: #007bff; filter: drop-shadow(0 0 5px rgba(0,123,255,0.4)); }

/* === NEW MODAL STYLE === */
.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0, 0, 0, 0.6); 
  backdrop-filter: blur(8px); /* Glassmorphism Effect */
  display: flex; justify-content: center; align-items: center; z-index: 200; 
  animation: fadeIn 0.2s ease-out;
}

.modal-content { 
  background: #1e293b; /* Darker clean background */
  padding: 24px; 
  border-radius: 20px; 
  width: 90%; max-width: 420px; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.animate-pop { animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

/* Header Modal */
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.modal-title { margin: 0; font-size: 20px; font-weight: 700; color: white; letter-spacing: -0.5px; }
.close-btn { background: none; border: none; font-size: 24px; color: #8C96A8; cursor: pointer; line-height: 1; padding: 0; }
.close-btn:hover { color: white; }

/* Forms */
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 8px; }
.form-row { display: flex; gap: 12px; }
.half { flex: 1; }

.input-field { 
  width: 100%; padding: 12px 16px; 
  border-radius: 12px; 
  background: #0f172a; /* Very Dark Blue */
  border: 1px solid #334155; 
  color: white; 
  box-sizing: border-box; 
  font-family: inherit; font-size: 14px;
  transition: all 0.2s;
}
.input-field:focus { 
  border-color: #3b82f6; 
  outline: none; 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); 
}
.input-field.area { height: 100px; resize: none; }

/* Select Arrow Customization */
.select-wrapper { position: relative; }
.select-wrapper::after {
    content: '▼'; font-size: 10px; color: #8C96A8;
    position: absolute; right: 16px; top: 50%; transform: translateY(-50%); pointer-events: none;
}
.select-field { appearance: none; cursor: pointer; }

/* Status Grid Selector */
.status-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.status-option {
    background: #0f172a; border: 1px solid #334155; color: #94a3b8;
    padding: 10px; border-radius: 10px; cursor: pointer;
    font-size: 12px; font-weight: 600; text-align: center;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.2s;
}
.status-option:hover { border-color: #475569; }
.status-option.active { border-color: #3b82f6; background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.dot-indicator { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Actions */
.modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
.btn-text { background: none; border: none; color: #94a3b8; font-weight: 600; cursor: pointer; padding: 12px 16px; }
.btn-text:hover { color: white; }
.btn-primary-full { 
    background: #3b82f6; color: white; border: none; 
    padding: 12px 24px; border-radius: 12px; 
    font-weight: 600; cursor: pointer; 
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: 0.2s;
}
.btn-primary-full:hover { background: #2563eb; transform: translateY(-1px); }

/* Animation Keyframes */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes popUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>