<template>
  <form @submit.prevent="submitStaff" class="mt-4 space-y-2">
    <div
      class="rounded-md shadow-sm space-y-4"
      v-for="(label, key) in fields"
      :key="key"
    >
      <div v-if="key !== 'password' || !isEditing">
        <label :for="key" class="font-medium text-gray-700">{{ label }}</label>

        <!-- Sử dụng select cho trường Phái -->
        <select
          v-if="key === 'Phai'"
          v-model="staffLocal[key]"
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
          v-model="staffLocal[key]"
          :readonly="isEditing && key === 'MaID'"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />

        <!-- Sử dụng select cho trường ChucVu -->
        <select
          v-else-if="key === 'ChucVu'"
          v-model="staffLocal[key]"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        >
          <option value="" disabled>Chọn chức vụ</option>
          <option value="Thủ thư">Thủ thư</option>
          <option value="Nhân viên quản lý sách">Nhân viên quản lý sách</option>
          <option value="Nhân viên lưu thông sách">
            Nhân viên lưu thông sách
          </option>
          <option value="Nhân viên xử lý tài liệu">
            Nhân viên xử lý tài liệu
          </option>
          <option value="Nhân viên chăm sóc bạn đọc">
            Nhân viên chăm sóc bạn đọc
          </option>
        </select>

        <!-- Các trường khác vẫn giữ input text như cũ -->
        <input
          v-else
          :name="key"
          type="text"
          v-model="staffLocal[key]"
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
    staff: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
  },
  emits: ["submit:staff", "cancel"],
  data() {
    return {
      staffLocal: { ...this.staff, role: "staff" },
      fields: {
        ...(this.isEditing && { MaID: "Mã NV" }),
        Ten: "Tên",
        email: "Email",
        ...(this.isEditing ? {} : { password: "Mật khẩu" }), // Thêm trường mật khẩu khi không chỉnh sửa
        Phai: "Giới tính",
        NgaySinh: "Ngày Sinh",
        DiaChi: "Địa chỉ",
        DienThoai: "Điện thoại",
        ChucVu: "Chức vụ",
      },
      errors: {},
    };
  },
  methods: {
    validateFields() {
      this.errors = {};
      if (!this.staffLocal.Ten) {
        this.errors.Ten = "Tên không được bỏ trống";
      }
      if (!this.staffLocal.email) {
        this.errors.email = "Email không được bỏ trống";
      }
      if (!this.staffLocal.Phai) {
        this.errors.Phai = "Giới tính không được bỏ trống";
      }
      if (!this.staffLocal.NgaySinh) {
        this.errors.NgaySinh = "Ngày sinh không được bỏ trống";
      }
      if (!this.staffLocal.DiaChi) {
        this.errors.DiaChi = "Địa chỉ không được bỏ trống";
      }
      if (!this.staffLocal.DienThoai) {
        this.errors.DienThoai = "Điện thoại không được bỏ trống";
      }
      if (!this.staffLocal.ChucVu) {
        this.errors.ChucVu = "Chức vụ không được bỏ trống";
      }
      return Object.keys(this.errors).length === 0;
    },
    submitStaff() {
      if (this.validateFields()) {
        this.$emit("submit:staff", this.staffLocal);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
  },
};
</script>
