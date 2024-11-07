<template>
  <form @submit.prevent="submitLending" class="mt-4 space-y-2">
    <div
      class="rounded-md shadow-sm space-y-4"
      v-for="(label, key) in fields"
      :key="key"
    >
      <div>
        <label :for="key" class="font-medium text-gray-700">{{ label }}</label>

        <!-- Date Picker for NgayMuon and NgayTra -->
        <input
          v-if="key === 'NgayMuon'"
          :name="key"
          type="date"
          v-model="lendingLocal[key]"
          class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
        />

        <!-- Searchable Input for MaDocGia and MaSach -->
        <div
          v-else-if="key === 'MaDocGia' || key === 'MaSach'"
          class="relative"
        >
          <input
            :name="key"
            type="text"
            v-model="lendingLocal[key]"
            @input="filterSuggestions(key)"
            @focus="showSuggestions[key] = true"
            @blur="hideSuggestions(key)"
            class="appearance-none relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
          />
          <ul
            v-if="showSuggestions[key] && suggestions[key].length"
            class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto"
          >
            <li
              v-for="suggestion in suggestions[key]"
              :key="suggestion"
              @mousedown="selectSuggestion(key, suggestion)"
              class="cursor-pointer py-1 px-3 hover:bg-green-100"
            >
              {{ suggestion }}
            </li>
          </ul>
        </div>

        <!-- Default Input for other fields -->
        <input
          v-else
          :name="key"
          type="text"
          v-model="lendingLocal[key]"
          :readonly="isEditing && key === 'MaPhieuMuon'"
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
import bookService from "@/services/book.service.js";
import userService from "@/services/user.service";
export default {
  props: {
    lending: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
  },
  emits: ["submit:lending", "cancel"],
  data() {
    return {
      lendingLocal: { ...this.lending },
      fields: {
        ...(this.isEditing && { MaPhieuMuon: "Mã PM" }),
        NgayMuon: "Ngày mượn",
        // NgayTra: "Ngày trả",
        MaDocGia: "Mã ĐG",
        MaSach: "Mã sách",
      },
      errors: {},
      suggestions: {
        MaDocGia: [],
        MaSach: [],
      },
      showSuggestions: {
        MaDocGia: false,
        MaSach: false,
      },
      allReaders: [],
      allBooks: [],
    };
  },
  mounted() {
    this.getAllUsers();
    this.getAllBooks();
    if (this.lending.userInfo && this.lending.userInfo.MaID) {
      this.lendingLocal.MaDocGia = this.lending.userInfo.MaID;
    }
    if (this.lending.bookInfo && this.lending.bookInfo.MaSach) {
      this.lendingLocal.MaSach = this.lending.bookInfo.MaSach;
    }
    console.log(this.lending);
  },

  methods: {
    validateFields() {
      this.errors = {};
      if (!this.lendingLocal.NgayMuon) {
        this.errors.NgayMuon = "Ngày mượn không được bỏ trống";
      }
      //   if (!this.lendingLocal.NgayTra) {
      //     this.errors.NgayTra = "Ngày trả không được bỏ trống";
      //   }
      //   if (!this.lendingLocal.TinhTrang) {
      //     this.errors.TinhTrang = "Tình trạng không được bỏ trống";
      //   }
      if (!this.lendingLocal.MaDocGia) {
        this.errors.MaDocGia = "Mã ĐG không được bỏ trống";
      }
      if (!this.lendingLocal.MaSach) {
        this.errors.MaSach = "Mã sách không được bỏ trống";
      }
      return Object.keys(this.errors).length === 0;
    },

    hideSuggestions(key) {
      this.showSuggestions[key] = false;
    },

    async getAllUsers() {
      try {
        const response = await userService.getUsers({ role: "user" });
        this.allReaders = response.data.map((user) => user.MaID);
      } catch (error) {
        console.error(error);
      }
    },

    async getAllBooks() {
      try {
        const response = await bookService.getBooks();
        this.allBooks = response.map((book) => book.MaSach);
      } catch (error) {
        console.error(error);
      }
    },

    submitLending() {
      if (this.validateFields()) {
        this.$emit("submit:lending", this.lendingLocal);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
    filterSuggestions(key) {
      const source = key === "MaDocGia" ? this.allReaders : this.allBooks;
      this.suggestions[key] = source.filter((item) =>
        item.toLowerCase().includes(this.lendingLocal[key].toLowerCase())
      );
    },
    selectSuggestion(key, suggestion) {
      this.lendingLocal[key] = suggestion;
      this.showSuggestions[key] = false;
    },
  },
};
</script>
