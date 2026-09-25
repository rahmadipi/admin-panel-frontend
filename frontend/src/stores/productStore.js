import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([
    { id: 1, name: 'Kopi Susu Gula Aren', price: 18000, stock: 25, category: 'Minuman' },
    { id: 2, name: 'Roti Bakar Cokelat', price: 15000, stock: 12, category: 'Makanan' },
    { id: 3, name: 'Matcha Latte', price: 22000, stock: 8, category: 'Minuman' },
  ])

  // Action: Tambah Produk dengan ID Urut (Auto-increment)
  const addProduct = (product) => {
    const maxId =
      products.value.length > 0 ? Math.max(...products.value.map((p) => Number(p.id) || 0)) : 0

    products.value.push({
      id: maxId + 1,
      ...product,
    })
  }

  // Action: Edit / Update Produk
  const updateProduct = (idOrObject, updatedData) => {
    let id = idOrObject
    let data = updatedData

    if (typeof idOrObject === 'object' && idOrObject !== null) {
      id = idOrObject.id
      data = idOrObject
    }

    const index = products.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      products.value[index] = {
        ...products.value[index],
        ...data,
      }
    }
  }

  // Action: Hapus Produk
  const deleteProduct = (id) => {
    products.value = products.value.filter((p) => p.id !== id)
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }
})
