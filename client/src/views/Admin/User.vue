<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-4 sm:px-6 py-8">
          <!-- Users Management -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Search and Add Section -->
            <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm độc giả..."
                class="w-full sm:w-auto flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="handleSearch"
              />
              <router-link :to="{ name: 'AddUser' }">
                <button
                  class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Độc giả
                </button>
              </router-link>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th class="py-3 px-4 sm:px-6 text-left">Mã DG</th>
                    <th class="py-3 px-4 sm:px-6 text-left">Tên DG</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Email</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Giới tính</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Ngày sinh</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Địa chỉ</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Số điện thoại</th>
                    <th class="py-3 px-4 sm:px-6 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr
                    v-for="user in paginatedUsers"
                    :key="user._id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td class="py-4 px-4 sm:px-6 whitespace-nowrap">{{ user.MaID }}</td>
                    <td class="py-4 px-4 sm:px-6">{{ user.Ten }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ user.email }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ user.Phai }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ formatDate(user.NgaySinh) }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ user.DiaChi }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ user.DienThoai }}</td>
                    <td class="py-4 px-4 sm:px-6 text-center">
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          @click="editUser(user.MaID)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="deleteUser(user.MaID)"
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
import userService from "@/services/user.service";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const users = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
let searchTimeout = null;

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Filtered users based on search
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      (user.Ten?.toLowerCase() || '').includes(searchLower) ||
      (user.email?.toLowerCase() || '').includes(searchLower) ||
      (user.MaID?.toLowerCase() || '').includes(searchLower) ||
      (user.DienThoai || '').includes(searchQuery.value)
    );
  });
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value);
});

// Get current page items
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    if (filteredUsers.value.length === 0 && searchQuery.value) {
      toast.info("Không tìm thấy kết quả phù hợp", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  }, 300);
};

// Watch for items per page change
watch(itemsPerPage, () => {
  currentPage.value = 1;
});

const getAllUsers = async () => {
  try {
    const response = await userService.getUserByRole({ role: "user" });
    users.value = response.data;
  } catch (error) {
    console.error("Error while getting users:", error);
    toast.error("Không thể tải danh sách độc giả", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const editUser = (id) => {
  try {
    router.push({ name: "EditUser", params: { id } });
  } catch (error) {
    console.error("Error navigating to edit:", error);
    toast.error("Không thể mở trang chỉnh sửa", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const deleteUser = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa độc giả này?")) {
    try {
      const response = await userService.deleteUser(id);
      if (response.data.statusCode === 0) {
        toast.success("Xóa độc giả thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
        await getAllUsers();
      } else {
        throw new Error(response.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Error while deleting user:", error);
      toast.error(error.message || "Không thể xóa độc giả", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  }
};

onMounted(() => {
  getAllUsers();

  // Kiểm tra query params để hiển thị toast
  const route = useRoute();
  if (route.query.success) {
    if (route.query.success === 'add') {
      toast.success("Đã thêm độc giả thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        onClose: () => {
          router.replace({ query: {} });
        }
      });
    }
    if (route.query.success === 'edit') {
      toast.success("Đã cập nhật thông tin độc giả thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        onClose: () => {
          router.replace({ query: {} });
        }
      });
    }
  }
});
</script>
