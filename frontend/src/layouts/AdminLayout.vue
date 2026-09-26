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

    <!-- 2. Sidebar Component -->
    <Sidebar
      :isCollapsed="isCollapsed"
      :isMobileOpen="isMobileOpen"
      @update:isMobileOpen="isMobileOpen = $event"
      @toggleCollapse="isCollapsed = !isCollapsed"
    />

    <!-- 3. Main Content Container -->
    <div
      :class="[
        'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64',
      ]"
    >
      <!-- Top Navbar Component -->
      <Navbar
        :isCollapsed="isCollapsed"
        @toggleCollapse="isCollapsed = !isCollapsed"
        @toggleMobile="isMobileOpen = !isMobileOpen"
      />

      <!-- Main Body Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'

const isMobileOpen = ref(false)
const isCollapsed = ref(false)
</script>
