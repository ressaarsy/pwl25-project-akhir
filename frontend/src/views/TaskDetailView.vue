<template>
  <div class="detail-container">
    <div class="header-row">
      <button class="back-btn" @click="$router.go(-1)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Kembali
      </button>
      <div class="header-actions">
        <button class="icon-btn edit" @click="openEditModal"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
        <button class="icon-btn delete" @click="confirmDelete"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
      </div>
    </div>
    
    <h1 class="page-title">Detail Tugas</h1>
    <div v-if="isLoading" class="loading-container"><p>Memuat...</p></div>

    <div v-else class="content-wrapper">
      <div class="info-card main-card">
        <div class="tag-row"><span class="tag-category">{{ task.category || 'General' }}</span></div>
        <h2 class="task-title-detail">{{ task.title }}</h2>
        <div class="deadline-section">
          <div class="deadline-box">
            <div class="icon-box">📅</div>
            <div class="deadline-info"><span class="label">Deadline</span><span class="date-value">{{ formatDate(task.deadline) }}</span></div>
          </div>
          <div v-if="getDeadlineStatus(task) === 'overdue'" class="warning-alert overdue">⚠️ Tugas ini sudah melewati deadline</div>
          <div v-else-if="getDeadlineStatus(task) === 'urgent'" class="warning-alert urgent">🔥 Deadline segera berakhir!</div>
        </div>
      </div>

      <div class="info-card"><h3 class="section-title">Deskripsi</h3><p class="description-text">{{ task.description || 'Tidak ada deskripsi.' }}</p></div>

      <div class="info-card">
        <h3 class="section-title">Progress Status</h3>
        <div class="stepper-container">
          <div class="step-circle active">1</div>
          <div :class="['step-line', { active: task.status !== 'To Do' }]"></div>
          <div :class="['step-circle', { active: task.status === 'In Progress' || task.status === 'Done' }]">2</div>
          <div :class="['step-line', { active: task.status === 'Done' }]"></div>
          <div :class="['step-circle', { active: task.status === 'Done' }]">3</div>
        </div>
        <div class="stepper-labels"><span>To Do</span><span>Process</span><span>Done</span></div>
      </div>

      <div class="info-card action-card">
        <h3 class="section-title">Update Status</h3>
        <button v-if="task.status !== 'To Do'" @click="updateStatus('To Do')" class="btn-action btn-gray">Ubah ke To Do</button>
        <button v-if="task.status !== 'In Progress'" @click="updateStatus('In Progress')" class="btn-action btn-blue">Ubah ke Process</button>
        <div class="current-status-badge"><span v-if="task.status === 'Done'">✓</span> Status Saat Ini: <strong>{{ task.status }}</strong></div>
        <button v-if="task.status !== 'Done'" @click="updateStatus('Done')" class="btn-action btn-green">Ubah ke Done</button>
      </div>

      <div class="info-card">
        <h3 class="section-title">Catatan Progress</h3>
        <ul class="history-list">
            <li><span class="bullet gray"></span><div>Tugas dibuat pada <br><span class="history-date">{{ formatDate(task.created_at) }}</span></div></li>
            <li><span :class="['bullet', getStatusColor(task.status)]"></span><div>Status terakhir: <strong>{{ task.status }}</strong></div></li>
        </ul>
      </div>
    </div>

    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content animate-pop">
        <div class="modal-header">
            <h3 class="modal-title">Edit Tugas</h3>
            <button class="close-btn" @click="showEditModal = false">×</button>
        </div>

        <div class="form-group">
            <label>Judul</label>
            <input v-model="editForm.title" class="input-field" />
        </div>

        <div class="form-row">
            <div class="form-group half">
                <label>Kategori</label>
                <div class="select-wrapper">
                    <select v-model="editForm.category" class="input-field select-field">
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
                <input type="date" v-model="editForm.deadline" class="input-field date-field" />
            </div>
        </div>

        <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="editForm.description" class="input-field area"></textarea>
        </div>

        <div class="modal-actions">
            <button @click="showEditModal = false" class="btn-text">Batal</button>
            <button @click="saveEdit" class="btn-primary-full">Simpan Perubahan</button>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item" @click="$router.push('/')">
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
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

