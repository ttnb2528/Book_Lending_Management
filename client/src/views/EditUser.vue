<template>
  <div
    class="min-h-screen bg-green-50 flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-4">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-green-900">
          Chỉnh sửa Độc Giả
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Nhập thông tin chi tiết của Độc Giả
        </p>
      </div>

      <UserForm
        v-if="user"
        :isEditing="true"
        :user="user"
        @submit:user="updateUser"
        @cancel="cancelEditUser"
      />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import UserForm from "@/components/UserForm.vue";
import userService from "@/services/user.service.js";

export default {
  components: {
    UserForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      message: "",
      user: null,
    };
  },
  methods: {
    async getUserId(id) {
      try {
        this.user = await userService.getUser(id);
        // console.log(this.staff);
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },

    async updateUser(data) {
      try {
        await userService.updateUser(this.user.MaID, data);
        this.message = "Cập nhật Độc Giả thành công!";
        this.$router.push({ name: "User" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelEditUser() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "User" });
      }
    },
  },
  created() {
    this.getUserId(this.id);
  },
};
</script>
