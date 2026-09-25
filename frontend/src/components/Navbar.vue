<template>
  <header
    class="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm"
  >
    <h2 class="text-lg font-semibold text-slate-700">Penjualan Management</h2>

    <div class="flex items-center space-x-4">
      <span class="text-sm text-slate-600">
        Halo, <strong class="text-slate-800">{{ authStore.user?.name || 'Admin' }}</strong>
      </span>
      <button
        @click="handleLogout"
        class="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md font-medium transition"
      >
        Logout
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}
</script>
