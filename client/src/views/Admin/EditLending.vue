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
              Chỉnh sửa Phiếu mượn
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của Phiếu mượn
            </p>
          </div>

          <LendingForm
            v-if="lending"
            :isEditing="true"
            :lending="lending"
            @submit:lending="updateLending"
            @cancel="cancelEditLending"
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

export default {
  components: {
    Sidebar,
    LendingForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      message: "",
      lending: null,
    };
  },
  methods: {
    async getLendingId(id) {
      try {
        this.lending = await lendingService.getLending(id);
        // console.log(this.staff);
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },

    async updateLending(data) {
      try {
        await lendingService.updateLending(this.lending.MaPhieuMuon, data);
        this.message = "Cập nhật Phiếu mượn thành công!";
        this.$router.push({ name: "Lending" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelEditLending() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Lending" });
      }
    },
  },
  created() {
    this.getLendingId(this.id);
  },
};
</script>
