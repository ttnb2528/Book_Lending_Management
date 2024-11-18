<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <div class="container mx-auto px-6 py-8">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-green-900 text-center">
              Chỉnh sửa sách
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Cập nhật thông tin chi tiết của cuốn sách
            </p>
          </div>
          <BookForm
            v-if="book"
            :isEditing="true"
            :book="book"
            :publishers="publishers"
            @submit:book="updateBook"
            @cancel="cancelEditBook"
          />
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
        toast.error("Không thể tải thông tin sách", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },

    async getPublisher() {
      try {
        this.publishers = await publisherService.getPublishers();
      } catch (error) {
        console.error("Error while getting publisher:", error);
        toast.error("Không thể tải danh sách nhà xuất bản", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },

    async updateBook(data) {
      try {
        const response = await BookService.updateBook(this.book.MaSach, data);
        console.log("Update response:", response);

        if (response.statusCode === 0) {
          toast.success("Cập nhật sách thành công!", {
            autoClose: 3000,
            position: toast.POSITION.TOP_RIGHT,
          });
          this.$router.push({ name: "Dashboard" });
        } else {
          throw new Error(
            response.message || "Có lỗi xảy ra khi cập nhật sách"
          );
        }
      } catch (error) {
        console.error("Error updating book:", error);
        toast.error(error.message || "Có lỗi xảy ra khi cập nhật sách", {
          autoClose: 3000,
          position: toast.POSITION.TOP_RIGHT,
        });
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
