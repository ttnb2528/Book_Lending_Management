<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <div class="container mx-auto px-6 py-8">
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-green-900 text-center">
              Thêm sách mới
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của cuốn sách
            </p>
          </div>
          <BookForm
            :publishers="publishers"
            :book="{}"
            @submit:book="handleBookSubmit"
            @cancel="handleCancel"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/layout/Admin/Sidebar.vue";
import BookForm from "@/components/BookForm.vue";
import BookService from "@/services/book.service";
import PublisherService from "@/services/publisher.service";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    components: {
        Sidebar,
        BookForm,
    },
    data() {
        return {
            publishers: [],
            message: "",
        };
    },
    async created() {
        try {
            this.publishers = await PublisherService.getPublishers();
        } catch (error) {
            console.error("Error fetching publishers:", error);
            toast.error("Không thể tải danh sách nhà xuất bản");
        }
    },
    methods: {
        async handleBookSubmit(book) {
            try {
                console.log("Submitting book data:", book);

                const bookData = {
                    ...book,
                    DonGia: parseFloat(book.DonGia),
                    SoQuyen: parseInt(book.SoQuyen),
                    NamXuatBan: parseInt(book.NamXuatBan),
                    AnhSach: book.AnhSach || null,
                    MoTa: book.MoTa || null
                };

                console.log("Processed book data:", bookData);

                const response = await BookService.create(bookData);
                console.log("Server response:", response);

                if (response.statusCode === 0) {
                    toast.success(response.message);
                    this.$router.push({ name: "Dashboard" });
                } else {
                    throw new Error(response.message || "Có lỗi xảy ra khi thêm sách");
                }
            } catch (error) {
                console.error("Error submitting book:", error);
                toast.error(error.message || "Có lỗi xảy ra khi thêm sách");
            }
        },
        handleCancel() {
            this.$router.push({ name: "Dashboard" });
        },
    },
};
</script>
