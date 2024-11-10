<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div
        class="min-h-screen bg-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-4">
          <div>
            <h2 class="text-center text-3xl font-extrabold text-green-900">
              Thêm sách mới
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của cuốn sách
            </p>
          </div>
          <BookForm
            :publishers="publishers"
            :book="{}"
            @submit:book="addBook"
            @cancel="cancelAddBook"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service.js";
import publisherService from "@/services/publisher.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";

export default {
  components: {
    Sidebar,
    BookForm,
  },
  data() {
    return {
      message: "",
      publishers: [],
    };
  },
  methods: {
    async addBook(book) {
      try {
        await BookService.createBook(book);
        this.message = "Thêm sách thành công!";
        this.$router.push({ name: "Dashboard" }); // Điều hướng đến danh sách sách
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    async getPublisher() {
      try {
        this.publishers = await publisherService.getPublishers();
      } catch (error) {
        console.error("Error while getting publisher:", error);
      }
    },
    cancelAddBook() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Dashboard" });
      }
    },
  },
  created() {
    this.getPublisher();
  },
};
</script>
