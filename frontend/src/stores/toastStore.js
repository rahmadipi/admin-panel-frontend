import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const show = ref(false)
  const message = ref('')
  const type = ref('success') // 'success' | 'warning' | 'danger'
  let timer = null

  const triggerToast = (msg, toastType = 'success', duration = 3500) => {
    if (timer) clearTimeout(timer)
    message.value = msg
    type.value = toastType
    show.value = true

    timer = setTimeout(() => {
      show.value = false
    }, duration)
  }

  const success = (msg) => triggerToast(msg, 'success')
  const warning = (msg) => triggerToast(msg, 'warning')
  const danger = (msg) => triggerToast(msg, 'danger')

  return {
    show,
    message,
    type,
    success,
    warning,
    danger,
  }
})
