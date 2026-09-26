<template>
  <div class="space-y-6">
    <!-- Header Page & Tab Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Transaksi Penjualan</h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Pilih produk untuk menambah ke keranjang, lakukan pembayaran, dan cetak struk.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex bg-slate-200/80 p-1 rounded-xl w-fit">
        <button
          @click="activeTab = 'pos'"
          :class="[
            'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition',
            activeTab === 'pos'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900',
          ]"
        >
          <ShoppingCartIcon class="w-4 h-4" />
          <span>Buat Transaksi</span>
        </button>
        <button
          @click="activeTab = 'history'"
          :class="[
            'flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition',
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900',
          ]"
        >
          <DocumentTextIcon class="w-4 h-4" />
          <span>Riwayat Transaksi ({{ transactionStore.transactions.length }})</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: POS / BUAT TRANSAKSI -->
    <div v-if="activeTab === 'pos'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Katalog Produk -->
      <div class="lg:col-span-7 xl:col-span-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              v-model="productSearch"
              type="text"
              placeholder="Cari produk..."
              class="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
            />
          </div>
          <select
            v-model="selectedCategory"
            class="px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-xs"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          <div
            v-for="product in availableProducts"
            :key="product.id"
            @click="addToCart(product)"
            class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400 cursor-pointer transition flex flex-col justify-between group"
          >
            <div>
              <span
                class="inline-block px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold mb-2 uppercase"
              >
                {{ product.category || 'Umum' }}
              </span>
              <h4 class="font-bold text-slate-800 text-sm group-hover:text-blue-600 line-clamp-2">
                {{ product.name }}
              </h4>
            </div>

            <div class="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
              <span class="text-xs font-bold text-blue-600">
                Rp {{ Number(product.price).toLocaleString('id-ID') }}
              </span>
              <span
                :class="[
                  'text-[11px] font-medium px-1.5 py-0.5 rounded',
                  product.stock > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50',
                ]"
              >
                Stok: {{ product.stock }}
              </span>
            </div>
          </div>

          <div
            v-if="availableProducts.length === 0"
            class="col-span-full bg-white rounded-2xl p-8 text-center text-slate-400 text-sm border border-dashed border-slate-300"
          >
            Produk tidak ditemukan atau stok habis.
          </div>
        </div>
      </div>

      <!-- Keranjang Belanja -->
      <div class="lg:col-span-5 xl:col-span-4">
        <div
          class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 sticky top-6"
        >
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
              <ShoppingCartIcon class="w-5 h-5 text-slate-600" />
              <span>Keranjang Belanja</span>
            </h3>
            <button
              v-if="cart.length > 0"
              @click="clearCart"
              class="text-xs text-rose-500 hover:text-rose-700 font-semibold"
            >
              Kosongkan
            </button>
          </div>

          <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
            <div
              v-for="item in cart"
              :key="item.id"
              class="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100"
            >
              <div class="flex-1 pr-2">
                <p class="text-xs font-bold text-slate-800 line-clamp-1">{{ item.name }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  Rp {{ Number(item.price).toLocaleString('id-ID') }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <button
                  @click="decreaseQty(item)"
                  class="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  -
                </button>
                <span class="text-xs font-bold text-slate-800 w-4 text-center">{{ item.qty }}</span>
                <button
                  @click="increaseQty(item)"
                  class="w-6 h-6 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>

            <div
              v-if="cart.length === 0"
              class="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2"
            >
              <ShoppingCartIcon class="w-10 h-10 text-slate-300 stroke-1" />
              <span>Keranjang masih kosong.<br />Klik produk untuk menambahkan.</span>
            </div>
          </div>

          <div class="border-t border-slate-100 pt-3 space-y-2">
            <div class="flex justify-between text-xs text-slate-500">
              <span>Total Items</span>
              <span class="font-semibold text-slate-700">{{ totalCartItems }} item</span>
            </div>
            <div class="flex justify-between items-center pt-1">
              <span class="font-bold text-slate-800 text-sm">Total Bayar</span>
              <span class="font-extrabold text-blue-600 text-lg">
                Rp {{ totalCartAmount.toLocaleString('id-ID') }}
              </span>
            </div>
          </div>

          <button
            @click="openPaymentModal"
            :disabled="cart.length === 0"
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            Proses Pembayaran
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 2: RIWAYAT TRANSAKSI -->
    <div v-else class="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div class="relative w-72">
          <MagnifyingGlassIcon class="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            v-model="historySearch"
            type="text"
            placeholder="Cari ID transaksi..."
            class="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <span class="text-xs font-semibold text-slate-400">
          Total: {{ filteredHistory.length }} Transaksi
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider"
          >
            <tr>
              <th class="p-4">Kode Transaksi</th>
              <th class="p-4">Tanggal & Waktu</th>
              <th class="p-4">Metode Bayar</th>
              <th class="p-4">Total Amount</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
            <tr
              v-for="trx in filteredHistory"
              :key="trx.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="p-4 font-bold text-slate-800">#{{ trx.id }}</td>
              <td class="p-4 text-slate-600">{{ trx.date }}</td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  {{ trx.paymentMethod || 'Tunai' }}
                </span>
              </td>
              <td class="p-4 font-bold text-blue-600">
                Rp {{ Number(trx.totalAmount).toLocaleString('id-ID') }}
              </td>
              <td class="p-4 text-center">
                <button
                  @click="openReceiptModal(trx)"
                  class="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                >
                  Detail Struk
                </button>
              </td>
            </tr>

            <tr v-if="filteredHistory.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400 text-sm">
                Belum ada riwayat transaksi tersimpan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL PEMBAYARAN -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isPaymentModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          @click.self="closePaymentModal"
        >
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 my-8">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 class="font-bold text-slate-800 text-lg">Proses Pembayaran</h3>
              <button
                @click="closePaymentModal"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>

            <form @submit.prevent="submitPayment" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">
                  Metode Pembayaran
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    v-for="method in ['Tunai', 'QRIS', 'Transfer']"
                    :key="method"
                    @click="paymentMethod = method"
                    :class="[
                      'py-2 px-3 text-xs font-bold rounded-xl border transition',
                      paymentMethod === method
                        ? 'bg-blue-50 border-blue-600 text-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50',
                    ]"
                  >
                    {{ method }}
                  </button>
                </div>
              </div>

              <div v-if="paymentMethod === 'Tunai'">
                <label class="block text-xs font-semibold text-slate-600 mb-1">
                  Uang Diterima (Rp)
                </label>
                <input
                  v-model.number="paidAmount"
                  type="number"
                  min="0"
                  required
                  placeholder="Masukkan nominal..."
                  class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <div class="flex gap-1.5 mt-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    v-for="nominal in quickNominals"
                    :key="nominal"
                    @click="paidAmount = nominal"
                    class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium whitespace-nowrap"
                  >
                    Rp {{ nominal.toLocaleString('id-ID') }}
                  </button>
                </div>
              </div>

              <div class="bg-slate-50 p-4 rounded-xl space-y-2 text-sm border border-slate-100">
                <div class="flex justify-between text-slate-600">
                  <span>Total Tagihan</span>
                  <span class="font-bold text-slate-800">
                    Rp {{ totalCartAmount.toLocaleString('id-ID') }}
                  </span>
                </div>
                <div v-if="paymentMethod === 'Tunai'" class="flex justify-between text-slate-600">
                  <span>Kembalian</span>
                  <span
                    :class="[
                      'font-extrabold',
                      changeAmount >= 0 ? 'text-emerald-600' : 'text-rose-500',
                    ]"
                  >
                    Rp {{ changeAmount >= 0 ? changeAmount.toLocaleString('id-ID') : 0 }}
                  </span>
                </div>
              </div>

              <div class="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  @click="closePaymentModal"
                  class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  :disabled="paymentMethod === 'Tunai' && changeAmount < 0"
                  class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  Konfirmasi & Bayar
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL STRUK -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isReceiptModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          @click.self="closeReceiptModal"
        >
          <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 my-8">
            <div class="text-center border-b border-slate-100 pb-3">
              <h3 class="font-bold text-slate-800 text-lg">Struk Transaksi</h3>
              <p class="text-xs text-slate-400">#{{ selectedTransaction?.id }}</p>
            </div>

            <div v-if="selectedTransaction" class="space-y-3 text-sm">
              <p class="text-xs text-slate-500 text-center">
                {{ selectedTransaction.date }}
              </p>

              <div
                class="border-t border-b border-slate-100 py-3 space-y-2 max-h-60 overflow-y-auto"
              >
                <div
                  v-for="(item, idx) in selectedTransaction.items"
                  :key="idx"
                  class="flex justify-between text-xs text-slate-700"
                >
                  <div>
                    <p class="font-semibold">{{ item.name }}</p>
                    <p class="text-[10px] text-slate-400">
                      {{ item.qty }} x Rp {{ Number(item.price).toLocaleString('id-ID') }}
                    </p>
                  </div>
                  <span class="font-bold">
                    Rp {{ Number(item.qty * item.price).toLocaleString('id-ID') }}
                  </span>
                </div>
              </div>

              <div class="space-y-1 text-xs">
                <div class="flex justify-between font-bold text-slate-800 text-sm">
                  <span>Total Amount</span>
                  <span class="text-blue-600">
                    Rp {{ Number(selectedTransaction.totalAmount).toLocaleString('id-ID') }}
                  </span>
                </div>
                <div class="flex justify-between text-slate-500">
                  <span>Metode</span>
                  <span class="font-medium text-slate-700">
                    {{ selectedTransaction.paymentMethod || 'Tunai' }}
                  </span>
                </div>
                <div
                  v-if="selectedTransaction.paymentMethod === 'Tunai'"
                  class="flex justify-between text-slate-500"
                >
                  <span>Dibayar</span>
                  <span
                    >Rp
                    {{ Number(selectedTransaction.paidAmount || 0).toLocaleString('id-ID') }}</span
                  >
                </div>
                <div
                  v-if="selectedTransaction.paymentMethod === 'Tunai'"
                  class="flex justify-between text-slate-500"
                >
                  <span>Kembali</span>
                  <span
                    >Rp
                    {{
                      Number(selectedTransaction.changeAmount || 0).toLocaleString('id-ID')
                    }}</span
                  >
                </div>
              </div>
            </div>

            <button
              @click="closeReceiptModal"
              class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ShoppingCartIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useProductStore } from '@/stores/productStore'
