<template>
  <aside
    :class="[
      'fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out shadow-xl lg:shadow-none',
      isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      isCollapsed ? 'lg:w-20' : 'lg:w-64',
      'w-64',
    ]"
  >
    <!-- Header Sidebar / Logo -->
    <div
      :class="[
        'h-16 flex items-center border-b border-slate-800/80 relative transition-all duration-300',
        isCollapsed && !isMobileOpen ? 'justify-center px-0' : 'justify-between px-4',
      ]"
    >
      <!-- Logo & Title Wrapper -->
      <div class="flex items-center space-x-3 overflow-hidden">
        <div
          class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-500/30"
        >
          A
        </div>
        <span
          v-show="!isCollapsed || isMobileOpen"
          class="font-bold text-base text-white tracking-wide truncate transition-opacity duration-200"
        >
          Admin POS
        </span>
      </div>

      <!-- Tombol Toggle Floating di Garis Tepi Sidebar (Desktop Only) -->
      <button
        @click="$emit('toggleCollapse')"
        class="hidden lg:flex absolute -right-3 top-5 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white p-1 rounded-full shadow-md transition-transform duration-200 hover:scale-110 z-10"
        :title="isCollapsed ? 'Perbesar Sidebar' : 'Mengecilkan Sidebar'"
      >
        <svg
          class="w-4 h-4 transform transition-transform duration-300"
          :class="{ 'rotate-180': isCollapsed }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- Tombol Close (Mobile Only) -->
      <button
        @click="$emit('update:isMobileOpen', false)"
        class="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
      >
        ✕
      </button>
    </div>

    <!-- Menu Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        @click="$emit('update:isMobileOpen', false)"
        :class="[
          'flex items-center px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group',
          $route.path === item.path
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
            : 'hover:bg-slate-800/80 text-slate-400 hover:text-white',
          isCollapsed && !isMobileOpen ? 'justify-center' : '',
        ]"
        :title="isCollapsed ? item.name : ''"
      >
        <component :is="item.icon" class="w-5 h-5 shrink-0" />
        <span
          v-show="!isCollapsed || isMobileOpen"
          class="ml-3 truncate transition-opacity duration-200"
        >
          {{ item.name }}
        </span>
      </router-link>
    </nav>

    <!-- User Info & Logout (Bottom) -->
    <div class="p-3 border-t border-slate-800/80">
      <button
        @click="handleLogout"
        :class="[
          'w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition',
          isCollapsed && !isMobileOpen ? 'justify-center' : '',
        ]"
        :title="isCollapsed ? 'Keluar' : ''"
      >
        <ArrowRightOnRectangleIcon class="w-5 h-5 shrink-0" />
        <span v-show="!isCollapsed || isMobileOpen" class="ml-3 truncate">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  Squares2X2Icon,
  CubeIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

defineProps({
  isCollapsed: Boolean,
  isMobileOpen: Boolean,
})

defineEmits(['toggleCollapse', 'update:isMobileOpen'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Squares2X2Icon },
  { name: 'Produk', path: '/products', icon: CubeIcon },
  { name: 'Transaksi Penjualan', path: '/transactions', icon: DocumentTextIcon },
]

const handleLogout = () => {
  if (authStore.logout) {
    authStore.logout()
  } else {
    localStorage.removeItem('isAuthenticated')
  }
  router.push('/login')
}
</script>
