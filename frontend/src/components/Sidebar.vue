<template>
  <aside class="w-64 bg-slate-800 text-white min-h-screen flex flex-col">
    <!-- Brand / Logo -->
    <div class="p-5 text-xl font-bold border-b border-slate-700 tracking-wide">Admin Panel</div>

    <!-- Navigation Links -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/dashboard"
        class="block px-4 py-2.5 rounded transition text-slate-300 hover:bg-slate-700 hover:text-white"
        active-class="bg-blue-600 text-white font-semibold"
      >
        Dashboard
      </router-link>

      <router-link
        to="/products"
        class="block px-4 py-2.5 rounded transition text-slate-300 hover:bg-slate-700 hover:text-white"
        active-class="bg-blue-600 text-white font-semibold"
      >
        Master Produk
      </router-link>

      <router-link
        to="/transactions"
        class="block px-4 py-2.5 rounded transition text-slate-300 hover:bg-slate-700 hover:text-white"
        active-class="bg-blue-600 text-white font-semibold"
      >
        Transaksi Penjualan
      </router-link>
    </nav>
  </aside>
</template>
