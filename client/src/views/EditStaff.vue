<template>
  <div
    class="min-h-screen bg-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-4">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-green-900">
          Chỉnh sửa Nhân viên
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Nhập thông tin chi tiết của Nhân viên
        </p>
      </div>

      <StaffForm
        v-if="staff"
        :isEditing="true"
        :staff="staff"
        @submit:staff="updateStaff"
        @cancel="cancelEditStaff"
      />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import StaffForm from "@/components/StaffForm.vue";
import userService from "@/services/user.service.js";

export default {
  components: {
    StaffForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      message: "",
      staff: null,
    };
  },
  methods: {
    async getStaffId(id) {

      try {
        this.staff = await userService.getUser(id);
        // console.log(this.staff);
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },

    async updateStaff(data) {
      try {
        await userService.updateUser(this.staff.MaID, data);
        this.message = "Cập nhật nhân viên thành công!";
        this.$router.push({ name: "Staff" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelEditStaff() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "Staff" });
      }
    },
  },
  created() {
    this.getStaffId(this.id);
  },
};
</script>
