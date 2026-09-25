<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-[-20px] scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-[-20px] scale-95"
    >
      <div
        v-if="toast.show"
        :class="[
          'fixed top-5 right-5 z-[100] flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-medium max-w-sm',
          toast.type === 'warning' ? 'bg-slate-900 border-amber-500/40 text-white' : '',
          toast.type === 'success' ? 'bg-slate-900 border-emerald-500/40 text-white' : '',
          toast.type === 'danger' ? 'bg-slate-900 border-rose-500/40 text-white' : '',
        ]"
      >
        <span class="text-base leading-none">
          {{ toast.type === 'warning' ? '⚠️' : toast.type === 'danger' ? '🚨' : '✅' }}
        </span>
        <span class="flex-1">{{ toast.message }}</span>
        <button @click="toast.show = false" class="text-slate-400 hover:text-white transition ml-2">
          ✕
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'
const toast = useToastStore()
</script>
