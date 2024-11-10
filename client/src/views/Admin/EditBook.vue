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
              Chỉnh sửa sách
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của cuốn sách
            </p>
          </div>
          <!-- Hiển thị BookForm khi dữ liệu sách đã được tải -->
          <BookForm
            v-if="book"
            :isEditing="true"
            :book="book"
            :publishers="publishers"
            @submit:book="updateBook"
            @cancel="cancelEditBook"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookForm from "@/components/BookForm.vue";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import BookService from "@/services/book.service.js";
import publisherService from "@/services/publisher.service.js";

export default {
  components: {
    Sidebar,
    BookForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      message: "",
      book: null,
      publishers: [],
    };
  },
  methods: {
    async getBookId(id) {
      try {
        this.book = await BookService.getBook(id);
        console.log(this.book);
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

    async updateBook(data) {
      try {
        await BookService.updateBook(this.book.MaSach, data);
        this.message = "Cập nhật sách thành công!";
        this.$router.push({ name: "Dashboard" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelEditBook() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Dashboard" });
      }
    },
  },
  created() {
    this.getBookId(this.id);
    this.getPublisher();
  },
};
</script>
