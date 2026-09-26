<template>
  <header
    class="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs"
  >
    <div class="flex items-center space-x-3">
      <!-- Tombol Trigger Mobile Menu -->
      <button
        @click="$emit('toggleMobile')"
        class="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
        aria-label="Open Menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <!-- Judul Halaman Aktif -->
      <h2 class="text-base sm:text-lg font-bold text-slate-800 truncate">
        {{ currentRouteName }}
      </h2>
    </div>

    <!-- Profil Pengguna Sisi Kanan -->
    <div class="flex items-center space-x-3">
      <div class="text-right hidden sm:block">
        <p class="text-xs font-bold text-slate-800">
          {{ authStore.user?.name || 'Administrator' }}
        </p>
        <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Online</p>
      </div>
      <div
        class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600"
      >
        <UserCircleIcon class="w-6 h-6" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { UserCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const authStore = useAuthStore()

const menuItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Produk', path: '/products' },
  { name: 'Transaksi Penjualan', path: '/transactions' },
]

const currentRouteName = computed(() => {
  const current = menuItems.find((m) => m.path === route.path)
  return current ? current.name : 'Admin Panel'
})

defineEmits(['toggleMobile'])
</script>
