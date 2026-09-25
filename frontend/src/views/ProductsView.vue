<template>
  <div class="space-y-6">
    <!-- Header Page -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Master Data Produk</h1>
        <p class="text-slate-500 text-sm mt-0.5">
          Kelola daftar barang, kategori, harga, dan ketersediaan stok.
        </p>
      </div>

      <button
        @click="openAddModal"
        class="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition active:scale-95"
      >
        <span class="text-lg leading-none">+</span>
        <span>Tambah Produk Baru</span>
      </button>
    </div>

    <!-- Table Card Utama -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau kategori..."
          class="px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
        />
        <span class="text-xs font-semibold text-slate-400">
          Total: {{ filteredProducts.length }} Produk
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider"
          >
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Nama Produk</th>
              <th class="p-4">Kategori</th>
              <th class="p-4">Harga</th>
              <th class="p-4">Stok</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-slate-700 text-sm">
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="p-4 font-bold text-slate-800">#{{ product.id }}</td>
              <td class="p-4 font-semibold text-slate-800">{{ product.name }}</td>
              <td class="p-4">
                <span
                  class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold"
                >
                  {{ product.category || 'Umum' }}
                </span>
              </td>
              <td class="p-4 font-medium text-slate-700">
                Rp {{ Number(product.price).toLocaleString('id-ID') }}
              </td>
              <td class="p-4">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-bold inline-block',
                    product.stock <= 10
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800',
                  ]"
                >
                  {{ product.stock }} unit
                </span>
              </td>
              <td class="p-4 text-center space-x-2">
                <button
                  @click="openEditModal(product)"
                  class="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
                >
                  Edit
                </button>
                <button
                  @click="promptDelete(product)"
                  class="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-semibold transition"
                >
                  Hapus
                </button>
              </td>
            </tr>

            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-400 text-sm">
                Tidak ada data produk ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form (Tambah / Edit Produk) -->
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
          v-if="isFormModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          @mousedown="formBackdrop.onMouseDown"
          @click="formBackdrop.onClick"
        >
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 my-8">
            <div class="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 class="font-bold text-slate-800 text-lg">
                {{ isEditMode ? 'Edit Produk' : 'Tambah Produk Baru' }}
              </h3>
              <button
                @click="closeFormModal"
                class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <form @submit.prevent="saveProduct" class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"> Nama Produk </label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Contoh: Kopi Susu Aren"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <!-- Input Kategori Dropdown -->
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"> Kategori </label>
                <select
                  v-model="form.category"
                  required
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>-- Pilih Kategori --</option>
                  <option v-for="cat in existingCategories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"> Harga (Rp) </label>
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  required
                  placeholder="15000"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1"> Stok Awal </label>
                <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  required
                  placeholder="50"
                  class="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div class="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  @click="closeFormModal"
                  class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition active:scale-95"
                >
                  {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Produk' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Modal Confirm Hapus Produk -->
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
          v-if="isDeleteModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          @mousedown="deleteBackdrop.onMouseDown"
          @click="deleteBackdrop.onClick"
        >
          <div
            class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 text-center my-8"
          >
            <div
              class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold"
            >
              ⚠️
            </div>

            <div>
              <h3 class="text-lg font-bold text-slate-800">Hapus Produk?</h3>
              <p class="text-sm text-slate-500 mt-1">
                Apakah Anda yakin ingin menghapus
                <strong class="text-slate-800">"{{ productToDelete?.name }}"</strong>?
              </p>
            </div>

            <div class="flex gap-2 pt-2">
              <button
                @click="closeDeleteModal"
                class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
              >
                Batal
              </button>
              <button
                @click="confirmDelete"
                class="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-rose-500/20 transition active:scale-95"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { useToastStore } from '@/stores/toastStore'
import { useSafeBackdrop } from '@/composables/useSafeBackdrop'

const productStore = useProductStore()
const toast = useToastStore()

const searchQuery = ref('')

// State Modal Form
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const selectedProductId = ref(null)

const form = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
})

// State Modal Confirm Hapus
const isDeleteModalOpen = ref(false)
const productToDelete = ref(null)

// Safe Backdrop Closures
const closeFormModal = () => {
  isFormModalOpen.value = false
}
const formBackdrop = useSafeBackdrop(closeFormModal)

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  productToDelete.value = null
}
const deleteBackdrop = useSafeBackdrop(closeDeleteModal)

// Daftar Kategori Preset + Kategori di Store + Kategori Form Aktif
const existingCategories = computed(() => {
  const defaultCategories = ['Makanan', 'Minuman', 'Snack', 'Lainnya']
  const storeCategories = productStore.products
    .map((p) => p.category)
    .filter((c) => Boolean(c) && c.trim() !== '')

  const activeCategory = form.value.category ? [form.value.category] : []

  return [...new Set([...defaultCategories, ...storeCategories, ...activeCategory])]
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return productStore.products
  const query = searchQuery.value.toLowerCase()
  return productStore.products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query)),
  )
})

const openAddModal = () => {
  isEditMode.value = false
  selectedProductId.value = null
  form.value = { name: '', category: '', price: 0, stock: 0 }
  isFormModalOpen.value = true
}

const openEditModal = (product) => {
  isEditMode.value = true
  selectedProductId.value = product.id
  form.value = {
    name: product.name,
    category: product.category || '',
    price: product.price,
    stock: product.stock,
  }
  isFormModalOpen.value = true
}

const saveProduct = () => {
  if (isEditMode.value) {
    productStore.updateProduct({
      id: selectedProductId.value,
      ...form.value,
    })
    toast.success('Produk berhasil diperbarui!')
  } else {
    productStore.addProduct({ ...form.value })
    toast.success('Produk baru berhasil ditambahkan!')
  }
  closeFormModal()
}

const promptDelete = (product) => {
  productToDelete.value = product
  isDeleteModalOpen.value = true
}

const confirmDelete = () => {
  if (productToDelete.value) {
    productStore.deleteProduct(productToDelete.value.id)
    toast.success(`Produk "${productToDelete.value.name}" telah dihapus.`)
  }
  closeDeleteModal()
}
</script>
