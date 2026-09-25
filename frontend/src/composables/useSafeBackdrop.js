import { ref } from 'vue'

export function useSafeBackdrop(closeCallback) {
  const isMouseDownOnBackdrop = ref(false)

  const onMouseDown = (e) => {
    // Tandai true HANYA jika mousedown benar-benar dimulai dari backdrop luar
    isMouseDownOnBackdrop.value = e.target === e.currentTarget
  }

  const onClick = (e) => {
    // Modal hanya ditutup jika mousedown DAN mouseup keduanya terjadi di backdrop
    if (isMouseDownOnBackdrop.value && e.target === e.currentTarget) {
      closeCallback()
    }
    isMouseDownOnBackdrop.value = false
  }

  return {
    onMouseDown,
    onClick,
  }
}
