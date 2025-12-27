<template>
  <div class="detail-container">
    <div class="header-row">
      <button class="back-btn" @click="$router.go(-1)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Kembali
      </button>
    </div>
    
    <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Memuat data...</p>
    </div>

    <div v-else class="content-wrapper">
      <div class="info-card main-card">
        <div class="top-meta">
            <span class="tag-category">{{ task.category || 'General' }}</span>
            <span :class="['status-pill', getStatusClass(task.status)]">{{ task.status }}</span>
        </div>
        <h2 class="task-title-detail">{{ task.title }}</h2>
        <p class="description-text">{{ task.description || 'Tidak ada deskripsi.' }}</p>
      </div>

      <div class="info-card highlight-card">
        <div class="progress-header">
            <span class="section-title mb-0">Kelengkapan Tugas</span>
            <span class="percent-text">{{ progressPercentage }}%</span>
        </div>
        
        <div class="progress-track">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>

        <div class="stats-row">
            <div class="stat-item">
                <span class="stat-label">Langkah Selesai</span>
                <span class="stat-val">{{ completedCount }} / {{ subtasks.length }}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Total Estimasi</span>
                <span class="stat-val">{{ totalMinutes }} Menit</span>
            </div>
        </div>
      </div>

      <div class="info-card">
        <h3 class="section-title">Rincian Langkah (Subtasks)</h3>
        
        <div v-if="subtasks.length > 0" class="subtask-list">
            <div 
                v-for="sub in subtasks" 
                :key="sub.id" 
                :class="['subtask-item', { 'is-done': sub.is_completed }]"
                @click="toggleSubtask(sub)"
            >
                <div class="checkbox-area">
                    <div :class="['custom-checkbox', { 'checked': sub.is_completed }]">
                        <span v-if="sub.is_completed">✓</span>
                    </div>
                </div>
                
                <div class="sub-info">
                    <span class="sub-title">{{ sub.title }}</span>
                    <div class="sub-meta">
                        <span v-if="sub.estimated_minutes" class="meta-tag">⏱ {{ sub.estimated_minutes }} mnt</span>
                        <span v-if="sub.target_date" class="meta-tag">📅 {{ formatDateSimple(sub.target_date) }}</span>
                    </div>
                </div>

                <button @click.stop="deleteSubtask(sub.id)" class="sub-delete" title="Hapus Langkah">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        </div>
        <p v-else class="empty-sub">Belum ada langkah kecil. Tambahkan di bawah ini.</p>

        <div class="add-subtask-box">
            <input v-model="newSubtask.title" placeholder="Ketik langkah baru..." class="input-sub main" @keyup.enter="addSubtask" />
            <div class="sub-extras">
                <div class="input-group">
                    <span class="input-icon">⏱</span>
                    <input v-model="newSubtask.minutes" type="number" placeholder="Menit" class="input-sub mini" />
                </div>
                <div class="input-group">
                    <span class="input-icon">📅</span>
                    <input v-model="newSubtask.date" type="date" class="input-sub mini" />
                </div>
                <button @click="addSubtask" class="btn-add-sub">Tambah</button>
            </div>
        </div>
      </div>

      <div class="info-card action-card">
        <h3 class="section-title">Kontrol Status Manual</h3>
        <div class="btn-group">
            <button v-if="task.status !== 'To Do'" @click="updateStatus('To Do')" class="btn-action btn-gray">Kembalikan ke To Do</button>
            <button v-if="task.status !== 'In Progress'" @click="updateStatus('In Progress')" class="btn-action btn-blue">Tandai Process</button>
            <button v-if="task.status !== 'Done'" @click="updateStatus('Done')" class="btn-action btn-green">Tandai Selesai</button>
        </div>
      </div>
    </div>
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
      subtasks: [],
      newSubtask: { title: '', minutes: '', date: '' },
      isLoading: true
    };
  },
  // --- LOGIKA CERDAS (Progress Bar & Total Waktu) ---
  computed: {
    progressPercentage() {
        if (this.subtasks.length === 0) return 0;
        const completed = this.subtasks.filter(s => s.is_completed).length;
        return Math.round((completed / this.subtasks.length) * 100);
    },
    totalMinutes() {
        return this.subtasks.reduce((total, sub) => total + (parseInt(sub.estimated_minutes) || 0), 0);
    },
    completedCount() {
        return this.subtasks.filter(s => s.is_completed).length;
    }
  },
  created() { 
      this.fetchTaskDetail(); 
      this.fetchSubtasks(); 
  },
  methods: {
    getToken() { return localStorage.getItem('userToken'); },
    
    async fetchTaskDetail() {
      try {
        const response = await axios.get(`${API_URL}/tasks/${this.$route.params.id}`, { 
            headers: { Authorization: `Bearer ${this.getToken()}` } 
        });
        this.task = response.data;
      } catch (err) { this.$router.push('/'); } finally { this.isLoading = false; }
    },

    async fetchSubtasks() {
        try {
            const taskId = this.$route.params.id;
            const res = await axios.get(`${API_URL}/subtasks/${taskId}`, {
                headers: { Authorization: `Bearer ${this.getToken()}` }
            });
            this.subtasks = res.data;
        } catch (err) { console.error("Gagal ambil subtask"); }
    },

    async addSubtask() {
        if (!this.newSubtask.title) return alert("Judul langkah wajib diisi!");
        try {
            await axios.post(`${API_URL}/subtasks`, {
                task_id: this.task.id,
                title: this.newSubtask.title,
                estimated_minutes: this.newSubtask.minutes,
                target_date: this.newSubtask.date
            }, { headers: { Authorization: `Bearer ${this.getToken()}` } });
            
            this.newSubtask = { title: '', minutes: '', date: '' };
            this.fetchSubtasks(); 
            
            // Auto Update Status ke "In Progress" jika baru mulai
            if (this.task.status === 'To Do') this.updateStatus('In Progress');

        } catch (err) { alert("Gagal tambah subtask"); }
    },

    async toggleSubtask(sub) {
        // Optimistic Update (Update UI dulu biar cepat rasanya)
        const oldState = sub.is_completed;
        sub.is_completed = !oldState; // Ubah nilai lokal (0 jadi 1, atau 1 jadi 0)
        
        try {
            await axios.patch(`${API_URL}/subtasks/${sub.id}`, { 
                is_completed: sub.is_completed 
            }, { headers: { Authorization: `Bearer ${this.getToken()}` } });
            
            // Cek Otomatisasi Status
            this.checkAutoStatus(); 

        } catch (err) { 
            sub.is_completed = oldState; // Kembalikan jika error
            alert("Gagal update koneksi buruk"); 
        }
    },

    // Logika Otomatis Status Parent
    checkAutoStatus() {
        const total = this.subtasks.length;
        const done = this.subtasks.filter(s => s.is_completed).length; // Hitung ulang dari data lokal

        if (total > 0 && total === done && this.task.status !== 'Done') {
            // Jika semua checklist selesai -> Auto Done
            this.updateStatus('Done');
            alert("🎉 Selamat! Semua langkah selesai. Tugas ditandai Selesai.");
        } else if (done < total && this.task.status === 'Done') {
            // Jika ada yang di-uncheck -> Balik ke In Progress
            this.updateStatus('In Progress');
        }
    },

    async deleteSubtask(id) {
        if(confirm("Hapus langkah ini?")) {
            try {
                await axios.delete(`${API_URL}/subtasks/${id}`, { 
                    headers: { Authorization: `Bearer ${this.getToken()}` } 
                });
                this.subtasks = this.subtasks.filter(s => s.id !== id);
                this.checkAutoStatus(); // Cek status lagi setelah hapus
            } catch(err) { alert("Gagal hapus"); }
        }
    },

    async updateStatus(newStatus) {
      try {
        await axios.patch(`${API_URL}/tasks/${this.task.id}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${this.getToken()}` } });
        this.task.status = newStatus;
      } catch (err) { console.error(err); }
    },
    
    formatDateSimple(dateStr) {
        if(!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
    },

    getStatusClass(status) {
        if (status === 'Done') return 'pill-green';
        if (status === 'In Progress') return 'pill-blue';
        return 'pill-gray';
    }
  }
};
</script>

