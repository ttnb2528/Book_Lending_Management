<template>
  <header class="bg-green-600 text-white p-4">
    <div class="container mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <BookOpenIcon class="h-10 w-10" />
        <h1 class="text-2xl font-bold">TTNB</h1>
      </div>
      <div class="flex-1 max-w-xl mx-4">
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          class="w-full px-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <nav>
        <ul class="flex space-x-6 items-center">
          <li><a href="#" class="hover:underline">Trang chủ</a></li>
          <li><a href="#" class="hover:underline">Lịch sử mượn</a></li>
          <li class="relative">
            <div
              @click="toggleUserMenu"
              class="flex items-center space-x-2 cursor-pointer hover:text-green-100"
            >
              <UserIcon class="h-5 w-5" />
              <span>{{ userName }}</span>
            </div>

            <!-- Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-800 hover:bg-green-50"
              >
                <div class="flex items-center">
                  <UserCircleIcon class="h-5 w-5 mr-2 text-green-600" />
                  Thông tin người dùng
                </div>
              </router-link>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-50"
              >
                <div class="flex items-center">
                  <ArrowRightOnRectangleIcon
                    class="h-5 w-5 mr-2 text-green-600"
                  />
                  Đăng xuất
                </div>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import {
  BookOpenIcon,
  UserIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const isUserMenuOpen = ref(false);
const router = useRouter();
const userName = ref("");

// Toggle user menu
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
};

// Handle logout
const handleLogout = () => {
  try {
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!", {
      autoClose: 3000,
      position: toast.POSITION.TOP_CENTER,
    });
    router.push({ name: "UserLogin" });
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Có lỗi xảy ra khi đăng xuất", {
      autoClose: 3000,
      position: toast.POSITION.TOP_CENTER,
    });
  }
};

// Close menu when clicking outside
const handleClickOutside = (event) => {
  const userMenu = document.querySelector(".relative");
  if (userMenu && !userMenu.contains(event.target)) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  const data = JSON.parse(localStorage.getItem("user"));
  if (!data) {
    router.push({ name: "UserLogin" });
  } else {
    userName.value = data.user.Ten || "Người dùng";
  }
});

onBeforeUnmount(() => {
  // Remove click outside listener
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.relative {
  position: relative;
}

/* Add smooth transition for dropdown */
.absolute {
  transition: all 0.2s ease-in-out;
}
</style>
