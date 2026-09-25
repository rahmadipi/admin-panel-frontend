<template>
  <div class="space-y-6">
    <!-- Header Welcome -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Selamat Datang, {{ authStore.user?.name || 'Admin' }}! 👋
        </h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Berikut adalah ringkasan performa penjualan dan stok barang kamu saat ini.
        </p>
      </div>
    </div>

    <!-- Cards Grid Ringkasan Statistik -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Card 1: Total Pendapatan -->
      <div
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Pendapatan
          </p>
          <h3 class="text-xl font-bold text-slate-800 mt-1">
            Rp {{ totalRevenue.toLocaleString('id-ID') }}
          </h3>
        </div>
        <div
          class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg"
        >
          💰
        </div>
      </div>

      <!-- Card 2: Total Transaksi -->
      <div
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Transaksi
          </p>
          <h3 class="text-xl font-bold text-slate-800 mt-1">{{ totalTransactions }} Transaksi</h3>
        </div>
        <div
          class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg"
        >
          🧾
        </div>
      </div>

      <!-- Card 3: Total Produk -->
      <div
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Master Produk</p>
          <h3 class="text-xl font-bold text-slate-800 mt-1">{{ totalProducts }} Item</h3>
        </div>
        <div
          class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg"
        >
          📦
        </div>
      </div>

      <!-- Card 4: Stok Menipis -->
      <div
        class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Stok Menipis (≤ 10)
          </p>
          <h3
            class="text-xl font-bold mt-1"
            :class="lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'"
          >
            {{ lowStockCount }} Produk
          </h3>
        </div>
        <div
          class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg"
        >
          ⚠️
        </div>
      </div>
    </div>

    <!-- Grid Detail: Transaksi Terbaru & Alert Stok -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tabel Transaksi Terakhir (2 Kolom) -->
      <div
        class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div class="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 class="font-bold text-slate-800">Transaksi Terbaru</h2>
          <router-link
            to="/transactions"
            class="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Lihat Semua →
          </router-link>
        </div>

        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider"
          >
            <tr>
              <th class="p-4">ID Transaksi</th>
              <th class="p-4">Waktu</th>
              <th class="p-4">Jumlah Item</th>
              <th class="p-4">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
            <tr v-for="trx in recentTransactions" :key="trx.id" class="hover:bg-slate-50">
              <td class="p-4 font-semibold text-slate-800">{{ trx.id }}</td>
              <td class="p-4 text-xs text-slate-500">{{ trx.date }}</td>
              <td class="p-4">{{ trx.items.reduce((acc, curr) => acc + curr.qty, 0) }} unit</td>
              <td class="p-4 font-bold text-emerald-600">
                Rp {{ trx.totalAmount.toLocaleString('id-ID') }}
              </td>
            </tr>
            <tr v-if="recentTransactions.length === 0">
              <td colspan="4" class="p-8 text-center text-slate-400 text-sm">
                Belum ada transaksi terjadi.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Widget Stok Menipis (1 Kolom) -->
      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div class="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 class="font-bold text-slate-800">Peringatan Stok</h2>
          <span class="text-xs text-slate-400">Stok ≤ 10</span>
        </div>

        <div class="space-y-3">
          <div
            v-for="product in lowStockProducts"
            :key="product.id"
            class="flex justify-between items-center p-3 bg-amber-50/60 rounded-lg border border-amber-100"
          >
            <div>
              <p class="text-sm font-semibold text-slate-800">{{ product.name }}</p>
              <p class="text-xs text-slate-500">{{ product.category }}</p>
            </div>
            <span class="px-2.5 py-1 bg-amber-200 text-amber-800 rounded-full text-xs font-bold">
              {{ product.stock }} tersisa
            </span>
          </div>

          <p v-if="lowStockProducts.length === 0" class="text-xs text-slate-400 text-center py-6">
            Semua stok produk dalam kondisi aman 👍
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useProductStore } from '@/stores/productStore'
import { useTransactionStore } from '@/stores/transactionStore'

const authStore = useAuthStore()
const productStore = useProductStore()
const transactionStore = useTransactionStore()

// Computeds Metrik
const totalRevenue = computed(() => {
  return transactionStore.transactions.reduce((sum, trx) => sum + trx.totalAmount, 0)
})

const totalTransactions = computed(() => {
  return transactionStore.transactions.length
})

const totalProducts = computed(() => {
  return productStore.products.length
})

const lowStockProducts = computed(() => {
  return productStore.products.filter((p) => p.stock <= 10)
})

const lowStockCount = computed(() => {
  return lowStockProducts.value.length
})

// 5 Transaksi Terbaru
const recentTransactions = computed(() => {
  return transactionStore.transactions.slice(0, 5)
})
</script>
