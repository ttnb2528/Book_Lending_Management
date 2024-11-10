<template>
  <div
    class="min-h-screen w-full bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-900">
          Đăng nhập
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Quản lý mượn trả sách
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="email-address" class="sr-only">Địa chỉ email</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Địa chỉ email"
              v-model="email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
              v-model="password"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-green-600 focus:ring-green-500 border-green-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-green-900">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-green-600 hover:text-green-500">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <KeyIcon
                class="h-5 w-5 text-green-500 group-hover:text-green-400"
                aria-hidden="true"
              />
            </span>
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { KeyIcon } from "@heroicons/vue/24/solid";
import AuthService from "@/services/auth.service.js";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  router.push({ name: "Dashboard" });
}

const handleSubmit = async () => {
  try {
    const data = { email: email.value, password: password.value };
    const response = await AuthService.login(data);
    localStorage.setItem(
      "user",
      JSON.stringify({
        token: response.data.token,
        user: response.data.user,
      })
    );
    router.push({ name: "Dashboard" });
  } catch (error) {
    console.log("Đăng nhập thất bại:", error);
  }
};
</script>
