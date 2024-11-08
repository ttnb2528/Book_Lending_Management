<template>
  <!-- Main Content Area -->
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
    <div class="container mx-auto px-6 py-8">
      <!-- Books Management -->
      <div
        v-if="activeSection === 'Quản lý Sách'"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="p-4 flex justify-between items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            v-model="searchText"
            class="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <router-link :to="{ name: 'AddBook' }">
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm sách
            </button>
          </router-link>
        </div>
        <div class="mt-4">
          <table class="min-w-full bg-white">
            <thead
              class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
            >
              <tr>
                <th class="py-3 px-6 text-left">Mã sách</th>
                <th class="py-3 px-6 text-left">Tên sách</th>
                <th class="py-3 px-6 text-left">Đơn giá</th>
                <th class="py-3 px-6 text-left">Số quyển</th>
                <th class="py-3 px-6 text-left">Năm xuất bản</th>
                <th class="py-3 px-6 text-left">Nhà xuất bản</th>
                <th class="py-3 px-6 text-left">Tác giả</th>
                <th class="py-3 px-6 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr
                v-for="book in books"
                :key="book._id"
                class="border-b border-gray-200 hover:bg-gray-100"
              >
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  {{ book.MaSach }}
                </td>
                <td class="py-3 px-6 text-left">{{ book.TenSach }}</td>
                <td class="py-3 px-6 text-left">{{ book.DonGia }}</td>
                <td class="py-3 px-6 text-left">{{ book.SoQuyen }}</td>
                <td class="py-3 px-6 text-left">{{ book.NamXuatBan }}</td>
                <td class="py-3 px-6 text-left">
                  {{ book.publisherInfo.TenNXB }}
                </td>
                <td class="py-3 px-6 text-left">{{ book.TacGia }}</td>
                <td class="py-3 px-6 text-left">
                  <div class="flex items-center space-x-2">
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
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import bookService from "@/services/book.service.js";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  activeSection: String,
});

// Sample data (replace with actual data from your backend)
const books = ref([]);
const searchText = ref("");

// const bookStrings = async () => {
//   return books.value.map((book) => {
//     return Object.values(book).join(" ").toLowerCase();
//   });
// };

// const filterBooks = async () => {
//   const search = searchText.value.toLowerCase();
//   if (!search) {
//     getAllBooks();
//     return;
//   }
//   const bookString = await bookStrings();
//   books.value = books.value.filter((book, index) => {
//     return bookString[index].includes(search);
//   });

//   console.log("Book Strings:", bookString);
//   console.log("Search Text:", search);
// };

const filterBooks = async () => {
  const search = searchText.value.trim();
  if (!search) {
    // Nếu không có nội dung tìm kiếm, lấy tất cả sách
    getAllBooks();
    return;
  }

  try {
    // Gọi API với từ khóa tìm kiếm
    const response = await bookService.searchBook(search);
    // books.value = response;
    console.log("Search response:", response);
  } catch (error) {
    console.error("Error while searching books:", error);
  }
};

watch(searchText, filterBooks);

const editBook = (bookId) => {
  // Điều hướng đến trang EditBook cùng với ID sách
  // console.log(`Edit book with ID: ${bookId}`);
  router.push({ name: "EditBook", params: { id: bookId } });
};

const deleteBook = (bookId) => {
  try {
    if (window.confirm("Bạn có chắc muốn xóa sách này?")) {
      bookService.deleteBook(bookId);
      books.value = books.value.filter((book) => book.MaSach !== bookId);
    }
  } catch (error) {
    console.log("Error while deleting book:", error);
  }
};

const getAllBooks = async () => {
  try {
    const response = await bookService.getBooks();
    books.value = response;
    // console.log(response);
  } catch (error) {
    console.error("Error while getting books:", error);
  }
};
onMounted(() => {
  getAllBooks();
});
</script>
