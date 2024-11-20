<template>
  <header class="bg-green-600 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <BookOpenIcon class="h-10 w-10" />
        <h1 class="text-2xl font-bold">TTNB</h1>
      </div>
      <div class="flex-1 max-w-xl mx-4 relative">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Tìm kiếm sách..."
            class="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <!-- Search Results Dropdown -->
          <div
            v-if="showResults && filteredBooks.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            <router-link
              v-for="book in filteredBooks"
              :key="book.MaSach"
              :to="`/book/${book.MaSach}`"
              class="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200"
              @click="clearSearch"
            >
              <!-- Book Image -->
              <div class="w-12 h-12 flex-shrink-0">
                <img
                  v-if="book.AnhSach"
                  :src="getImageUrl(book.AnhSach)"
                  :alt="book.TenSach"
                  class="w-full h-full object-cover rounded"
                />
                <BookOpenIcon
                  v-else
                  class="w-full h-full text-green-600"
                />
              </div>
              <!-- Book Info -->
              <div class="ml-4 flex-1">
                <h4 class="text-gray-900 font-medium">{{ book.TenSach }}</h4>
                <p class="text-gray-600 text-sm">{{ book.TacGia }}</p>
              </div>
            </router-link>
          </div>
          <!-- No Results Message -->
          <div
            v-if="showResults && searchQuery && filteredBooks.length === 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 text-center text-gray-600"
          >
            Không tìm thấy kết quả
          </div>
        </div>
      </div>
      <nav>
        <ul class="flex space-x-6">
          <li><router-link to="/" class="hover:underline">Trang chủ</router-link></li>
          <li><router-link to="/history" class="hover:underline">Lịch sử mượn</router-link></li>
          <!-- User Dropdown -->
          <li class="relative" ref="userMenuRef">
            <button 
              @click="toggleUserMenu"
              class="flex items-center space-x-2 cursor-pointer hover:text-green-100"
            >
              <UserIcon class="h-5 w-5" />
              <span>{{ userName }}</span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-show="isUserMenuOpen"
              class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-800 hover:bg-green-50"
                @click="isUserMenuOpen = false"
              >
                Thông tin cá nhân
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-50"
              >
                Đăng xuất
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted,  onUnmounted } from 'vue';
import { BookOpenIcon, UserIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/solid';
import { useRouter } from 'vue-router';
import bookService from '@/services/book.service';
import { toast } from 'vue3-toastify';

const router = useRouter();
const searchQuery = ref('');
const showResults = ref(false);
const userName = ref('');
const isUserMenuOpen = ref(false);
let searchTimeout = null;
const userMenuRef = ref(null);

// Lấy danh sách sách từ HomePage
const books = ref([]);
const getBooks = async () => {
  try {
    const response = await bookService.getBooks();
    books.value = response;
  } catch (error) {
    console.error('Error getting books:', error);
  }
};

// Filter books dựa trên searchQuery
const filteredBooks = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase().trim();
  return books.value.filter(book => 
    book.TenSach?.toLowerCase().includes(query) ||
    book.TacGia?.toLowerCase().includes(query) ||
    book.MaSach?.toLowerCase().includes(query)
  ).slice(0, 5); // Giới hạn 5 kết quả
});

const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    showResults.value = !!searchQuery.value;
  }, 300);
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `http://localhost:3000${path}`;
};

const clearSearch = () => {
  searchQuery.value = '';
  showResults.value = false;
};

// Toggle user menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Handle logout
const handleLogout = () => {
  try {
    localStorage.removeItem('user');
    toast.success('Đăng xuất thành công', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Có lỗi xảy ra khi đăng xuất', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
  }
};

// Handle click outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  getBooks(); // Lấy danh sách sách khi component được mount
  
  const userData = JSON.parse(localStorage.getItem('user'));
  if (userData) {
    userName.value = userData.user.Ten;
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.relative {
  position: relative;
}

/* Add smooth transition for dropdown */
.absolute {
  transition: all 0.2s ease-in-out;
}
</style>
