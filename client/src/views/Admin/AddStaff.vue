<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div
        class="min-h-screen bg-green-50 flex justify-center py-4 px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-md w-full space-y-4 overflow-y-auto scroll-container">
          <div>
            <h2 class="text-center text-3xl font-extrabold text-green-900">
              Thêm Nhân viên mới
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của nhân viên
            </p>
          </div>
          <StaffForm
            :staff="{}"
            @submit:staff="addStaff"
            @cancel="cancelAddStaff"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StaffForm from "@/components/StaffForm.vue";
// import staffService from "@/services/staff.service.js";
import userService from "@/services/user.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";

export default {
  components: {
    Sidebar,
    StaffForm,
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addStaff(staff) {
      try {
        await userService.createUser(staff);
        this.message = "Thêm nhân viên thành công!";
        this.$router.push({ name: "Staff" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelAddStaff() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Staff" });
      }
    },
  },
};
</script>

<style scoped>
.scroll-container {
  max-height: 90vh;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: rgba(72, 187, 120, 0.5) rgba(229, 231, 235, 0.3);
}

/* Tùy chỉnh thanh cuộn cho các trình duyệt Webkit (Chrome, Safari) */
.scroll-container::-webkit-scrollbar {
  width: 4px;
}

.scroll-container::-webkit-scrollbar-track {
  background: rgba(229, 231, 235, 0.3);
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(72, 187, 120, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(72, 187, 120, 0.3);
}

.scroll-container:hover::-webkit-scrollbar-thumb {
  background-color: rgba(72, 187, 120, 0.8);
}
</style>
