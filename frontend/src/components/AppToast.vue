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
        <span class="flex items-center">
          <component
            :is="
              toast.type === 'warning'
                ? ExclamationTriangleIcon
                : toast.type === 'danger'
                  ? XCircleIcon
                  : CheckCircleIcon
            "
            class="w-5 h-5 shrink-0"
            :class="{
              'text-amber-500': toast.type === 'warning',
              'text-red-500': toast.type === 'danger',
              'text-emerald-500': toast.type === 'green' || toast.type === 'success',
            }"
          />
        </span>
        <span class="flex-1">{{ toast.message }}</span>
        <button @click="toast.show = false" class="text-slate-400 hover:text-white transition ml-2">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useToastStore } from '@/stores/toastStore'
import {
  ExclamationTriangleIcon,
  XCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const toast = useToastStore()
</script>