export default {
  name: 'TaskDetailView',
  data() {
    return {
      task: {},
      isLoading: true,
      showEditModal: false,
      editForm: { title: '', description: '', category: '', deadline: '' }
    };
  },
  created() { this.fetchTaskDetail(); },
  methods: {
    async fetchTaskDetail() {
      const taskId = this.$route.params.id;
      const token = localStorage.getItem('userToken');
      try {
        const response = await axios.get(`${API_URL}/tasks/${taskId}`, { headers: { Authorization: `Bearer ${token}` } });
        this.task = response.data;
      } catch (err) { alert("Gagal memuat tugas"); this.$router.push('/'); } finally { this.isLoading = false; }
    },
    async updateStatus(newStatus) {
      try {
        const token = localStorage.getItem('userToken');
        await axios.patch(`${API_URL}/tasks/${this.task.id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
        this.task.status = newStatus;
      } catch (err) { alert("Gagal update status"); }
    },
    async confirmDelete() {
      if(confirm("Hapus tugas ini?")) {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`${API_URL}/tasks/${this.task.id}`, { headers: { Authorization: `Bearer ${token}` } });
            this.$router.push('/'); 
        } catch (err) { alert("Gagal menghapus"); }
      }
    },
    openEditModal() {
        let formattedDate = '';
        if (this.task.deadline) formattedDate = new Date(this.task.deadline).toISOString().split('T')[0];
        this.editForm = { title: this.task.title, description: this.task.description, category: this.task.category, deadline: formattedDate };
        this.showEditModal = true;
    },
    async saveEdit() {
        try {
            const token = localStorage.getItem('userToken');
            await axios.put(`${API_URL}/tasks/${this.task.id}`, this.editForm, { headers: { Authorization: `Bearer ${token}` } });
            this.task.title = this.editForm.title;
            this.task.description = this.editForm.description;
            this.task.category = this.editForm.category;
            this.task.deadline = this.editForm.deadline;
            this.showEditModal = false;
        } catch (err) { alert("Gagal menyimpan"); }
    },
    getDeadlineStatus(task) {
        if (task.status === 'Done') return 'safe';
        const deadline = new Date(task.deadline);
        const today = new Date(); today.setHours(0, 0, 0, 0); deadline.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)); 
        if (diffDays < 0) return 'overdue';
        if (diffDays >= 0 && diffDays <= 3) return 'urgent';
        return 'safe';
    },
    getStatusColor(status) {
        if (status === 'Done') return 'green';
        if (status === 'In Progress') return 'blue';
        return 'gray';
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }
  }
};
</script>

<style scoped>
.detail-container { min-height: 100vh; background: #03061A; color: white; padding: 24px 20px 120px 20px; font-family: 'Segoe UI', sans-serif; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.back-btn { background: none; border: none; color: #8C96A8; cursor: pointer; font-size: 14px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
.back-btn:hover { color: white; }
.header-actions { display: flex; gap: 10px; }
.icon-btn { background: #121629; border: 1px solid rgba(255,255,255,0.05); color: #8C96A8; width: 36px; height: 36px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.icon-btn.edit:hover { background: #007bff; border-color: #007bff; color: white; }
.icon-btn.delete:hover { background: #e74c3c; border-color: #e74c3c; color: white; }
.page-title { font-size: 22px; font-weight: 600; margin: 0 0 20px 0; }
.info-card { background: #121629; border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05); }
.tag-category { font-size: 11px; color: #8C96A8; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
.task-title-detail { font-size: 20px; margin: 16px 0; font-weight: 700; line-height: 1.4; }
.deadline-section { display: flex; flex-direction: column; gap: 12px; }
.deadline-box { background: rgba(0,0,0,0.2); border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; }
.icon-box { width: 40px; height: 40px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 18px; }
.deadline-info { display: flex; flex-direction: column; }
.label { font-size: 11px; color: #8C96A8; }
.date-value { font-size: 14px; font-weight: bold; }
.warning-alert { padding: 12px; border-radius: 10px; font-size: 13px; font-weight: 600; display: flex; align-items: center; }
.warning-alert.overdue { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); }
.warning-alert.urgent { background: rgba(230, 126, 34, 0.1); color: #e67e22; border: 1px solid rgba(230, 126, 34, 0.2); }
.section-title { font-size: 14px; color: white; margin-bottom: 16px; font-weight: 600; }
.description-text { font-size: 14px; color: #8C96A8; line-height: 1.6; }
.stepper-container { display: flex; align-items: center; justify-content: space-between; margin: 20px 0 10px 0; position: relative; }
.step-circle { width: 32px; height: 32px; border-radius: 50%; background: #121629; color: #565E75; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 2; border: 2px solid #2A3042; font-size: 14px; }
.step-circle.active { background: #007bff; color: white; border-color: #007bff; box-shadow: 0 0 10px rgba(0,123,255,0.4); }
.step-line { flex: 1; height: 2px; background: #2A3042; margin: 0 5px; }
.step-line.active { background: #007bff; }
.stepper-labels { display: flex; justify-content: space-between; font-size: 11px; color: #565E75; font-weight: 500; }
.action-card { display: flex; flex-direction: column; gap: 12px; }
.btn-action { width: 100%; padding: 14px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; font-size: 14px; transition: 0.2s; }
.btn-gray { background: #2A3042; color: #8C96A8; } 
.btn-blue { background: #007bff; color: white; } 
.btn-green { background: #2ECC71; color: #003311; } 
.current-status-badge { background: rgba(255,255,255,0.03); color: #8C96A8; padding: 14px; border-radius: 10px; text-align: center; font-size: 13px; border: 1px dashed #565E75; }
.history-list { list-style: none; padding: 0; margin: 0; }
.history-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; font-size: 13px; color: #8C96A8; position: relative; }
.history-list li:not(:last-child)::after { content: ''; position: absolute; left: 5px; top: 20px; width: 2px; height: calc(100% - 4px); background: #2A3042; }
.history-date { display: block; margin-top: 4px; font-weight: 600; color: #ccc; }
.bullet { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; z-index: 2; }
.bullet.gray { background: #565E75; border: 2px solid #121629; }
.bullet.blue { background: #007bff; border: 2px solid #121629; box-shadow: 0 0 8px rgba(0,123,255,0.5); }
.bullet.green { background: #2ECC71; border: 2px solid #121629; box-shadow: 0 0 8px rgba(46, 204, 113, 0.5); }

/* STYLE NAVIGASI BARU */
.bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 70px; background: rgba(18, 22, 41, 0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; color: #565E75; gap: 6px; cursor: pointer; transition: 0.3s; width: 60px; }
.nav-icon { width: 24px; height: 24px; stroke: #565E75; transition: 0.3s; }
.nav-label { font-size: 10px; font-weight: 500; }
.nav-item.active { color: #007bff; }
.nav-item.active .nav-icon { stroke: #007bff; filter: drop-shadow(0 0 5px rgba(0,123,255,0.4)); }

/* === NEW MODAL STYLE (Sama persis dengan Dashboard) === */
.modal-overlay { 
  position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
  background: rgba(0, 0, 0, 0.6); 
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center; z-index: 200; 
  animation: fadeIn 0.2s ease-out;
}

.modal-content { 
  background: #1e293b;
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
  background: #0f172a; 
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