import { useTransactionStore } from '@/stores/transactionStore'

const productStore = useProductStore()
const transactionStore = useTransactionStore()

// State
const activeTab = ref('pos')
const productSearch = ref('')
const selectedCategory = ref('')
const historySearch = ref('')

const cart = ref([])

const isPaymentModalOpen = ref(false)
const paymentMethod = ref('Tunai')
const paidAmount = ref(0)

const isReceiptModalOpen = ref(false)
const selectedTransaction = ref(null)

// Computed
const categories = computed(() => {
  const cats = productStore.products.map((p) => p.category).filter(Boolean)
  return [...new Set(cats)]
})

const availableProducts = computed(() => {
  return productStore.products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.value.toLowerCase())
    const matchesCat = selectedCategory.value ? p.category === selectedCategory.value : true
    return matchesSearch && matchesCat
  })
})

const totalCartItems = computed(() => cart.value.reduce((acc, item) => acc + item.qty, 0))
const totalCartAmount = computed(() =>
  cart.value.reduce((acc, item) => acc + item.qty * item.price, 0),
)
const changeAmount = computed(() => paidAmount.value - totalCartAmount.value)

const quickNominals = computed(() => {
  const total = totalCartAmount.value
  return [total, 20000, 50000, 100000].filter((n) => n >= total)
})

