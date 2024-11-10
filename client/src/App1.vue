<template>
  <div class="flex h-screen w-full bg-gray-100">
    <Sidebar
      :activeSection="activeSection"
      @update-section="setActiveSection"
      @profile="handleProfile"
      @logout="handleLogout"
    />
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header :title="activeSection" />
      <router-view :activeSection="activeSection" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";

const route = useRoute();
const router = useRouter();

const activeSection = ref("");

const menuItems = [
  { name: "Quản lý Sách", path: "/book" },
  { name: "Quản lý Nhân viên", path: "/staff" },
  { name: "Quản lý Độc giả", path: "/user" },
  { name: "Quản lý Mượn sách", path: "/lending" },
  { name: "Quản lý Nhà xuất bản", path: "/publisher" },
];

// Đặt `activeSection` dựa trên đường dẫn hiện tại
const setActiveSectionFromRoute = () => {
  const currentItem = menuItems.find((item) => item.path === route.path);
  activeSection.value = currentItem ? currentItem.name : "Quản lý Sách";
};

onMounted(setActiveSectionFromRoute);
watch(route, setActiveSectionFromRoute);

const setActiveSection = (section) => {
  activeSection.value = section;
};

const handleProfile = () => {
  console.log("Navigate to profile management");
};

const handleLogout = () => {
  localStorage.removeItem("user");
  router.push({ name: "Login" });
};
</script>
