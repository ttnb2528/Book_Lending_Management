<template>
  <!-- Main Content Area -->
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
    <div class="container mx-auto px-6 py-8">
      <!-- Books Management -->
      <div
        v-if="activeSection === 'Quản lý Mượn sách'"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="p-4 flex justify-between items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm Phiếu mượn..."
            class="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <router-link :to="{ name: 'AddLending' }">
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm Phiếu mượn
            </button>
          </router-link>
        </div>
        <div class="mt-4">
          <table class="min-w-full bg-white">
            <thead
              class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
            >
              <tr>
                <th class="py-3 px-6 text-left">Mã PM</th>
                <th class="py-3 px-6 text-left">Mã DG</th>
                <th class="py-3 px-6 text-left">Mã Sách</th>
                <th class="py-3 px-6 text-left">Ngày mượn</th>
                <th class="py-3 px-6 text-left">Ngày trả</th>
                <th class="py-3 px-6 text-left">Tình trạng</th>
                <th class="py-3 px-6 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr
                v-for="lending in lendings"
                :key="lending._id"
                class="border-b border-gray-200 hover:bg-gray-100"
              >
                <td class="py-3 px-6 text-left whitespace-nowrap">
                  {{ lending.MaPhieuMuon }}
                </td>
                <td class="py-3 px-6 text-left">{{ lending.userInfo.MaID }}</td>
                <td class="py-3 px-6 text-left">
                  {{ lending.bookInfo.MaSach }}
                </td>
                <td class="py-3 px-6 text-left">{{ lending.NgayMuon }}</td>
                <td class="py-3 px-6 text-left">{{ lending.NgayTra }}</td>
                <td class="py-3 px-6 text-left">{{ lending.TinhTrang }}</td>
                <td class="py-3 px-6 text-left">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editLending(lending.MaPhieuMuon)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="deleteLending(lending.MaPhieuMuon)"
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
import LendingService from "@/services/lending.service.js";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  activeSection: String,
});

// Sample data (replace with actual data from your backend)
const lendings = ref([]);

const getAllLendings = async () => {
  try {
    const response = await LendingService.getLendings();
    lendings.value = response;
    // console.log(response);
    console.log(lendings.value);
  } catch (error) {
    console.error("Error while getting books:", error);
  }
};

const editLending = (id) => {
  console.log("Edit lending with id:", id);
  router.push({ name: "EditLending", params: { id } });
};

const deleteLending = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa?")) {
    try {
      await LendingService.deleteLending(id);
      lendings.value = lendings.value.filter(
        (lending) => lending.MaPhieuMuon !== id
      );
    } catch (error) {
      console.error("Error while deleting lending:", error);
    }
  }
};

onMounted(() => {
  getAllLendings();
});
</script>
