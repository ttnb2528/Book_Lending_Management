<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <Header />
    <div class="container flex-grow mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-green-800 mb-6">Lịch sử mượn sách</h1>

        <!-- Danh sách mượn sách -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sách
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày mượn
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày trả
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="lending in lendings" :key="lending?._id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0">
                      <img
                        v-if="lending.bookInfo?.AnhSach"
                        
                        :src="getImageUrl(lending.bookInfo.AnhSach)"
                        :alt="lending.bookInfo.TenSach"
                        class="h-10 w-10 object-cover rounded"
                      />
                      <BookOpenIcon v-else class="h-10 w-10 text-green-600" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ lending.bookInfo?.TenSach }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ lending.bookInfo?.TacGia }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(lending.NgayMuon) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(lending.NgayTra) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(lending.bookInfo?.DonGia) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="getStatusClass(lending.TinhTrang)"
                  >
                    {{ getStatusText(lending.TinhTrang) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    v-if="lending.TinhTrang === 'Chờ xử lý'"
                    @click="handleCancel(lending.MaPhieuMuon)"
                    class="text-red-600 hover:text-red-800 font-medium mr-3"
                  >
                    Hủy yêu cầu
                  </button>
                  
                  <router-link
                    v-if="lending.TinhTrang === 'Đã trả'"
                    :to="`/borrow/${lending.bookInfo.MaSach}`"
                    class="text-green-600 hover:text-green-800 font-medium"
                  >
                    Mượn lại
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Hiển thị khi không có dữ liệu -->
          <div v-if="lendings.length === 0" class="text-center py-8">
            <BookOpenIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">Chưa có lịch sử mượn sách</h3>
            <p class="mt-1 text-sm text-gray-500">Bắt đầu mượn sách ngay!</p>
            <div class="mt-6">
              <router-link
                to="/"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Xem danh sách sách
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { BookOpenIcon } from '@heroicons/vue/24/solid';
import Header from "@/layout/Client/Header.vue";
import Footer from "@/layout/Client/Footer.vue";
import LendingService from "@/services/lending.service";
import { toast } from 'vue3-toastify';
const lendings = ref([]);

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:3000${path}`;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const getStatusClass = (status) => {
  switch (status) {
    case "Chờ xử lý":
      return 'bg-yellow-100 text-yellow-800';
    case 'Đang cho mượn':
      return 'bg-green-100 text-green-800';
    case 'Đã trả':
      return 'bg-blue-100 text-blue-800';
    case 'Trễ hạn':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'Chờ xử lý':
      return 'Chờ xử lý';
    case 'Đang cho mượn':
      return 'Đang mượn';
    case 'Đã trả':
      return 'Đã trả';
    case 'Trễ hạn':
      return 'Quá hạn';
    default:
      return 'Không xác định';
  }
};

const handleCancel = async (lendingId) => {
  try {
    if (confirm('Bạn có chắc muốn hủy đơn mượn này?')) {
      const response = await LendingService.deleteLending(lendingId);
      console.log(response);
      
      if (response.data.statusCode === 0) {
        toast.success('Hủy đơn mượn thành công');
        await fetchLendingHistory();
      } else {
        throw new Error(response.data.message);
      }
    }
  } catch (error) {
    console.error('Error cancelling lending:', error);
    toast.error(error.message || 'Không thể hủy đơn mượn');
  }
};

const fetchLendingHistory = async () => {
  try {
    // TODO: Gọi API lấy lịch sử mượn sách
    const MaDocGia = JSON.parse(localStorage.getItem('user')).user.MaID;
    const response = await LendingService.getLendingsByMaDocGia(MaDocGia);
    console.log(response);
    
    lendings.value = response;
    console.log(lendings.value);
    
  } catch (error) {
    console.error('Error fetching lending history:', error);
    toast.error('Không thể tải lịch sử mượn sách');
  }
};

// Hàm định dạng tiền Việt Nam
const formatCurrency = (amount) => {
  if (!amount) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

onMounted(() => {
  fetchLendingHistory();
});
</script> 