import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const savedTransactions = localStorage.getItem('pos_transactions')
  const transactions = ref(savedTransactions ? JSON.parse(savedTransactions) : [])

  // Sync ke LocalStorage agar riwayat tersimpan
  watch(
    transactions,
    (newVal) => {
      localStorage.setItem('pos_transactions', JSON.stringify(newVal))
    },
    { deep: true },
  )

  const addTransaction = (transactionData) => {
    transactions.value.unshift(transactionData)
    return transactionData
  }

  return {
    transactions,
    addTransaction,
  }
})
