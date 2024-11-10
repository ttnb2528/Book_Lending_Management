<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div
        class="min-h-screen bg-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-4 scroll-container">
          <div>
            <h2 class="text-center text-3xl font-extrabold text-green-900">
              Thêm Nhà xuất bản mới
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của Nhà xuất bản
            </p>
          </div>
          <PublisherForm
            :publisher="{}"
            @submit:publisher="addPublisher"
            @cancel="cancelAddPublisher"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PublisherForm from "@/components/PublisherForm.vue";
import publisherService from "@/services/publisher.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";

export default {
  components: {
    Sidebar,
    PublisherForm,
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addPublisher(publisher) {
      try {
        await publisherService.createPublisher(publisher);
        this.message = "Thêm nhà xuất bản thành công!";
        this.$router.push({ name: "Publisher" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelAddPublisher() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Publisher" });
      }
    },
  },
};
</script>
