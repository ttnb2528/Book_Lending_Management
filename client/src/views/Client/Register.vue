<template>
  <div
    class="min-h-screen w-full bg-green-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-green-900">
          Đăng ký tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-green-600">
          Tạo tài khoản để mượn sách
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm space-y-4">
          <div>
            <label for="name" class="sr-only">Họ và tên</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Họ và tên"
              v-model="name"
            />
          </div>

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
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
              v-model="password"
            />
          </div>

          <div>
            <label for="password-confirm" class="sr-only"
              >Xác nhận mật khẩu</label
            >
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              required
              class="appearance-none rounded-md relative block w-full px-3 py-2 border border-green-300 placeholder-green-500 text-green-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
              v-model="passwordConfirm"
            />
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
            Đăng ký
          </button>
        </div>
      </form>

      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Đã có tài khoản?
          <router-link
            to="/login"
            class="font-medium text-green-600 hover:text-green-500"
          >
            Đăng nhập ngay
          </router-link>
        </p>
      </div>

      <div
        v-if="error"
        class="mt-4 text-center text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-2"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { KeyIcon } from "@heroicons/vue/24/solid";
import UserService from "@/services/user.service.js";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");
const error = ref("");
const role = "user";

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
  router.push({ name: "HomePage" });
}

const handleSubmit = async () => {
  try {
    error.value = "";

    if (password.value !== passwordConfirm.value) {
      error.value = "Mật khẩu xác nhận không khớp";
      return;
    }

    const data = {
      Ten: name.value,
      email: email.value,
      password: password.value,
      role: role,
    };

    const response = await UserService.createUser(data);
    console.log(response);

    if (response.data.statusCode === 0) {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });
      router.push({ name: "UserLogin" });
    } else {
      throw new Error(response.data.message || "Đăng ký thất bại");
    }
  } catch (err) {
    // console.log(err);
    error.value = err.message;
  }
};
</script>
