<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <Header />
    <div class="container flex-grow mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-center text-green-800 mb-6">
          Phiếu mượn sách
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Ảnh sách bên trái -->
          <div class="flex flex-col items-center space-y-4">
            <div class="w-full aspect-square bg-green-50 rounded-lg flex items-center justify-center p-4">
              <img
                v-if="book.AnhSach"
                :src="getImageUrl(book.AnhSach)"
                :alt="book.TenSach"
                class="max-h-full max-w-full object-contain"
              />
              <BookOpenIcon v-else class="h-32 w-32 text-green-600" />
            </div>
            <!-- Thông tin sách cơ bản -->
            <div class="w-full text-center">
              <h3 class="font-semibold text-lg">{{ book.TenSach }}</h3>
              <p class="text-gray-600">{{ book.TacGia }}</p>
            </div>
          </div>

          <!-- Form mượn sách bên phải -->
          <div class="md:col-span-2">
            <!-- Thông tin sách -->
            <div class="mb-6 p-4 bg-green-50 rounded-lg">
              <h2 class="font-semibold text-lg mb-3">Thông tin sách</h2>
              <div class="grid grid-cols-2 gap-4">
                <p><span class="font-medium">Thể loại:</span> {{ book.TheLoai }}</p>
                <p><span class="font-medium">Số quyển còn:</span> {{ book.SoQuyen }}</p>
                <p><span class="font-medium">Giá mượn:</span> {{ book.DonGia }} đ</p>
                <p><span class="font-medium">Nhà xuất bản:</span> {{ book.publisherInfo?.TenNXB }}</p>
              </div>
            </div>

            <!-- Form mượn sách -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">
                  Ngày trả
                </label>
                <input
                  type="date"
                  v-model="returnDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  :min="minDate"
                  :max="maxDate"
                  required
                />
                <p class="mt-1 text-sm text-gray-500">
                  Thời gian mượn tối đa 30 ngày ({{ maxDate }})
                </p>
                <p v-if="dateError" class="mt-1 text-sm text-red-500">
                  {{ dateError }}
                </p>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="router.back()"
                  class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  :disabled="!!dateError"
                >
                  Xác nhận mượn sách
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BookOpenIcon } from '@heroicons/vue/24/solid';
import BookService from '@/services/book.service';
import Header from "@/layout/Client/Header.vue";
import Footer from "@/layout/Client/Footer.vue";
import { toast } from 'vue3-toastify';
import lendingService from '@/services/lending.service.js';

const route = useRoute();
const router = useRouter();
const book = ref({});
const returnDate = ref('');
const dateError = ref('');

// Tính ngày hiện tại
const today = new Date();
const minDate = today.toISOString().split('T')[0];

// Tính ngày tối đa có thể mượn (30 ngày từ hiện tại)
const maxDate = computed(() => {
  const max = new Date(today);
  max.setDate(max.getDate() + 30);
  return max.toISOString().split('T')[0];
});

// Kiểm tra ngày trả hợp lệ
const validateReturnDate = () => {
  const selectedDate = new Date(returnDate.value);
  const maxAllowedDate = new Date(maxDate.value);
  const minAllowedDate = new Date(minDate);

  if (selectedDate < minAllowedDate) {
    dateError.value = 'Ngày trả không được nhỏ hơn ngày hiện tại';
    return false;
  }

  if (selectedDate > maxAllowedDate) {
    dateError.value = 'Thời gian mượn không được quá 30 ngày';
    return false;
  }

  dateError.value = '';
  return true;
};

// Watch for changes in return date
watch(returnDate, validateReturnDate);

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) {
    return path;
  }
  return `http://localhost:3000${path}`;
};

const fetchBookDetails = async () => {
  try {
    const response = await BookService.getBook(route.params.id);
    if (response) {
      book.value = response;
    } else {
      throw new Error('Không thể tải thông tin sách');
    }
  } catch (error) {
    console.error('Error fetching book details:', error);
    toast.error(error.message);
    router.push('/');
  }
};

const handleSubmit = async () => {
  if (!validateReturnDate()) {
    return;
  }

  try {
    // TODO: Gọi API mượn sách với ngày trả
    const borrowData = {
      MaSach: book.value.MaSach,
      MaDocGia: JSON.parse(localStorage.getItem('user')).user.MaID,
      NgayTra: returnDate.value,
    };
    
    console.log('Borrow data:', borrowData);
    const response = await lendingService.createLending(borrowData);
    console.log(response?.data);
    
    if(response?.data?.statusCode === 0) {
      toast.success('Đăng ký mượn sách thành công!');
      // router.push('/');
    } else {
      toast.error(response?.data?.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
    toast.error('Có lỗi xảy ra khi đăng ký mượn sách');
  }
};

onMounted(() => {
  fetchBookDetails();
  returnDate.value = today.toISOString().split('T')[0];
});
</script> 