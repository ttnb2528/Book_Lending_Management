import express from "express";
import UserController from "../controller/user.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sử dụng phương thức handleCreateUser từ UserController
router
  .route("/")
  .post(UserController.createUser)
  .get(UserController.getAllUsers);

// router.post("/staff-reg", UserController.createStaff);

router.post("/auth", UserController.loginUser);

router.post("/logout", UserController.logoutUser);

router.get("/profile", UserController.getCurrentUser);
router.put("/profile/edit/:id", UserController.updateUser);

// ADMIN ROLE

router
  .route("/:id")
  .delete(UserController.deleteUser)
  .get(UserController.getAllUsers)
  .put(UserController.getAllUsers);

export default router;
