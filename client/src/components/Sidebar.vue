<template>
  <aside class="w-64 bg-green-800 text-white">
    <div class="p-4 bg-green-900">
      <h1 class="text-2xl font-semibold">Library Admin</h1>
    </div>
    <nav class="mt-4">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center px-4 py-3 text-sm hover:bg-green-700 transition-colors duration-200',
          { 'bg-green-700': item.name === activeSection },
        ]"
        @click="$emit('update-section', item.name)"
      >
        <template v-if="item.icon">
          <component :is="item.icon" class="h-5 w-5 mr-3" />
        </template>
        {{ item.name }}
      </router-link>
    </nav>
    <div class="mt-auto p-4">
      <button
        @click="$emit('profile')"
        class="w-full flex items-center text-left py-2 px-4 hover:bg-green-700 transition-colors duration-200"
      >
        <UserCircleIcon class="h-5 w-5 mr-3" />
        Thông tin cá nhân
      </button>
      <button
        @click="$emit('logout')"
        class="w-full flex items-center text-left py-2 px-4 hover:bg-green-700 transition-colors duration-200"
      >
        <LogoutIcon class="h-5 w-5 mr-3" />
        Đăng xuất
      </button>
    </div>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon as LogoutIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  activeSection: {
    type: String,
    required: true,
  },
});

import {
  BookOpenIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
} from "@heroicons/vue/24/outline";

const menuItems = [
  { name: "Quản lý Sách", path: "/book", icon: BookOpenIcon },
  { name: "Quản lý Nhân viên", path: "/staff", icon: UsersIcon },
  { name: "Quản lý Độc giả", path: "/user", icon: UserGroupIcon },
  { name: "Quản lý Mượn sách", path: "/lending", icon: DocumentTextIcon },
  {
    name: "Quản lý Nhà xuất bản",
    path: "/publisher",
    icon: BuildingOfficeIcon,
  },
];

const emit = defineEmits(["update-section", "profile", "logout"]);
</script>
