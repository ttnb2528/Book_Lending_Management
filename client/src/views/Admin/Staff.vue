<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Main Content Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="container mx-auto px-6 py-8">
          <!-- Books Management -->
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="p-4 flex justify-between items-center space-x-4">
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên..."
                class="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <router-link :to="{ name: 'AddStaff' }">
                <button
                  class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Thêm Nhân viên
                </button>
              </router-link>
            </div>
            <div class="mt-4">
              <table class="min-w-full bg-white">
                <thead
                  class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
                >
                  <tr>
                    <th class="py-3 px-6 text-left">Mã NV</th>
                    <th class="py-3 px-6 text-left">Tên NV</th>
                    <th class="py-3 px-6 text-left">Email</th>
                    <th class="py-3 px-6 text-left">Giới tính</th>
                    <th class="py-3 px-6 text-left">Ngày sinh</th>
                    <th class="py-3 px-6 text-left">Địa chỉ</th>
                    <th class="py-3 px-6 text-left">Chức vụ</th>
                    <th class="py-3 px-6 text-left">Số điện thoại</th>
                    <th class="py-3 px-6 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="text-gray-600 text-sm font-light">
                  <tr
                    v-for="staff in staffs"
                    :key="staff._id"
                    class="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td class="py-3 px-6 text-left whitespace-nowrap">
                      {{ staff.MaID }}
                    </td>
                    <td class="py-3 px-6 text-left">{{ staff.Ten }}</td>
                    <td class="py-3 px-6 text-left">{{ staff.email }}</td>
                    <td class="py-3 px-6 text-left">{{ staff.Phai }}</td>
                    <td class="py-3 px-6 text-left">{{ staff.NgaySinh }}</td>
                    <td class="py-3 px-6 text-left">{{ staff.DiaChi }}</td>
                    <td class="py-3 px-6 text-left">{{ staff.ChucVu }}</td>
                    <td class="py-3 px-6 text-left">
                      {{ staff.DienThoai }}
                    </td>
                    <td class="py-3 px-6 text-left">
                      <div class="flex items-center space-x-2">
                        <button
                          @click="editStaff(staff.MaID)"
                          class="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon class="h-5 w-5" />
                        </button>
                        <button
                          @click="deleteStaff(staff.MaID)"
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
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import userService from "@/services/user.service.js";
import Sidebar from "@/layout/Admin/Sidebar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  activeSection: String,
});

// Sample data (replace with actual data from your backend)
const staffs = ref([]);

const getAllStaffs = async () => {
  try {
    const response = await userService.getUsers({ role: "staff" });
    staffs.value = response.data;
    // console.log(response);
  } catch (error) {
    console.error("Error while getting books:", error);
  }
};

const editStaff = (staffId) => {
  router.push({ name: "EditStaff", params: { id: staffId } });
};

const deleteStaff = (staffId) => {
  try {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
      userService.deleteUser(staffId);
      staffs.value = staffs.value.filter((staff) => staff.MaID !== staffId);
    }
  } catch (error) {
    console.log("Error while deleting staff:", error);
  }
};

onMounted(() => {
  getAllStaffs();
});
</script>
