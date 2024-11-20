<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <Header />

    <!-- Introduction -->
    <section class="bg-green-500 text-white py-12">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Chào mừng đến với Thư viện TTNB</h2>
        <p class="text-xl">
          Khám phá, mượn và đọc hàng ngàn cuốn sách từ bộ sưu tập đa dạng của
          chúng tôi.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <main class="flex-grow container mx-auto py-8 px-4">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="w-full md:w-1/4">
          <div class="bg-white rounded-lg shadow-md p-4">
            <h3 class="text-xl font-bold mb-4 pb-2 border-b-2 border-green-500">
              Thể loại
            </h3>
            <ul class="space-y-2">
              <li v-for="category in categories" :key="category.id">
                <a
                  href="#"
                  class="block p-2 rounded border border-green-200 hover:bg-green-50 hover:border-green-500 transition-colors duration-200"
                  :class="{
                    'bg-green-50 border-green-500':
                      currentCategory === category.value,
                    'text-gray-400 cursor-not-allowed': category.disabled,
                  }"
                  @click.prevent="
                    !category.disabled && setCategory(category.value)
                  "
                >
                  {{ category.name }}
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Book Grid -->
        <div class="w-full md:w-3/4">
          <div
            v-if="paginatedBooks.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="book in paginatedBooks"
              :key="book.id"
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <!-- Book Image/Icon -->
              <div 
                class="p-4 flex justify-center items-center bg-green-50 cursor-pointer"
                @click="router.push(`/book/${book.MaSach}`)"
              >
                <img
                  v-if="book.AnhSach"
                  :src="getImageUrl(book.AnhSach)"
                  :alt="book.TenSach"
                  class="h-32 w-32 object-cover hover:scale-125 transition-transform duration-300"
                />
                <BookOpenIcon v-else class="h-32 w-32 text-green-600" />
              </div>

              <!-- Book Info -->
              <div class="p-4">
                <h3 
                  class="text-lg font-semibold mb-2 cursor-pointer line-clamp-1 hover:text-green-600"
                  @click="router.push(`/book/${book.MaSach}`)"
                >
                  {{ book.TenSach }}
                </h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-1">
                  {{ book.MoTa || "Đang cập nhật mô tả..." }}
                </p>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-500">
                    Còn {{ book.SoQuyen }} quyển
                  </span>
                  <button
                    @click="handleBorrow(book)"
                    class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    :disabled="book.SoQuyen <= 0"
                  >
                    {{ book.SoQuyen > 0 ? 'Mượn sách' : 'Hết sách' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hiển thị khi không có sách -->
          <div v-else class="text-center py-8">
            <BookOpenIcon class="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p class="text-gray-600">Đang cập nhật sách cho thể loại này...</p>
          </div>

          <!-- Pagination -->
          <div
            v-if="paginatedBooks.length > 0"
            class="mt-8 flex justify-center"
          >
            <nav class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-md border"
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
                @click="goToPage(page)"
                class="px-3 py-1 rounded-md border"
                :class="
                  currentPage === page
                    ? 'bg-green-500 text-white border-green-500'
                    : 'text-green-600 border-green-300 hover:bg-green-50'
                "
              >
                {{ page }}
              </button>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-md border"
                :class="
                  currentPage === totalPages
                    ? 'text-gray-400 border-gray-200'
                    : 'text-green-600 border-green-300 hover:bg-green-50'
                "
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { BookOpenIcon } from "@heroicons/vue/24/solid";
import Header from "@/layout/Client/Header.vue";
import Footer from "@/layout/Client/Footer.vue";
import BookService from "@/services/book.service";
import { useRouter } from 'vue-router';

const currentCategory = ref("all");

// Danh sách thể loại
const categories = ref([
  { id: 1, name: "Tất cả", value: "all" },
  { id: 2, name: "Tiểu thuyết", value: "novel" },
  { id: 3, name: "Truyện tranh", value: "comic" },
  { id: 4, name: "Từ điển", value: "dictionary" },
  { id: 5, name: "Sách giáo khoa", value: "textbook" },
  { id: 6, name: "Sách tham khảo", value: "reference" },
  { id: 7, name: "Khác", value: "other" },
  { id: 8, name: "Đang cập nhật...", value: "updating", disabled: true },
]);

const books = ref([]);

const getBooks = async () => {
  const response = await BookService.getBooks();

  books.value = response;
  console.log();
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) {
    return path;
  }
  return `${import.meta.env.VITE_API_URL}${path}`;
};

const filteredBooks = computed(() => {
  if (currentCategory.value === "all") {
    return books.value;
  }
  return books.value.filter((book) => book.TheLoai === currentCategory.value);
});

// Pagination
const itemsPerPage = 6; // Số sách hiển thị trên mỗi trang
const currentPage = ref(1);

// Tính tổng số trang
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage);
});

// Lấy sách cho trang hiện tại
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBooks.value.slice(start, end);
});

// Các hàm điều hướng trang
const goToPage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// Reset trang khi thay đổi category
const setCategory = (category) => {
  currentCategory.value = category;
  currentPage.value = 1; // Reset về trang 1 khi đổi category
};

const handleBorrow = (book) => {
  if (book.SoQuyen <= 0) {
    toast.error("Sách đã hết, không thể mượn", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000
    });
    return;
  }
  router.push(`/borrow/${book.MaSach}`);
};

const router = useRouter();

onMounted(async () => {
  await getBooks();
});
</script>
