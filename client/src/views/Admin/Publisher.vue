<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-4 sm:px-6 py-8">
          <!-- Publishers Management -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Search and Add Section -->
            <div
              class="p-4 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm nhà xuất bản..."
                class="w-full sm:w-auto flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                @input="handleSearch"
              />
              <router-link :to="{ name: 'AddPublisher' }">
                <button
                  class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm NXB
                </button>
              </router-link>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
              <table class="min-w-full bg-white">
                <thead
                  class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
                >
                  <tr>
                    <th class="py-3 px-4 sm:px-6 text-left">Mã NXB</th>
                    <th class="py-3 px-4 sm:px-6 text-left">Tên NXB</th>
                    <th
                      class="hidden sm:table-cell py-3 px-4 sm:px-6 text-left"
                    >
                      Địa chỉ
                    </th>
                    <th class="py-3 px-4 sm:px-6 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm">
                  <tr
                    v-for="pub in paginatedPublishers"
                    :key="pub._id"
                    class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td class="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {{ pub.MaNXB }}
                    </td>
                    <td class="py-4 px-4 sm:px-6">{{ pub.TenNXB }}</td>
                    <td class="hidden sm:table-cell py-4 px-4 sm:px-6">
                      {{ pub.DiaChi }}
                    </td>
                    <td class="py-4 px-4 sm:px-6 text-center">
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          @click="editPublisher(pub.MaNXB)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="deletePublisher(pub.MaNXB)"
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
                    :class="
                      currentPage === 1
                        ? 'text-gray-400 border-gray-200'
                        : 'text-green-600 border-green-300 hover:bg-green-50'
                    "
                  >
                    Trước
                  </button>

                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="currentPage = page"
                    class="px-3 py-1 rounded border"
                    :class="
                      currentPage === page
                        ? 'bg-green-500 text-white border-green-500'
                        : 'text-green-600 border-green-300 hover:bg-green-50'
                    "
                  >
                    {{ page }}
                  </button>

                  <button
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded border"
                    :class="
                      currentPage === totalPages
                        ? 'text-gray-400 border-gray-200'
                        : 'text-green-600 border-green-300 hover:bg-green-50'
                    "
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
import publisherService from "@/services/publisher.service";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const publisher = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
let searchTimeout = null;

// Filtered publishers based on search
const filteredPublishers = computed(() => {
  return publisher.value.filter(
    (pub) =>
      pub.TenNXB.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pub.DiaChi.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pub.MaNXB.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.ceil(filteredPublishers.value.length / itemsPerPage.value);
});

// Get current page items
const paginatedPublishers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPublishers.value.slice(start, end);
});

// Handle search with debounce and error handling
const handleSearch = () => {
  try {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      currentPage.value = 1;
      if (filteredPublishers.value.length === 0 && searchQuery.value) {
        toast.info("Không tìm thấy kết quả phù hợp", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      }
    }, 400);
  } catch (error) {
    console.error("Error in search:", error);
    toast.error("Có lỗi xảy ra khi tìm kiếm", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }
};

// Watch for items per page change
watch(itemsPerPage, () => {
  currentPage.value = 1; // Reset to first page when changing items per page
});

const getAllPublishers = async () => {
  try {
    const response = await publisherService.getPublishers();
    publisher.value = response;
  } catch (error) {
    console.error("Error while getting publishers:", error);
    toast.error("Không thể tải danh sách nhà xuất bản", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }
};

const editPublisher = (id) => {
  try {
    router.push({ name: "EditPublisher", params: { id } });
  } catch (error) {
    console.error("Error navigating to edit:", error);
    toast.error("Không thể mở trang chỉnh sửa", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }
};

const deletePublisher = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa nhà xuất bản này?")) {
    try {
      const response = await publisherService.deletePublisher(id);
      console.log(response);

      if (response.data.statusCode === 0) {
        toast.success("Xóa nhà xuất bản thành công", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
        await getAllPublishers(); // Refresh danh sách
      } else {
        throw new Error(response.data.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error("Error while deleting publisher:", error);
      toast.error(error.message || "Không thể xóa nhà xuất bản", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  }
};

// Watch for data changes
watch(publisher, (newValue) => {
  if (newValue.length === 0) {
    toast.info("Danh sách nhà xuất bản trống", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  }
});

onMounted(() => {
  getAllPublishers();

  // Kiểm tra query params để hiển thị toast
  const route = useRoute();
  if (route.query.success) {
    if (route.query.success === "add") {
      toast.success("Đã thêm nhà xuất bản thành công!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
    if (route.query.success === "edit") {
      toast.success("Đã cập nhật nhà xuất bản thành công!", {
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
