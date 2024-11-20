<template>
  <form @submit.prevent="submitUser" class="mt-4 space-y-2">
    <div
      class="rounded-md shadow-sm space-y-4"
      v-for="(label, key) in fields"
      :key="key"
    >
      <div v-if="key !== 'password' || !isEditing">
        <label :for="key" class="font-medium text-gray-700">{{ label }}</label>

        <select
          v-if="key === 'Phai'"
          v-model="userLocal[key]"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        >
          <option value="" disabled>Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>

        <!-- Sử dụng date picker cho trường NgaySinh -->
        <input
          v-else-if="key === 'NgaySinh'"
          type="date"
          v-model="userLocal[key]"
          :readonly="isEditing && key === 'MaID'"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />

        <!-- Các trường khác vẫn giữ input text như cũ -->
        <input
          v-else
          :name="key"
          type="text"
          v-model="userLocal[key]"
          :readonly="isEditing && key === 'MaID'"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />

        <div v-if="errors[key]" class="text-xs text-red-600 mt-1">
          {{ errors[key] }}
        </div>
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
    user: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
  },
  emits: ["submit:user", "cancel"],
  data() {
    return {
      userLocal: { ...this.user, role: "user" },
      fields: {
        ...(this.isEditing && { MaID: "Mã DG" }),
        Ten: "Tên",
        email: "Email",
        ...(this.isEditing ? {} : { password: "Mật khẩu" }),
        Phai: "Giới tính",
        NgaySinh: "Ngày Sinh",
        DiaChi: "Địa chỉ",
        DienThoai: "Điện thoại",
      },
      errors: {},
    };
  },
  methods: {
    validateFields() {
      this.errors = {};
      if (!this.userLocal.Ten) {
        this.errors.Ten = "Tên không được bỏ trống";
      }
      if (!this.userLocal.email) {
        this.errors.email = "Email không được bỏ trống";
      }
      if (!this.userLocal.Phai) {
        this.errors.Phai = "Giới tính không được bỏ trống";
      }
      if (!this.userLocal.NgaySinh) {
        this.errors.NgaySinh = "Ngày sinh không được bỏ trống";
      }
      if (!this.userLocal.DiaChi) {
        this.errors.DiaChi = "Địa chỉ không được bỏ trống";
      }
      if (!this.userLocal.DienThoai) {
        this.errors.DienThoai = "Điện thoại không được bỏ trống";
      }
      return Object.keys(this.errors).length === 0;
    },
    submitUser() {
      if (this.validateFields()) {
        this.userLocal.email = this.userLocal.email.trim();
        this.$emit("submit:user", this.userLocal);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
  },
};
</script>
