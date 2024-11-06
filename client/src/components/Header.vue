<template>
  <header class="bg-white shadow-sm z-10">
    <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">{{ title }}</h1>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  title: String,
});
</script>
