<template>
  <form @submit.prevent="submitProfile" class="mt-4 space-y-2">
    <div
      class="rounded-md shadow-sm space-y-4"
      v-for="(label, key) in fields"
      :key="key"
    >
      <div>
        <label :for="key" class="font-medium text-gray-700">{{ label }}</label>
        <input
          :name="key"
          type="text"
          v-model="profileLocal[key]"
          :readonly="(isEditing && key === 'MaID') || key === 'ChucVu'"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />
      </div>
    </div>

    <div class="flex space-x-4">
      <button
        type="submit"
        class="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Lưu
      </button>
      <button
        type="button"
        @click="cancelForm"
        class="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Thoát
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    profile: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
  },
  emits: ["submit:profile", "cancel"],
  data() {
    // Đặt mật khẩu trống khi chỉnh sửa
    const profileLocal = { ...this.profile };
    profileLocal.password = ""; // Mật khẩu sẽ luôn trống khi bắt đầu chỉnh sửa

    return {
      profileLocal,
      fields: {
        ...(this.isEditing && { MaID: "Mã ID" }),
        email: "Email",
        Ten: "Tên",
        Phai: "Phái",
        NgaySinh: "Ngày sinh",
        DiaChi: "Địa chỉ",
        DienThoai: "Số điện thoại",
        ChucVu: "Chức vụ",
        password: "Mật khẩu",
      },
    };
  },
  methods: {
    submitProfile() {
      // Chỉ gửi mật khẩu nếu người dùng đã nhập giá trị
      const profileToSubmit = { ...this.profileLocal };
      if (!profileToSubmit.password) {
        delete profileToSubmit.password; // Xóa password nếu không có giá trị
      }

      // Gửi dữ liệu đã sửa đổi (nếu có mật khẩu sẽ gửi, không có sẽ không gửi)
      this.$emit("submit:profile", profileToSubmit);
    },
    cancelForm() {
      this.$emit("cancel");
    },
  },
};
</script>
