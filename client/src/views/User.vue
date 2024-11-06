<template>
  <!-- Main Content Area -->
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
    <div class="container mx-auto px-6 py-8">
      <!-- Books Management -->
      <div
        v-if="activeSection === 'Quản lý Độc giả'"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="p-4 flex justify-between items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            class="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <!-- <router-link :to="{ name: 'AddBook' }"> -->
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Thêm Nhân viên
          </button>
          <!-- </router-link> -->
        </div>
        <div class="mt-4">
          <table class="min-w-full bg-white">
            <thead
              class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
            >
              <tr>
                <th class="py-3 px-6 text-left">Mã DG</th>
                <th class="py-3 px-6 text-left">Tên DG</th>
                <th class="py-3 px-6 text-left">Email</th>
                <th class="py-3 px-6 text-left">Giới tính</th>
                <th class="py-3 px-6 text-left">Ngày sinh</th>
                <th class="py-3 px-6 text-left">Địa chỉ</th>
                <th class="py-3 px-6 text-left">Số điện thoại</th>
                <th class="py-3 px-6 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr
                v-for="user in users"
                :key="user._id"
                class="border-b border-gray-200 hover:bg-gray-100"
              >
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  {{ user.MaID }}
                </td>
                <td class="py-3 px-6 text-left">{{ user.Ten }}</td>
                <td class="py-3 px-6 text-left">{{ user.email }}</td>
                <td class="py-3 px-6 text-left">{{ user.Phai }}</td>
                <td class="py-3 px-6 text-left">{{ user.NgaySinh }}</td>
                <td class="py-3 px-6 text-left">{{ user.DiaChi }}</td>
                <td class="py-3 px-6 text-left">
                  {{ user.DienThoai }}
                </td>
                <td class="py-3 px-6 text-left">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editUser(user.MaID)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="deleteUser(user.MaID)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import userService from "@/services/user.service.js";

const props = defineProps({
  activeSection: String,
});

// Sample data (replace with actual data from your backend)
const users = ref([]);

const getAllUsers = async () => {
  try {
    const response = await userService.getUsers({ role: "user" });
    users.value = response.data;
    console.log(users.value);
  } catch (error) {
    console.error("Error while getting books:", error);
  }
};
onMounted(() => {
  getAllUsers();
});
</script>
