<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-4 sm:px-6 py-8">
          <!-- Books Management -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Search and Add Section -->
            <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm sách..."
                class="w-full sm:w-auto flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="handleSearch"
              />
              <router-link :to="{ name: 'AddBook' }">
                <button
                  class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Sách
                </button>
              </router-link>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th class="py-3 px-4 sm:px-6 text-left">Mã Sách</th>
                    <th class="py-3 px-4 sm:px-6 text-left">Tên Sách</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Ảnh</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Số lượng</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Thể loại</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Nhà xuất bản</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Tác Giả</th>
                    <th class="py-3 px-4 sm:px-6 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr
                    v-for="book in paginatedBooks"
                    :key="book._id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td class="py-4 px-4 sm:px-6 whitespace-nowrap">{{ book.MaSach }}</td>
                    <td class="py-4 px-4 sm:px-6">{{ book.TenSach }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">
                      <img
                        :src="getImageUrl(book.AnhSach)"
                        alt="Book cover"
                        class="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ book.SoQuyen }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ book.TheLoai }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ book.publisherInfo.TenNXB }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ book.TacGia }}</td>
                    <td class="py-4 px-4 sm:px-6 text-center">
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          @click="editBook(book.MaSach)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="deleteBook(book.MaSach)"
                          class="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon class="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="px-4 py-3 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <!-- Items per page -->
                <div class="flex items-center">
                  <select
                    v-model="itemsPerPage"
                    class="border rounded px-2 py-1 text-sm"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                  </select>
                  <span class="ml-2 text-sm text-gray-600">Dòng mỗi trang</span>
                </div>

                <!-- Page navigation -->
                <div class="flex items-center space-x-2">
                  <button
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-1 rounded border"
                    :class="currentPage === 1 ? 'text-gray-400 border-gray-200' : 'text-green-600 border-green-300 hover:bg-green-50'"
                  >
                    Trước
                  </button>

                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="currentPage = page"
                    class="px-3 py-1 rounded border"
                    :class="currentPage === page ? 'bg-green-500 text-white border-green-500' : 'text-green-600 border-green-300 hover:bg-green-50'"
                  >
                    {{ page }}
                  </button>

                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded border"
                    :class="currentPage === totalPages ? 'text-gray-400 border-gray-200' : 'text-green-600 border-green-300 hover:bg-green-50'"
                  >
                    Sau
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import bookService from "@/services/book.service";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const books = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
let searchTimeout = null;

// Filtered books based on search
const filteredBooks = computed(() => {
  return books.value.filter(book => 
    book.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    book.TacGia.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    book.MaSach.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value);
});

// Get current page items
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBooks.value.slice(start, end);
});

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1; // Reset to first page when searching
    if (filteredBooks.value.length === 0 && searchQuery.value) {
      toast.info("Không tìm thấy kết quả phù hợp", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  }, 300);
};

// Watch for items per page change
watch(itemsPerPage, () => {
  currentPage.value = 1; // Reset to first page when changing items per page
});

const getAllBooks = async () => {
  try {
    const response = await bookService.getBooks();
    books.value = response;
  } catch (error) {
    console.error("Error while getting books:", error);
    toast.error("Không thể tải danh sách sách", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const editBook = (id) => {
  try {
    router.push({ name: "EditBook", params: { id } });
  } catch (error) {
    console.error("Error navigating to edit:", error);
    toast.error("Không thể mở trang chỉnh sửa", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const deleteBook = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
    try {
      const response = await bookService.deleteBook(id);
      if (response.statusCode === 0) {
        toast.success("Xóa sách thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
        await getAllBooks(); // Refresh danh sách
      } else {
        throw new Error(response.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Error while deleting book:", error);
      toast.error(error.message || "Không thể xóa sách", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  }
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) {
    return path;
  }
  return `${import.meta.env.VITE_API_URL}${path}`;
};

onMounted(() => {
  getAllBooks();

  // Kiểm tra query params để hiển thị toast
  const route = useRoute();
  if (route.query.success) {
    if (route.query.success === 'add') {
      toast.success("Đã thêm sách thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
    if (route.query.success === 'edit') {
      toast.success("Đã cập nhật sách thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        onClose: () => {
          // Xóa query parameter khi toast đóng
          router.replace({ query: {} });
        }
      });
    }
  }
});
</script>
