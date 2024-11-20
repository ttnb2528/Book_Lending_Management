<template>
  <form @submit.prevent="submitBook" class="mt-4">
    <div class="grid grid-cols-2 gap-4">
      <!-- Cột trái -->
      <div class="space-y-4">
        <div v-if="isEditing">
          <label for="MaSach" class="font-medium text-gray-700">Mã sách</label>
          <input
            name="MaSach"
            type="text"
            v-model="bookLocal.MaSach"
            readonly
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
        </div>

        <div>
          <label for="TenSach" class="font-medium text-gray-700"
            >Tên sách</label
          >
          <input
            name="TenSach"
            type="text"
            v-model="bookLocal.TenSach"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <div v-if="errors.TenSach" class="text-xs text-red-600 mt-1">
            {{ errors.TenSach }}
          </div>
        </div>

        <div>
          <label for="DonGia" class="font-medium text-gray-700">Đơn giá</label>
          <input
            name="DonGia"
            type="number"
            v-model="bookLocal.DonGia"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <div v-if="errors.DonGia" class="text-xs text-red-600 mt-1">
            {{ errors.DonGia }}
          </div>
        </div>

        <div>
          <label for="SoQuyen" class="font-medium text-gray-700"
            >Số quyển</label
          >
          <input
            name="SoQuyen"
            type="number"
            v-model="bookLocal.SoQuyen"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <div v-if="errors.SoQuyen" class="text-xs text-red-600 mt-1">
            {{ errors.SoQuyen }}
          </div>
        </div>
      </div>

      <!-- Cột phải -->
      <div class="space-y-4">
        <div>
          <label for="NamXuatBan" class="font-medium text-gray-700"
            >Năm xuất bản</label
          >
          <input
            name="NamXuatBan"
            type="number"
            v-model="bookLocal.NamXuatBan"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <div v-if="errors.NamXuatBan" class="text-xs text-red-600 mt-1">
            {{ errors.NamXuatBan }}
          </div>
        </div>

        <div>
          <label for="MaNXB" class="font-medium text-gray-700"
            >Nhà xuất bản</label
          >
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

        <div>
          <label for="TheLoai" class="font-medium text-gray-700"
            >Thể loại</label
          >
          <select
            v-model="bookLocal.TheLoai"
            class="appearance-none block w-full px-3 py-2 border border-green-300 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option disabled value="">Chọn thể loại</option>
            <option value="novel">Tiểu thuyết</option>
            <option value="comic">Truyện tranh</option>
            <option value="dictionary">Từ điển</option>
            <option value="textbook">Sách giáo khoa</option>
            <option value="reference">Sách tham khảo</option>
            <option value="other">Khác</option>
          </select>
          <div v-if="errors.TheLoai" class="text-xs text-red-600 mt-1">
            {{ errors.TheLoai }}
          </div>
        </div>

        <div>
          <label for="TacGia" class="font-medium text-gray-700">Tác giả</label>
          <input
            name="TacGia"
            type="text"
            v-model="bookLocal.TacGia"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <div v-if="errors.TacGia" class="text-xs text-red-600 mt-1">
            {{ errors.TacGia }}
          </div>
        </div>

        <div>
          <label for="AnhSach" class="font-medium text-gray-700"
            >Ảnh sách</label
          >
          <div class="mt-1 flex items-center space-x-4">
            <input type="file" @change="handleImageChange" class="w-full" />
            <!-- Hiển thị ảnh preview với kích thước nhỏ hơn -->
            <div v-if="bookLocal.AnhSach" class="h-20 w-20 relative">
              <img
                :src="getImageUrl(bookLocal.AnhSach)"
                class="h-full w-full object-cover rounded"
                alt="Book preview"
              />
            </div>
          </div>
          <div v-if="errors.AnhSach" class="text-xs text-red-600 mt-1">
            {{ errors.AnhSach }}
          </div>
        </div>
      </div>
    </div>

    <!-- Mô tả - full width -->
    <div class="mt-4">
      <label for="MoTa" class="font-medium text-gray-700">Mô tả</label>
      <textarea
        name="MoTa"
        v-model="bookLocal.MoTa"
        rows="3"
        class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
      ></textarea>
    </div>

    <!-- Buttons -->
    <div class="flex space-x-4 mt-4">
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
import UploadService from "@/services/upload.service";

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
        TheLoai: "Thể loại",
        TacGia: "Tác giả",
        AnhSach: "Ảnh sách",
        MoTa: "Mô tả",
      },
      errors: {}, // Object lưu lỗi cho từng trường
    };
  },
  methods: {
    getImageUrl(path) {
      // Nếu path đã là URL đầy đủ thì trả về luôn
      if (path?.startsWith("http")) {
        return path;
      }
      // Nếu không, thêm base URL của server
      return `http://localhost:3000${path}`;
    },

    async handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Tạo preview URL cho file được chọn
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);

        // Kiểm tra kích thước file (giới hạn 5MB)
        if (file.size > 5 * 1024 * 1024) {
          this.errors.AnhSach = "Kích thước file không được vượt quá 5MB";
          return;
        }

        // Kiểm tra định dạng file
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
          this.errors.AnhSach = "Chỉ chấp nhận file ảnh (JPG, PNG, GIF)";
          return;
        }

        try {
          const formData = new FormData();
          formData.append("file", file);

          console.log("Uploading file:", file.name); // Debug log

          const response = await UploadService.uploadImage(formData);
          console.log("Upload response received:", response); // Debug log

          if (response.filePath) {
            this.bookLocal.AnhSach = response.filePath;
            this.errors.AnhSach = null;
            console.log("Image path saved:", this.bookLocal.AnhSach);
          } else {
            throw new Error("No file path received from server");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          this.errors.AnhSach = "Không thể tải ảnh lên: " + error.message;
        }
      }
    },

    async submitBook() {
      console.log("Form submitted");
      if (this.validateFields()) {
        try {
          console.log("Book data to submit:", this.bookLocal);
          this.bookLocal.TenSach = this.bookLocal.TenSach.trim();
          this.$emit("submit:book", this.bookLocal);
        } catch (error) {
          console.error("Error submitting form:", error);
          this.errors.submit = "Có lỗi xảy ra khi gửi dữ liệu";
        }
      } else {
        console.log("Validation failed", this.errors);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
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
      if (!this.bookLocal.AnhSach) {
        this.errors.AnhSach = "Ảnh sách không được bỏ trống";
      }
      if (!this.bookLocal.MoTa) {
        this.errors.MoTa = "Mô tả không được bỏ trống";
      }
      if (!this.bookLocal.TheLoai) {
        this.errors.TheLoai = "Thể loại không được bỏ trống";
      }

      // Trả về true nếu không có lỗi
      return Object.keys(this.errors).length === 0;
    },
  },
};
</script>
