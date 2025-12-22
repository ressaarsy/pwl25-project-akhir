<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Daftar Akun</h2>
      <p class="subtitle">Mulai kelola tugasmu sekarang</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nama Lengkap</label>
          <input type="text" v-model="form.nama" placeholder="Contoh: Ressa Arsy" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" placeholder="email@contoh.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" placeholder="Minimal 6 karakter" required />
        </div>

        <div class="form-group">
          <label>Konfirmasi Password</label>
          <input type="password" v-model="form.confirmPassword" placeholder="Ulangi password" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Memproses...' : 'Daftar Sekarang' }}
        </button>
      </form>

      <p class="footer-text">
        Sudah punya akun? <router-link to="/login">Login di sini</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
// Pastikan URL ini benar sesuai backend kamu
const API_URL = 'http://localhost:3000/api/auth';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        // PENTING: Gunakan 'nama', JANGAN 'username'
        nama: '',  
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false
    };
  },
  methods: {
    async handleRegister() {
      if (this.form.password !== this.form.confirmPassword) {
        alert("Konfirmasi password tidak cocok!");
        return;
      }

      this.isLoading = true;
      try {
        console.log("Mengirim data:", this.form); // Cek di Console Browser

        // PENTING: Kirim object dengan key 'nama' agar dibaca oleh backend
        await axios.post(`${API_URL}/register`, {
          nama: this.form.nama, 
          email: this.form.email,
          password: this.form.password
        });
        
        alert("Registrasi Berhasil! Silakan Login.");
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Gagal mendaftar");
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Style sama dengan LoginView */
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