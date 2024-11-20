<template>
  <div class="min-h-screen flex flex-col bg-green-50">
    <Header />
    <div class="container flex-grow mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl text-center mb-5 font-bold text-green-800">
            Thông tin cá nhân
          </h1>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-sm font-bold text-green-800">
            Mã độc giả: {{ userInfo.MaID }}
          </h1>
          
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Chỉnh sửa
          </button>
        </div>

        <!-- Chế độ xem -->
        <div v-if="!isEditing" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Họ và tên</p>
              <p class="text-lg">{{ userInfo.Ten }}</p>
            </div>

            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Email</p>
              <p class="text-lg">{{ userInfo.email }}</p>
            </div>

            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Phái</p>
              <p class="text-lg">{{ userInfo.Phai }}</p>
            </div>

            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Ngày sinh</p>
              <p class="text-lg">{{ userInfo.NgaySinh }}</p>
            </div>

            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Số điện thoại</p>
              <p class="text-lg">{{ userInfo.DienThoai || 'Chưa cập nhật' }}</p>
            </div>

            <div class="border-b pb-4">
              <p class="text-sm text-gray-500">Địa chỉ</p>
              <p class="text-lg">{{ userInfo.DiaChi || 'Chưa cập nhật' }}</p>
            </div>
          </div>
        </div>

        <!-- Chế độ chỉnh sửa -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              v-model="editedInfo.Ten"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              v-model="editedInfo.email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm "
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Phái</label>
            <select
              v-model="editedInfo.Phai"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              type="date"
              v-model="editedInfo.NgaySinh"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Điện thoại</label>
            <input
              type="tel"
              v-model="editedInfo.DienThoai"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <textarea
              v-model="editedInfo.DiaChi"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            ></textarea>
          </div>

          <!-- Trong phần form chỉnh sửa, sửa lại phần password -->
          <div class="pt-4 border-t">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h3>
            <p class="text-sm text-gray-500 mb-4">
              Để trống nếu không muốn thay đổi mật khẩu
            </p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                <input
                  type="password"
                  v-model="editedInfo.newPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  v-model="editedInfo.confirmPassword"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Header from "@/layout/Client/Header.vue";
import Footer from "@/layout/Client/Footer.vue";
import UserService from "@/services/user.service";
import { toast } from 'vue3-toastify';

const router = useRouter();
const isEditing = ref(false);
const userInfo = ref({
  MaID: '',
  Ten: '',
  email: '',
  Phai: '',
  NgaySinh: '',
  DienThoai: '',
  DiaChi: ''
});
const editedInfo = ref({});

// Lấy thông tin user từ localStorage
const getUserInfo = async () => {
  // const userData = JSON.parse(localStorage.getItem('user'));
  const res = await UserService.getCurrentUser();
  
  if (res) {
    userInfo.value = { ...res };
  } else {
    router.push('/login');
  }
};

// Bắt đầu chỉnh sửa
const startEditing = () => {
  editedInfo.value = { 
    ...userInfo.value,
    NgaySinh: userInfo.value.NgaySinh ? new Date(userInfo.value.NgaySinh).toISOString().split('T')[0] : ''
  };
  isEditing.value = true;
};

// Hủy chỉnh sửa
const cancelEdit = () => {
  isEditing.value = false;
  editedInfo.value = {};
};

// Xử lý cập nhật thông tin
const handleSubmit = async () => {
  try {
    // Kiểm tra mật khẩu nếu có nhập
    if (editedInfo.value.newPassword || editedInfo.value.confirmPassword) {
      if (editedInfo.value.newPassword !== editedInfo.value.confirmPassword) {
        toast.error('Mật khẩu mới không khớp');
        return;
      }
    }

    const formattedData = {
      ...editedInfo.value,
      NgaySinh: editedInfo.value.NgaySinh ? new Date(editedInfo.value.NgaySinh).toISOString() : null,
      // Chỉ gửi password mới nếu có thay đổi
      ...(editedInfo.value.newPassword && {
        newPassword: editedInfo.value.newPassword
      })
    };

    // Xóa các trường không cần thiết
    delete formattedData.confirmPassword;
    delete formattedData.password;

    const response = await UserService.updateCurrentUser(userInfo.value.MaID, formattedData);
    console.log(response);
    
    
    if (response?.data?.statusCode === 0) {
    
      const { newPassword, ...updateData } = formattedData;
    
      // Cập nhật state
      userInfo.value = { ...updateData };
      
      toast.success('Cập nhật thông tin thành công');
      isEditing.value = false;
    } else {
      throw new Error(response?.data?.message);
    }


  
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
    
    toast.error(error.message || 'Có lỗi xảy ra khi cập nhật thông tin');
  }
};

onMounted(() => {
  getUserInfo();
});
</script>