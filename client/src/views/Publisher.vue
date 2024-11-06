<template>
  <!-- Main Content Area -->
  <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
    <div class="container mx-auto px-6 py-8">
      <!-- Publishers Management -->
      <div
        v-if="activeSection === 'Quản lý Nhà xuất bản'"
        class="bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div class="p-4 flex justify-between items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm nhà xuất bản..."
            class="flex-grow p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <router-link :to="{ name: 'AddPublisher' }">
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Thêm NXB
            </button>
          </router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white">
            <thead
              class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal"
            >
              <tr>
                <th class="py-3 px-6 text-left w-1/6">Mã NXB</th>
                <th class="py-3 px-6 text-left w-1/3">Tên NXB</th>
                <th class="py-3 px-6 text-left w-1/3">Địa chỉ</th>
                <th class="py-3 px-6 text-center w-1/6">Thao tác</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm">
              <tr
                v-for="publisher in publisher"
                :key="publisher._id"
                class="border-b border-gray-200 hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td class="py-4 px-6 whitespace-nowrap">
                  {{ publisher.MaNXB }}
                </td>
                <td class="py-4 px-6">{{ publisher.TenNXB }}</td>
                <td class="py-4 px-6">{{ publisher.DiaChi }}</td>
                <td class="py-4 px-6 text-center">
                  <div class="flex items-center justify-center space-x-3">
                    <button
                      @click="editPublisher(publisher.MaNXB)"
                      class="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="deletePublisher(publisher.MaNXB)"
                      class="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
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
import publisherService from "@/services/publisher.service";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  activeSection: String,
});

const publisher = ref([]);

const getAllPublishers = async () => {
  try {
    const response = await publisherService.getPublishers();
    publisher.value = response;
  } catch (error) {
    console.error("Error while getting publisher:", error);
  }
};

const editPublisher = (id) => {
  router.push({ name: "EditPublisher", params: { id } });
};

const deletePublisher = async (id) => {
  if (window.confirm("Bạn có chắc muốn xóa?")) {
    try {
      await publisherService.deletePublisher(id);
      getAllPublishers();
    } catch (error) {
      console.error("Error while deleting publisher:", error);
    }
  }
};

onMounted(() => {
  getAllPublishers();
});
</script>
