import { createWebHistory, createRouter } from "vue-router";
import LoginPage from "@/views/LoginPage.vue";
import Book from "@/views/Book.vue";
import AddBook from "@/views/AddBook.vue";
import EditBook from "@/views/EditBook.vue";
import Publisher from "@/views/Publisher.vue";
import Lending from "@/views/Lending.vue";
import Staff from "@/views/Staff.vue";
import User from "@/views/User.vue";
import AddStaff from "@/views/AddStaff.vue";
import EditStaff from "@/views/EditStaff.vue";
import AddUser from "@/views/AddUser.vue";
import EditUser from "@/views/EditUser.vue";
import AddPublisher from "@/views/AddPublisher.vue";
import EditPublisher from "@/views/EditPublisher.vue";
import AddLending from "@/views/AddLending.vue";
import EditLending from "@/views/EditLending.vue";

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: Book,
  },

  {
    path: "/book",
    name: "Book",
    component: Book,
  },

  {
    path: "/addBook",
    name: "AddBook",
    component: AddBook,
  },

  {
    path: "/editBook/:id",
    name: "EditBook",
    component: EditBook,
    props: true,
  },

  {
    path: "/publisher",
    name: "Publisher",
    component: Publisher,
  },

  {
    path: "/addPublisher",
    name: "AddPublisher",
    component: AddPublisher,
  },

  {
    path: "/editPublisher/:id",
    name: "EditPublisher",
    component: EditPublisher,
    props: true,
  },

  {
    path: "/staff",
    name: "Staff",
    component: Staff,
  },

  {
    path: "/addStaff",
    name: "AddStaff",
    component: AddStaff,
  },

  {
    path: "/editStaff/:id",
    name: "EditStaff",
    component: EditStaff,
    props: true,
  },

  {
    path: "/user",
    name: "User",
    component: User,
  },

  {
    path: "/addUser",
    name: "AddUser",
    component: AddUser,
  },

  {
    path: "/editUser/:id",
    name: "EditUser",
    component: EditUser,
    props: true,
  },

  {
    path: "/lending",
    name: "Lending",
    component: Lending,
  },

  {
    path: "/addLending",
    name: "AddLending",
    component: AddLending,
  },

  {
    path: "/editLending/:id",
    name: "EditLending",
    component: EditLending,
    props: true,
  },

  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
