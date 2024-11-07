<template>
  <div
    class="min-h-screen bg-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-4 scroll-container">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-green-900">
          Thêm Phiếu mượn mới
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Nhập thông tin chi tiết của Phiếu mượn
        </p>
      </div>
      <LendingForm
        :lending="{}"
        @submit:lending="addLending"
        @cancel="cancelAddLending"
      />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import LendingForm from "@/components/LendingForm.vue";
import lendingService from "@/services/lending.service.js";

export default {
  components: {
    LendingForm,
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addLending(lending) {
      try {
        await lendingService.createLending(lending);
        this.message = "Thêm Phiếu mượn thành công!";
        this.$router.push({ name: "Lending" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelAddLending() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Lending" });
      }
    },
  },
};
</script>
