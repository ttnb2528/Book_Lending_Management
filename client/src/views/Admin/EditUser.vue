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
    </div>
  </div>
</template>

<script>
import UserForm from "@/components/UserForm.vue";
import userService from "@/services/user.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  components: {
    Sidebar,
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
        const res = await userService.updateUser(this.user.MaID, data);
        console.log(res);
        if(res.data.statusCode === 0) { 
          this.message = "Cập nhật Độc Giả thành công!";
          this.$router.push({ name: "User", query: { success: "edit" } });
        } else {
          toast.error(res.data.message)
        }
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
