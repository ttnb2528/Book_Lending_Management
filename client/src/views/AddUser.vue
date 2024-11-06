<template>
  <div
    class="min-h-screen bg-green-50 flex justify-center py-4 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-4 overflow-y-auto scroll-container">
      <div>
        <h2 class="text-center text-3xl font-extrabold text-green-900">
          Thêm Độc Giả mới
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Nhập thông tin chi tiết của Độc Giả
        </p>
      </div>
      <UserForm :user="{}" @submit:user="addUser" @cancel="cancelAddUser" />
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
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async addUser(user) {
      try {
        await userService.createUser(user);
        this.message = "Thêm độc giả thành công!";
        this.$router.push({ name: "User" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelAddUser() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "User" });
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
