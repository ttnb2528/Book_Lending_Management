<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-4 sm:px-6 py-8">
          <!-- Lending Management -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Search and Add Section -->
            <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm phiếu mượn..."
                class="w-full sm:w-auto flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="handleSearch"
              />
              <router-link :to="{ name: 'AddLending' }">
                <button
                  class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Phiếu mượn
                </button>
              </router-link>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <tr>
                    <th class="py-3 px-4 sm:px-6 text-left">Mã PM</th>
                    <th class="py-3 px-4 sm:px-6 text-left">Mã DG</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Mã Sách</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Ngày mượn</th>
                    <th class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left">Ngày trả</th>
                    <th class="py-3 px-4 sm:px-6 text-left">Tình trạng</th>
                    <th class="py-3 px-4 sm:px-6 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr
                    v-for="lending in paginatedLendings"
                    :key="lending._id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td class="py-4 px-4 sm:px-6 whitespace-nowrap">{{ lending.MaPhieuMuon }}</td>
                    <td class="py-4 px-4 sm:px-6">{{ lending.userInfo.MaID }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ lending.bookInfo.MaSach }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ formatDate(lending.NgayMuon) }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">{{ formatDate(lending.NgayTra) }}</td>
                    <td class="py-4 px-4 sm:px-6">
                      <div v-if="lending.isEditing">
                        <select
                          v-model="lending.TinhTrang"
                          @blur="cancelEdit(lending)"
                          class="p-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option
                            v-for="(label, status) in LendingStatus"
                            :key="status"
                            :value="status"
                            :disabled="!isValidTransition(lending.originalStatus, status)"
                          >
                            {{ label }}
                          </option>
                        </select>
                        <button
                          @mousedown="saveStatus(lending)"
                          class="ml-2 text-green-500 hover:text-green-700"
                        >
                          ✔
                        </button>
                      </div>
                      <div v-else>
                        <span 
                          :class="{
                            'px-2 py-1 rounded-full text-xs font-medium': true,
                            'bg-yellow-100 text-yellow-800': lending.TinhTrang === 'Chờ xử lý',
                            'bg-blue-100 text-blue-800': lending.TinhTrang === 'Đang cho mượn',
                            'bg-green-100 text-green-800': lending.TinhTrang === 'Đã trả',
                            'bg-red-100 text-red-800': lending.TinhTrang === 'Trễ hạn'
                          }"
                        >
                          {{ LendingStatus[lending.TinhTrang] }}
                        </span>
                        <button
                          v-if="lending.TinhTrang !== 'Đã trả'"
                          @click="editStatus(lending)"
                          class="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <PencilIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td class="py-4 px-4 sm:px-6 text-center">
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          @click="editLending(lending.MaPhieuMuon)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="deleteLending(lending.MaPhieuMuon)"
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
import lendingService from "@/services/lending.service";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { useRouter, useRoute } from "vue-router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const router = useRouter();
const lendings = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
let searchTimeout = null;

const LendingStatus = {
  "Chờ xử lý": "Chờ xử lý",
  "Đang cho mượn": "Đang cho mượn",
  "Đã trả": "Đã trả",
  "Trễ hạn": "Trễ hạn",
};

const validTransitions = {
  "Chờ xử lý": ["Chờ xử lý", "Đang cho mượn", "Đã trả"],
  "Đang cho mượn": ["Đang cho mượn", "Đã trả", "Trễ hạn"],
  "Trễ hạn": ["Trễ hạn", "Đã trả"],
};

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

// Filtered lendings based on search
const filteredLendings = computed(() => {
  return lendings.value.filter(lending => {
    const searchLower = searchQuery.value.toLowerCase();
    return (
      lending.MaPhieuMuon?.toLowerCase().includes(searchLower) ||
      lending.userInfo?.MaID?.toLowerCase().includes(searchLower) ||
      lending.bookInfo?.MaSach?.toLowerCase().includes(searchLower)
    );
  });
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredLendings.value.length / itemsPerPage.value);
});

// Get current page items
const paginatedLendings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredLendings.value.slice(start, end);
});

// Handle search with debounce
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    if (filteredLendings.value.length === 0 && searchQuery.value) {
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

const isValidTransition = (currentStatus, newStatus) => {
  const allowedTransitions = validTransitions[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

const getAllLendings = async () => {
  try {
    const response = await lendingService.getLendings();
    lendings.value = response.map((lending) => ({
      ...lending,
      isEditing: false,
    }));
  } catch (error) {
    console.error("Error while getting lendings:", error);
    toast.error("Không thể tải danh sách phiếu mượn", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const editStatus = (lending) => {
  lending.isEditing = true;
  lending.originalStatus = lending.TinhTrang;
};

const saveStatus = async (lending) => {
  const currentStatus = lending.originalStatus;
  const newStatus = lending.TinhTrang;

  if (!isValidTransition(currentStatus, newStatus)) {
    toast.error("Không thể chuyển sang trạng thái này!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
    lending.TinhTrang = lending.originalStatus;
    lending.isEditing = false;
    return;
  }

  try {
    await lendingService.updateLending(lending.MaPhieuMuon, {
      MaDocGia: lending.userInfo.MaID,
      MaSach: lending.bookInfo.MaSach,
      TinhTrang: lending.TinhTrang,
    });
    
    toast.success("Cập nhật trạng thái thành công", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
    
    await getAllLendings();
    lending.isEditing = false;
  } catch (error) {
    console.error("Error updating status:", error);
    toast.error("Không thể cập nhật trạng thái", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const cancelEdit = (lending) => {
  lending.TinhTrang = lending.originalStatus;
  lending.isEditing = false;
};

const editLending = (id) => {
  try {
    router.push({ name: "EditLending", params: { id } });
  } catch (error) {
    console.error("Error navigating to edit:", error);
    toast.error("Không thể mở trang chỉnh sửa", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000
    });
  }
};

const deleteLending = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa phiếu mượn này?")) {
    try {
      const response = await lendingService.deleteLending(id);
      if (response.data.statusCode === 0) {
        toast.success("Xóa phiếu mượn thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        });
        await getAllLendings();
      } else {
        throw new Error(response.data.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Error while deleting lending:", error);
      toast.error(error.message || "Không thể xóa phiếu mượn", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000
      });
    }
  }
};

onMounted(() => {
  getAllLendings();

  // Kiểm tra query params để hiển thị toast
  const route = useRoute();
  if (route.query.success) {
    if (route.query.success === 'add') {
      toast.success("Đã thêm phiếu mượn thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
        onClose: () => {
          router.replace({ query: {} });
        }
      });
    }
    if (route.query.success === 'edit') {
      toast.success("Đã cập nhật phiếu mượn thành công!", {
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
