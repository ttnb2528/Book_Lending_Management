import { createWebHistory, createRouter } from "vue-router";

// Admin
import LoginPage from "@/views/Auth/LoginPage.vue";
import Book from "@/views/Admin/Book.vue";
import AddBook from "@/views/Admin/AddBook.vue";
import EditBook from "@/views/Admin/EditBook.vue";
import Publisher from "@/views/Admin/Publisher.vue";
import Lending from "@/views/Admin/Lending.vue";
import Staff from "@/views/Admin/Staff.vue";
import User from "@/views/Admin/User.vue";
import AddStaff from "@/views/Admin/AddStaff.vue";
import EditStaff from "@/views/Admin/EditStaff.vue";
import AddUser from "@/views/Admin/AddUser.vue";
import EditUser from "@/views/Admin/EditUser.vue";
import AddPublisher from "@/views/Admin/AddPublisher.vue";
import EditPublisher from "@/views/Admin/EditPublisher.vue";
import AddLending from "@/views/Admin/AddLending.vue";
import EditLending from "@/views/Admin/EditLending.vue";

// User
import Login from "@/views/Client/Login.vue";
import Register from "@/views/Client/Register.vue";
import HomePage from "@/views/Client/HomePage.vue";

// temp
import Default from "@/views/Default.vue";
import Profile from "@/views/Admin/Profile.vue";
import EditProfile from "@/views/Admin/EditProfile.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },

  {
    path: "/login",
    name: "UserLogin",
    component: Login,
  },

  {
    path: "/register",
    name: "UserRegister",
    component: Register,
  },

  {
    path: "/admin/book",
    name: "Dashboard",
    component: Book,
    // beforeEnter: (to, from, next) => {
    //   if (
    //     localStorage.getItem("user") &&
    //     (JSON.parse(localStorage.getItem("user")).user.role === "admin" ||
    //       JSON.parse(localStorage.getItem("user")).user.role === "staff")
    //   ) {
    //     next();
    //   } else if (localStorage.getItem("user")) {
    //     next({ name: "HomePage" });
    //   } else {
    //     next({ name: "UserLogin" });
    //   }
    // },
  },

  {
    path: "/admin/addBook",
    name: "AddBook",
    component: AddBook,
  },

  {
    path: "/admin/editBook/:id",
    name: "EditBook",
    component: EditBook,
    props: true,
  },

  {
    path: "/admin/publisher",
    name: "Publisher",
    component: Publisher,
  },

  {
    path: "/admin/addPublisher",
    name: "AddPublisher",
    component: AddPublisher,
  },

  {
    path: "/admin/editPublisher/:id",
    name: "EditPublisher",
    component: EditPublisher,
    props: true,
  },

  {
    path: "/admin/staff",
    name: "Staff",
    component: Staff,
  },

  {
    path: "/admin/addStaff",
    name: "AddStaff",
    component: AddStaff,
  },

  {
    path: "/admin/editStaff/:id",
    name: "EditStaff",
    component: EditStaff,
    props: true,
  },

  {
    path: "/admin/user",
    name: "User",
    component: User,
  },

  {
    path: "/admin/addUser",
    name: "AddUser",
    component: AddUser,
  },

  {
    path: "/admin/editUser/:id",
    name: "EditUser",
    component: EditUser,
    props: true,
  },

  {
    path: "/admin/lending",
    name: "Lending",
    component: Lending,
  },

  {
    path: "/admin/addLending",
    name: "AddLending",
    component: AddLending,
  },

  {
    path: "/admin/editLending/:id",
    name: "EditLending",
    component: EditLending,
    props: true,
  },

  {
    path: "/admin/login",
    name: "AdminLogin",
    component: LoginPage,
  },

  {
    path: "/admin/profile",
    name: "AdminProfile",
    component: Profile,
  },

  {
    path: "/admin/profile/edit/:id",
    name: "AdminEditProfile",
    component: EditProfile,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
