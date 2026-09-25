<template>
  <div class="min-h-screen bg-slate-100 flex text-slate-800 relative">
    <!-- 1. Backdrop Overlay (Khusus Mobile/Tablet) -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileOpen"
        @click="isMobileOpen = false"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
      ></div>
    </Transition>

    <!-- 2. Sidebar Navbar -->
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
            AdminPOS
          </span>
        </div>

        <!-- Tombol Toggle Floating di Garis Tepi Sidebar (Desktop Only) -->
        <button
          @click="isCollapsed = !isCollapsed"
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
          @click="isMobileOpen = false"
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
          @click="isMobileOpen = false"
          :class="[
            'flex items-center px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group',
            $route.path === item.path
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
              : 'hover:bg-slate-800/80 text-slate-400 hover:text-white',
            isCollapsed && !isMobileOpen ? 'justify-center' : '',
          ]"
          :title="isCollapsed ? item.name : ''"
        >
          <span class="text-xl shrink-0">{{ item.icon }}</span>
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
          <span class="text-xl shrink-0">🚪</span>
          <span v-show="!isCollapsed || isMobileOpen" class="ml-3 truncate">Keluar</span>
        </button>
      </div>
    </aside>

    <!-- 3. Main Content Container -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64',
      ]"
    >
      <!-- Top Navbar Header -->
      <header
        class="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs"
      >
        <div class="flex items-center space-x-3">
          <button
            @click="isMobileOpen = !isMobileOpen"
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

          <h2 class="text-base sm:text-lg font-bold text-slate-800 truncate">
            {{ currentRouteName }}
          </h2>
        </div>

        <div class="flex items-center space-x-3">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold text-slate-800">
              {{ authStore.user?.name || 'Administrator' }}
            </p>
            <p class="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Online</p>
          </div>
          <div
            class="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm"
          >
            👤
          </div>
        </div>
      </header>

      <!-- Main Body Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isMobileOpen = ref(false)
const isCollapsed = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Produk', path: '/products', icon: '📦' },
  { name: 'Transaksi', path: '/transactions', icon: '🧾' },
]

const currentRouteName = computed(() => {
  const current = menuItems.find((m) => m.path === route.path)
  return current ? current.name : 'Admin Panel'
})

const handleLogout = () => {
  if (authStore.logout) {
    authStore.logout()
  } else {
    localStorage.removeItem('isAuthenticated')
  }
  router.push('/login')
}
</script>
