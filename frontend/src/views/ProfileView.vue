<template>
  <div class="profile-container">
    <div class="header">
      <h1 class="page-title">Profile</h1>
    </div>

    <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Memuat data...</p>
    </div>

    <div v-else>
      <div class="profile-card">
        
        <div class="user-row">
            <div class="user-left">
                <div class="avatar-circle">
                  {{ getInitials(user.name) }}
                </div>
                <div class="user-text">
                  <h2 class="user-name">{{ user.name }}</h2>
                  <p class="user-email">{{ user.email }}</p>
                </div>
            </div>

            <button class="logout-icon-btn" @click="logout" title="Keluar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
        </div>

        <div class="spacer"></div>

        <div class="stats-group">
            <div class="stat-row">
                <span class="stat-label">Total Tugas</span>
                <span class="stat-value">{{ stats.total }}</span>
            </div>
            <div class="divider"></div>

            <div class="stat-row">
                <span class="stat-label">Tugas Selesai</span>
                <span class="stat-value">{{ stats.completed }}</span>
            </div>
            <div class="divider"></div>

            <div class="stat-row">
                <span class="stat-label">Produktivitas</span>
                <span class="stat-value">{{ stats.productivity }}%</span>
            </div>
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
      <div class="nav-item active">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span class="nav-label">Profile</span>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/auth'; 

export default {
  name: 'ProfileView',
  data() {
    return {
      isLoading: true,
      user: { name: '', email: '' },
      stats: { total: 0, completed: 0, productivity: 0 }
    };
  },
  created() {
    this.fetchProfileData();
  },
  methods: {
    async fetchProfileData() {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) { this.$router.push('/login'); return; }
        const response = await axios.get(`${API_URL}/profile-data`, { headers: { Authorization: `Bearer ${token}` } });
        this.user = response.data.user;
        this.stats = response.data.stats;
      } catch (err) {
        if (err.response && err.response.status === 401) { this.logout(); }
      } finally {
        this.isLoading = false;
      }
    },
    getInitials(name) {
      if (!name) return 'US';
      return name.substring(0, 2).toUpperCase();
    },
    logout() {
      if(confirm("Apakah Anda yakin ingin keluar?")) {
          localStorage.removeItem('userToken');
          this.$router.push('/login');
      }
    }
  }
};
</script>

<style scoped>
.profile-container { min-height: 100vh; background-color: #03061A; color: white; padding: 24px 20px 100px 20px; font-family: 'Segoe UI', sans-serif; }
.header { margin-bottom: 30px; }
.page-title { font-size: 24px; font-weight: 700; margin: 0; }
.loading-container { text-align: center; color: #8C96A8; margin-top: 100px; }
.spinner { width: 30px; height: 30px; border: 3px solid #111927; border-top: 3px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

/* Profile Card Refined */
.profile-card { background-color: #121629; border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); }
.user-row { display: flex; justify-content: space-between; align-items: center; }
.user-left { display: flex; align-items: center; gap: 16px; }
.avatar-circle { width: 56px; height: 56px; background: linear-gradient(135deg, #007bff, #0056b3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: white; box-shadow: 0 4px 15px rgba(0,123,255,0.3); }
.user-text { display: flex; flex-direction: column; }
.user-name { font-size: 16px; font-weight: 600; color: white; margin: 0; }
.user-email { font-size: 12px; color: #8C96A8; margin: 4px 0 0 0; }
.logout-icon-btn { background: rgba(255,255,255,0.05); border: none; color: #ff4757; cursor: pointer; transition: 0.2s; padding: 8px; border-radius: 8px; display: flex; align-items: center; }
.logout-icon-btn:hover { background: rgba(255, 71, 87, 0.1); }
.spacer { height: 30px; }
.stats-group { display: flex; flex-direction: column; }
.stat-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
.stat-label { font-size: 14px; color: #8C96A8; font-weight: 400; }
.stat-value { font-size: 16px; font-weight: 600; color: white; }
.divider { height: 1px; background-color: rgba(255,255,255,0.05); width: 100%; }

/* STYLE NAVIGASI BARU */
.bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 70px; background: rgba(18, 22, 41, 0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; color: #565E75; gap: 6px; cursor: pointer; transition: 0.3s; width: 60px; }
.nav-icon { width: 24px; height: 24px; stroke: #565E75; transition: 0.3s; }
.nav-label { font-size: 10px; font-weight: 500; }
.nav-item.active { color: #007bff; }
.nav-item.active .nav-icon { stroke: #007bff; filter: drop-shadow(0 0 5px rgba(0,123,255,0.4)); }
</style>