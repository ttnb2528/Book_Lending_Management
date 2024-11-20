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
    </div>
  </div>
</template>

<script>
import LendingForm from "@/components/LendingForm.vue";
import lendingService from "@/services/lending.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    Sidebar,
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
        const res = await lendingService.createLending(lending);
        console.log(res);
        if(res.data.statusCode === 0) {
          // this.message = "Thêm Phiếu mượn thành công!";
          this.$router.push({ name: "Lending", query: { success: "add" } });
        } else {
          toast.error(res.data.message)
        }
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
