<template>
  <div class="perf-container">
    <div class="header">
      <h1 class="page-title">Performa Mingguan</h1>
      <p class="subtitle">Analisis produktivitas minggu ini</p>
    </div>

    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-header"><div class="icon-circle green"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><span class="card-label">Selesai</span></div>
        <div class="card-value">{{ stats.summary.completed_total }}</div>
      </div>
      <div class="summary-card">
        <div class="card-header"><div class="icon-circle orange">!</div><span class="card-label">Terlambat</span></div>
        <div class="card-value">{{ stats.summary.overdue_total }}</div>
      </div>
      <div class="summary-card">
        <div class="card-header"><div class="icon-circle blue">%</div><span class="card-label">Progress</span></div>
        <div class="card-value">{{ stats.summary.progress_percentage }}%</div>
      </div>
    </div>

    <div class="chart-section">
      <h3 class="section-title">Grafik Tugas Mingguan</h3>
      <div class="chart-wrapper">
        <Bar v-if="loaded" :data="chartData" :options="chartOptions" />
      </div>
      <div class="legend">
        <div class="legend-item"><span class="dot green"></span> Selesai</div>
        <div class="legend-item"><span class="dot blue"></span> In Progress</div>
      </div>
    </div>

    <div class="insight-card">
      <h3 class="section-title-insight">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        Insight Mingguan
      </h3>
      <div class="insight-item">
        <span class="bullet green">●</span>
        <div class="insight-text">
          <strong>Produktivitas {{ productivityStatus }}</strong>
          <p>Anda menyelesaikan {{ stats.summary.progress_percentage }}% tugas minggu ini.</p>
        </div>
      </div>
      <div class="insight-item" v-if="stats.summary.overdue_total > 0">
        <span class="bullet orange">●</span>
        <div class="insight-text">
          <strong>Perhatian Diperlukan</strong>
          <p>Ada {{ stats.summary.overdue_total }} tugas yang melewati deadline.</p>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
      <div class="nav-item" @click="$router.push('/')">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        <span class="nav-label">Home</span>
      </div>
      <div class="nav-item active">
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
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
const API_URL = 'http://localhost:3000/api';

export default {
  name: 'PerformanceView',
  components: { Bar },
  data() {
    return {
      loaded: false,
      stats: { summary: { completed_total: 0, overdue_total: 0, progress_percentage: 0 }, chart: { done: [], progress: [] } },
      chartData: null,
      chartOptions: {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8C96A8' } }, x: { grid: { display: false }, ticks: { color: '#8C96A8' } } }
      }
    };
  },
  computed: {
    productivityStatus() {
        if (this.stats.summary.progress_percentage >= 75) return 'Sangat Baik';
        if (this.stats.summary.progress_percentage >= 50) return 'Baik';
        return 'Perlu Ditingkatkan';
    }
  },
  async created() { await this.fetchStats(); },
  methods: {
    async fetchStats() {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/tasks/stats`, { headers: { Authorization: `Bearer ${token}` } });
        this.stats = response.data;
        this.chartData = {
          labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
          datasets: [
            { label: 'Selesai', backgroundColor: '#2ECC71', data: this.stats.chart.done, borderRadius: 4, barThickness: 12 },
            { label: 'In Progress', backgroundColor: '#007bff', data: this.stats.chart.progress, borderRadius: 4, barThickness: 12 }
          ]
        };
        this.loaded = true;
      } catch (err) { console.error("Gagal memuat statistik", err); }
    }
  }
};
</script>

<style scoped>
.perf-container { min-height: 100vh; background-color: #03061A; color: white; padding: 24px 20px 100px 20px; font-family: 'Segoe UI', sans-serif; }
.header { margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px; }
.subtitle { font-size: 14px; color: #8C96A8; margin: 0; }
.summary-grid { display: flex; gap: 12px; margin-bottom: 24px; }
.summary-card { flex: 1; background: #121629; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; height: 100px; border: 1px solid rgba(255,255,255,0.05); }
.card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.icon-circle { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }
.icon-circle.green { background: rgba(46, 204, 113, 0.1); color: #2ECC71; }
.icon-circle.orange { background: rgba(230, 126, 34, 0.1); color: #E67E22; }
.icon-circle.blue { background: rgba(0, 123, 255, 0.1); color: #007bff; }
.card-label { font-size: 12px; color: #8C96A8; }
.card-value { font-size: 28px; font-weight: 700; line-height: 1; letter-spacing: -1px; }
.chart-section { background: #121629; border-radius: 16px; padding: 20px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05); }
.section-title { font-size: 16px; margin: 0 0 20px 0; font-weight: 600; }
.chart-wrapper { height: 180px; }
.legend { display: flex; justify-content: center; gap: 20px; margin-top: 15px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8C96A8; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.green { background: #2ECC71; }
.dot.blue { background: #007bff; }
.insight-card { background: #121629; border-radius: 16px; padding: 20px; border: 1px solid rgba(255,255,255,0.05); }
.section-title-insight { font-size: 16px; margin: 0 0 16px 0; font-weight: 600; display: flex; align-items: center; gap: 8px; color: #fff; }
.insight-item { display: flex; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
.insight-text { font-size: 13px; color: #8C96A8; line-height: 1.5; }
.insight-text strong { color: #e2e8f0; display: block; margin-bottom: 2px; }
.bullet { font-size: 16px; line-height: 1; margin-top: 2px; }
.bullet.green { color: #2ECC71; }
.bullet.orange { color: #E67E22; }

/* STYLE NAVIGASI BARU */
.bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; height: 70px; background: rgba(18, 22, 41, 0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-around; align-items: center; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
.nav-item { display: flex; flex-direction: column; align-items: center; color: #565E75; gap: 6px; cursor: pointer; transition: 0.3s; width: 60px; }
.nav-icon { width: 24px; height: 24px; stroke: #565E75; transition: 0.3s; }
.nav-label { font-size: 10px; font-weight: 500; }
.nav-item.active { color: #007bff; }
.nav-item.active .nav-icon { stroke: #007bff; filter: drop-shadow(0 0 5px rgba(0,123,255,0.4)); }
</style>