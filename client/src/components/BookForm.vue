<template>
  <form @submit.prevent="submitBook" class="mt-4 space-y-2">
    <div
      class="rounded-md shadow-sm space-y-4"
      v-for="(label, key) in fields"
      :key="key"
    >
      <div v-if="key !== 'MaNXB'">
        <label :for="key" class="font-medium text-gray-700">{{ label }}</label>
        <input
          :name="key"
          type="text"
          v-model="bookLocal[key]"
          :readonly="isEditing && key === 'MaSach'"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />
        <div v-if="errors[key]" class="text-xs text-red-600 mt-1">
          {{ errors[key] }}
        </div>
      </div>

      <div v-else>
        <label for="MaNXB" class="font-medium text-gray-700">{{ label }}</label>
        <select
          v-model="bookLocal.MaNXB"
          class="appearance-none block w-full px-3 py-2 border border-green-300 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option disabled value="">Chọn nhà xuất bản</option>
          <option
            v-for="publisher in publishers"
            :key="publisher.MaNXB"
            :value="publisher.MaNXB"
          >
            {{ publisher.TenNXB }}
          </option>
        </select>
        <div v-if="errors.MaNXB" class="text-xs text-red-600 mt-1">
          {{ errors.MaNXB }}
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
// import * as yup from "yup";
// import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  props: {
    book: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
    publishers: { type: Array, default: () => [] },
  },
  emits: ["submit:book", "cancel"],
  data() {
    return {
      bookLocal: { ...this.book },
      fields: {
        ...(this.isEditing && { MaSach: "Mã sách" }),
        TenSach: "Tên sách",
        DonGia: "Đơn giá",
        SoQuyen: "Số quyển",
        NamXuatBan: "Năm xuất bản",
        MaNXB: "Nhà xuất bản",
        TacGia: "Tác giả",
      },
      errors: {}, // Object lưu lỗi cho từng trường
    };
  },
  methods: {
    validateFields() {
      this.errors = {};

      // Kiểm tra từng trường và gán lỗi nếu không hợp lệ
      if (!this.bookLocal.TenSach) {
        this.errors.TenSach = "Tên sách không được bỏ trống";
      }
      if (
        !this.bookLocal.DonGia ||
        isNaN(this.bookLocal.DonGia) ||
        this.bookLocal.DonGia <= 0
      ) {
        this.errors.DonGia = "Đơn giá phải là số dương";
      }
      if (
        !this.bookLocal.SoQuyen ||
        isNaN(this.bookLocal.SoQuyen) ||
        this.bookLocal.SoQuyen < 1
      ) {
        this.errors.SoQuyen = "Số quyển phải lớn hơn 0";
      }
      if (!this.bookLocal.NamXuatBan || isNaN(this.bookLocal.NamXuatBan)) {
        this.errors.NamXuatBan = "Năm xuất bản phải hợp lệ";
      }
      if (!this.bookLocal.MaNXB) {
        this.errors.MaNXB = "Nhà xuất bản không được bỏ trống";
      }
      if (!this.bookLocal.TacGia) {
        this.errors.TacGia = "Tác giả không được bỏ trống";
      }

      // Trả về true nếu không có lỗi
      return Object.keys(this.errors).length === 0;
    },
    submitBook() {
      // Chỉ gửi dữ liệu nếu tất cả trường đều hợp lệ
      if (this.validateFields()) {
        this.$emit("submit:book", this.bookLocal);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
  },
};
</script>
