<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <!-- Header / Logo -->
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-3 font-bold text-xl"
        >
          AP
        </div>
        <h1 class="text-2xl font-bold text-slate-800">Admin Panel</h1>
        <p class="text-sm text-slate-500 mt-1">Masuk ke sistem manajemen penjualan</p>
      </div>

      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1"
            >Username / Email</label
          >
          <input
            v-model="username"
            type="text"
            required
            placeholder="Ketik username bebas..."
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
          />
        </div>

        <button
          type="submit"
          class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 shadow-md text-sm"
        >
          Masuk ke Dashboard
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const username = ref('')
const password = ref('')

const router = useRouter()
const authStore = useAuthStore()

const handleLogin = () => {
  const success = authStore.login(username.value, password.value)
  if (success) {
    router.push('/dashboard')
  }
}
</script>
