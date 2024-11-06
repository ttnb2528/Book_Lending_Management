<template>
  <form @submit.prevent="submitPublisher" class="mt-4 space-y-2">
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
          v-model="publisherLocal[key]"
          :readonly="isEditing && key === 'MaNXB'"
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
    publisher: { type: Object, default: () => ({}) },
    isEditing: { type: Boolean, default: false },
  },
  emits: ["submit:publisher", "cancel"],
  data() {
    return {
      publisherLocal: { ...this.publisher },
      fields: {
        ...(this.isEditing && { MaNXB: "Mã NXB" }),
        TenNXB: "Tên",
        DiaChi: "Địa chỉ",
      },
      errors: {},
    };
  },
  methods: {
    validateFields() {
      this.errors = {};
      if (!this.publisherLocal.TenNXB) {
        this.errors.TenNXB = "Tên không được bỏ trống";
      }
      if (!this.publisherLocal.DiaChi) {
        this.errors.DiaChi = "Địa chỉ không được bỏ trống";
      }
      return Object.keys(this.errors).length === 0;
    },
    submitPublisher() {
      if (this.validateFields()) {
        this.$emit("submit:publisher", this.publisherLocal);
      }
    },
    cancelForm() {
      this.$emit("cancel");
    },
  },
};
</script>
