<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Selamat Datang</h2>
      <p class="subtitle">Silakan login untuk melanjutkan</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Masukkan email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Masukkan password" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Memuat...' : 'Masuk' }}
        </button>
      </form>

      <p class="footer-text">
        Belum punya akun? <router-link to="/register">Daftar sekarang</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const API_URL = 'http://localhost:3000/api/auth';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email: this.email,
          password: this.password
        });
        
        // Simpan token ke localStorage
        const token = response.data.token;
        localStorage.setItem('userToken', token);
        
        // Pindah ke Dashboard
        this.$router.push('/');
      } catch (err) {
        alert(err.response?.data?.message || "Email atau password salah");
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Style sama dengan Register */
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #03061A; color: white; font-family: 'Segoe UI', sans-serif; }
.auth-box { background: #121629; padding: 40px; border-radius: 16px; width: 100%; max-width: 400px; border: 1px solid #1c233a; }
h2 { text-align: center; margin-bottom: 8px; }
.subtitle { text-align: center; color: #8C96A8; margin-bottom: 24px; font-size: 14px; }
.form-group { margin-bottom: 16px; }
label { display: block; margin-bottom: 8px; font-size: 13px; color: #8C96A8; }
input { width: 100%; padding: 12px; background: #03061A; border: 1px solid #2A3042; border-radius: 8px; color: white; box-sizing: border-box; }
input:focus { border-color: #007bff; outline: none; }
.btn-primary { width: 100%; padding: 14px; background: #007bff; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 10px; }
.btn-primary:disabled { background: #2A3042; cursor: not-allowed; }
.footer-text { text-align: center; margin-top: 20px; font-size: 13px; color: #8C96A8; }
.footer-text a { color: #007bff; text-decoration: none; }
</style>