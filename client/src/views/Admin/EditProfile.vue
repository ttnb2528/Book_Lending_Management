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
              Chỉnh sửa Thông tin cá nhân
            </h2>
            <p class="mt-2 text-center text-sm text-green-600">
              Nhập thông tin chi tiết của Thông tin cá nhân
            </p>
          </div>

          <ProfileForm
            v-if="profile"
            :isEditing="true"
            :profile="profile"
            @submit:profile="updateProfile"
            @cancel="cancelEditProfile"
          />
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileForm from "@/components/ProfileForm.vue";
import userService from "@/services/user.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";

export default {
  components: {
    Sidebar,
    ProfileForm,
  },
  props: {
    id: { type: String, required: true },
  },
  data() {
    return {
      message: "",
      profile: null,
    };
  },
  methods: {
    async getCurrentUser() {
      try {
        // this.profile = await userService.getCurrentUser();
        this.profile = JSON.parse(localStorage.getItem('user')).user;
        // console.log(this.staff);
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },

    async updateProfile(data) {
      try {
        await userService.updateCurrentUser(this.profile.MaID, data);
        this.message = "Cập nhật thông tin thành công!";
        this.$router.push({ name: "AdminProfile" });
      } catch (error) {
        console.error(error);
        this.message = "Lỗi: " + error.response?.data?.message || error.message;
      }
    },
    cancelEditProfile() {
      if (window.confirm("Bạn có chắc muốn thoát?")) {
        this.$router.push({ name: "AdminProfile" });
      }
    },
  },
  created() {
    this.getCurrentUser();
  },
};
</script>
