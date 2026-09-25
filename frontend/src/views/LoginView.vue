<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div
      class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-slate-200/80"
    >
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-slate-800">Selamat Datang Kembali</h1>
        <p class="text-xs text-slate-500">Masukan akun admin Anda untuk mengakses sistem</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Username / Email</label>
          <input
            v-model="username"
            type="text"
            required
            placeholder="admin"
            class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-500/20 active:scale-95"
        >
          Masuk ke Dashboard
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToastStore } from '@/stores/toastStore'

const router = useRouter()
const route = useRoute()
const toast = useToastStore()

const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin123') {
    // 1. Simpan status autentikasi di localStorage
    localStorage.setItem('isAuthenticated', 'true')

    // 2. Tampilkan Toast Sukses
    toast.success('Login berhasil! Mengalihkan...')

    // 3. Tentukan rute tujuan (default ke /dashboard jika tidak ada redirect query)
    const targetPath = route.query.redirect || '/dashboard'

    // 4. Redirect aman
    setTimeout(() => {
      router.push(targetPath)
    }, 500)
  } else {
    toast.danger('Username atau password yang Anda masukkan salah!')
  }
}
</script>
