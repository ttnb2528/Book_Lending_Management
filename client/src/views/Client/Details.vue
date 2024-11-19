<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <!-- Header giống HomePage -->
    <Header />

    <!-- Chi tiết sách -->
    <div class="container flex-grow mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Ảnh sách -->
          <div
            class="flex justify-center items-center bg-green-50 rounded-lg p-4"
          >
            <img
              v-if="book.AnhSach"
              :src="getImageUrl(book.AnhSach)"
              :alt="book.TenSach"
              class="max-h-96 object-contain"
            />
            <BookOpenIcon v-else class="h-48 w-48 text-green-600" />
          </div>

          <!-- Thông tin sách -->
          <div class="space-y-4">
            <h1 class="text-3xl font-bold text-gray-900">{{ book.TenSach }}</h1>
            <div class="space-y-2">
              <p class="text-gray-600">
                <span class="font-semibold">Tác giả:</span> {{ book.TacGia }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Giá mượn:</span> {{ book.DonGia }} đ
              </p>

              <p class="text-gray-600">
                <span class="font-semibold">Số quyển còn:</span>
                {{ book.SoQuyen }}
              </p>
            </div>

            <div class="space-y-2 border-t pt-4">
              <h1 class="text-xl font-bold text-gray-600">
                Thông tin chi tiết
              </h1>
              <p class="text-gray-600">
                <span class="font-semibold">Năm xuất bản:</span>
                {{ book.NamXuatBan }}
              </p>

              <p class="text-gray-600">
                <span class="font-semibold">Số quyển còn:</span>
                {{ book.MaNXB }}
              </p>
              <p class="text-gray-600">
                <span class="font-semibold">Nhà xuất bản:</span>
                {{ book.publisherInfo?.TenNXB }}
              </p>
            </div>

            <div class="border-t pt-4">
              <h2 class="text-xl font-semibold mb-2">Mô tả</h2>
              <p class="text-gray-600">
                {{ book.MoTa || "Đang cập nhật mô tả..." }}
              </p>
            </div>

            <div class="pt-4">
              <button
                @click="handleBorrow"
                class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                :disabled="book.SoQuyen <= 0"
              >
                {{ book.SoQuyen > 0 ? "Mượn sách" : "Tạm hết sách" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BookOpenIcon } from "@heroicons/vue/24/solid";
import BookService from "@/services/book.service";
import { toast } from "vue3-toastify";
import Header from "@/layout/Client/Header.vue";
import Footer from "@/layout/Client/Footer.vue";
import "vue3-toastify/dist/index.css";

const route = useRoute();
const router = useRouter();
const book = ref({});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) {
    return path;
  }
  return `http://localhost:3000${path}`;
};

const fetchBookDetails = async () => {
  try {
    const response = await BookService.getBook(route.params.id);
    console.log(response);

    if (response) {
      book.value = response;
    } else {
      throw new Error("Không thể tải thông tin sách");
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    toast.error(error.message);
    router.push("/");
  }
};

const handleBorrow = () => {
  router.push(`/borrow/${book.value.MaSach}`);
};

onMounted(() => {
  fetchBookDetails();
});
</script>