<style scoped>
.detail-container { min-height: 100vh; background: #03061A; color: white; padding: 24px 20px 120px 20px; font-family: 'Segoe UI', sans-serif; }
.header-row { margin-bottom: 20px; }
.back-btn { background: none; border: none; color: #8C96A8; cursor: pointer; display: flex; align-items: center; gap: 6px; font-weight: 500; transition: 0.2s; }
.back-btn:hover { color: white; }

/* Cards Styling */
.info-card { background: #121629; border-radius: 16px; padding: 20px; margin-bottom: 16px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.highlight-card { background: linear-gradient(145deg, #121629 0%, #1a2035 100%); border: 1px solid rgba(59, 130, 246, 0.2); }

/* Header Info */
.top-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.tag-category { font-size: 11px; background: rgba(255,255,255,0.08); padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
.status-pill { font-size: 11px; padding: 4px 10px; border-radius: 20px; font-weight: 700; text-transform: uppercase; }
.pill-green { background: rgba(46, 204, 113, 0.15); color: #2ECC71; }
.pill-blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
.pill-gray { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.task-title-detail { font-size: 22px; margin: 0 0 10px 0; font-weight: 700; line-height: 1.3; }
.description-text { color: #8C96A8; font-size: 14px; line-height: 1.6; }

/* Progress Section */
.progress-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; }
.section-title { font-size: 14px; font-weight: 600; color: #cbd5e1; margin-bottom: 0; }
.percent-text { font-size: 24px; font-weight: 800; color: #3b82f6; line-height: 1; }
.progress-track { height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden; margin-bottom: 16px; }
.progress-fill { height: 100%; background: #3b82f6; border-radius: 4px; transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
.stats-row { display: flex; gap: 20px; }
.stat-item { display: flex; flex-direction: column; }
.stat-label { font-size: 10px; color: #8C96A8; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-val { font-size: 14px; font-weight: 600; color: white; margin-top: 2px; }

/* --- FIXED SUBTASK LIST STYLE --- */
.subtask-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.subtask-item { 
    display: flex; align-items: center; gap: 12px; 
    background: rgba(255,255,255,0.05); /* Latar lebih terang */
    padding: 16px; border-radius: 12px; 
    border: 1px solid rgba(255,255,255,0.1); 
    transition: 0.2s; cursor: pointer; /* Pointer Hand */
}
.subtask-item:hover { background: rgba(255,255,255,0.1); border-color: #3b82f6; }

/* Custom Checkbox Style */
.checkbox-area { display: flex; align-items: center; }
.custom-checkbox {
    width: 24px; height: 24px; border-radius: 6px;
    border: 2px solid #565E75; background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: white; font-weight: bold; font-size: 14px; transition: 0.2s;
}
.custom-checkbox.checked {
    background: #3b82f6; border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}
/* Style saat Selesai */
.subtask-item.is-done { opacity: 0.6; }
.subtask-item.is-done .sub-title { text-decoration: line-through; color: #94a3b8; }

.sub-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.sub-title { font-size: 16px; font-weight: 500; }
.sub-meta { display: flex; gap: 8px; }
.meta-tag { font-size: 11px; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 4px; color: #cbd5e1; }

.sub-delete { 
    background: rgba(239, 68, 68, 0.1); border: none; 
    color: #ef4444; cursor: pointer; padding: 8px; border-radius: 6px; transition: 0.2s; 
}
.sub-delete:hover { background: #ef4444; color: white; }

/* Add Form */
.add-subtask-box { display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; }
.input-sub { background: #0f172a; border: 1px solid #334155; color: white; padding: 10px; border-radius: 8px; font-size: 13px; outline: none; transition: 0.2s; }
.input-sub:focus { border-color: #3b82f6; }
.sub-extras { display: flex; gap: 8px; }
.input-group { position: relative; flex: 1; }
.input-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); font-size: 12px; pointer-events: none; }
.input-sub.mini { width: 100%; padding-left: 30px; box-sizing: border-box; }
.btn-add-sub { background: #3b82f6; color: white; border: none; border-radius: 8px; padding: 0 16px; font-weight: 600; cursor: pointer; transition: 0.2s; font-size: 13px; }
.btn-add-sub:hover { background: #2563eb; }

/* Buttons Action */
.btn-group { display: flex; gap: 10px; margin-top: 8px; }
.btn-action { flex: 1; padding: 12px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; font-size: 13px; transition: 0.2s; }
.btn-gray { background: #334155; color: #cbd5e1; } .btn-gray:hover { background: #475569; }
.btn-blue { background: #3b82f6; color: white; } .btn-blue:hover { background: #2563eb; }
.btn-green { background: #22c55e; color: #0f172a; } .btn-green:hover { background: #16a34a; }

.empty-sub { color: #64748b; font-size: 13px; text-align: center; margin: 20px 0; font-style: italic; }
.loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; color: #94a3b8; gap: 10px; }
.spinner { width: 30px; height: 30px; border: 3px solid #1e293b; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>