// Cart Actions
const addToCart = (product) => {
  if (product.stock <= 0) return

  const existing = cart.value.find((item) => item.id === product.id)
  if (existing) {
    if (existing.qty < product.stock) {
      existing.qty++
    }
  } else {
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
  }
}

const increaseQty = (item) => {
  const prod = productStore.products.find((p) => p.id === item.id)
  if (prod && item.qty < prod.stock) {
    item.qty++
  }
}

const decreaseQty = (item) => {
  if (item.qty > 1) {
    item.qty--
  } else {
    cart.value = cart.value.filter((i) => i.id !== item.id)
  }
}

const clearCart = () => {
  cart.value = []
}

// Modal Controls
const openPaymentModal = () => {
  paidAmount.value = totalCartAmount.value
  paymentMethod.value = 'Tunai'
  isPaymentModalOpen.value = true
}

const closePaymentModal = () => {
  isPaymentModalOpen.value = false
}

const openReceiptModal = (trx) => {
  selectedTransaction.value = trx
  isReceiptModalOpen.value = true
}

const closeReceiptModal = () => {
  isReceiptModalOpen.value = false
  selectedTransaction.value = null
}

// Submit Payment
const submitPayment = () => {
  cart.value.forEach((cartItem) => {
    const prod = productStore.products.find((p) => p.id === cartItem.id)
    if (prod) prod.stock -= cartItem.qty
  })

  const newTrx = {
    id: `TRX-${Date.now().toString().slice(-6)}`,
    date: new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    items: JSON.parse(JSON.stringify(cart.value)),
    totalAmount: totalCartAmount.value,
    paymentMethod: paymentMethod.value,
    paidAmount: paymentMethod.value === 'Tunai' ? paidAmount.value : totalCartAmount.value,
    changeAmount: paymentMethod.value === 'Tunai' ? changeAmount.value : 0,
  }

  transactionStore.addTransaction(newTrx)

  closePaymentModal()
  openReceiptModal(newTrx)
  clearCart()
}

// Filter History
const filteredHistory = computed(() => {
  if (!historySearch.value) return transactionStore.transactions
  return transactionStore.transactions.filter((t) =>
    t.id.toLowerCase().includes(historySearch.value.toLowerCase()),
  )
})
</script>
