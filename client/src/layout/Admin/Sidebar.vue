<template>
  <aside class="w-64 bg-green-800 text-white">
    <div class="p-4 bg-green-900">
      <h1 class="text-2xl font-semibold">Library Admin</h1>
    </div>
    <nav class="mt-4">
      <router-link
        v-for="item in filteredSidebarListItem"
        :key="item.name"
        :to="item.path"
        class="flex items-center px-4 py-3 text-sm hover:bg-green-700 transition-colors duration-200"
      >
        <template v-if="item.icon">
          <component :is="item.icon" class="h-5 w-5 mr-3" />
        </template>
        {{ item.name }}
      </router-link>
    </nav>
    <div class="mt-auto p-4">
      <router-link to="/admin/profile">
        <button
          class="w-full flex items-center text-left py-2 px-4 hover:bg-green-700 transition-colors duration-200"
        >
          <UserCircleIcon class="h-5 w-5 mr-3" />
          Thông tin cá nhân
        </button>
      </router-link>
      <button
        class="w-full flex items-center text-left py-2 px-4 hover:bg-green-700 transition-colors duration-200"
        @click="logout"
      >
        <LogoutIcon class="h-5 w-5 mr-3" />
        Đăng xuất
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
} from "@heroicons/vue/24/outline";

import {
  BookOpenIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
} from "@heroicons/vue/24/outline";
import authService from "@/services/auth.service.js";

const router = useRouter();

const menuItems = [
  { name: "Quản lý Sách", path: "/admin/book", icon: BookOpenIcon },
  { name: "Quản lý Nhân viên", path: "/admin/staff", icon: UsersIcon },
  { name: "Quản lý Độc giả", path: "/admin/user", icon: UserGroupIcon },
  { name: "Quản lý Mượn sách", path: "/admin/lending", icon: DocumentTextIcon },
  {
    name: "Quản lý Nhà xuất bản",
    path: "/admin/publisher",
    icon: BuildingOfficeIcon,
  },
];

const filteredSidebarListItem = ref([]);

const checkAuth = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  if (!userData) {
    router.push('/admin/login');
    return false;
  }

  if(userData.user.role === 'admin') {
    filteredSidebarListItem.value = menuItems;
  } else if (userData.user.role === 'staff') {
    filteredSidebarListItem.value = menuItems.filter((item, index) => index !== 1);
  } else {
    router.push('/login');
    localStorage.removeItem('user');
    return false;
  }
  return true;
};

const logout = () => {
  authService.logout();
  localStorage.removeItem("user");
  router.push({ name: "AdminLogin" });
};

onMounted(() => {
  checkAuth();
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!checkAuth()) {
      next('/admin/login');
    } else {
      next();
    }
  } else {
    next();
  }
});
</script>
