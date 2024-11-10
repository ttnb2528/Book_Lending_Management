import { createWebHistory, createRouter } from "vue-router";
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

// temp
import Default from "@/views/Default.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Default,
  },

  {
    path: "/admin/book",
    name: "Dashboard",
    component: Book,
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
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
