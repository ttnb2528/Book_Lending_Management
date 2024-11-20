<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center px-4">
    <div class="max-w-lg w-full text-center">
      <!-- Icon -->
      <div class="mb-8">
        <ExclamationTriangleIcon class="mx-auto h-24 w-24 text-green-600" />
      </div>

      <!-- Content -->
      <h1 class="text-6xl font-bold text-green-800 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-green-700 mb-4">
        Không tìm thấy trang
      </h2>
      <p class="text-gray-600 mb-8">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>

      <!-- Action Buttons -->
      <div class="space-x-4">
        <button
          @click="goBack"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Quay lại
        </button>
        <router-link
          to="/"
          class="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors inline-block"
        >
          Về trang chủ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script> 