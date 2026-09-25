import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  const login = (username, password) => {
    // Mock login sederhana
    if (username && password) {
      isAuthenticated.value = true
      user.value = { name: 'Admin User', role: 'Super Admin' }
      return true
    }
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  }
})
