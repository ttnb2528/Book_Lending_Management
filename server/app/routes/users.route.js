import express from "express";
import UsersController from "../controller/users.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Sử dụng phương thức handleCreateUser từ UserController
router.route("/").post(UsersController.createUser);

router.post("/UserByRole", UsersController.getAllUsersByRole);

router.post("/auth", UsersController.loginUser);

router.post("/logout", UsersController.logoutUser);

router.get("/profile", UsersController.getCurrentUser);

router.get("/:id", UsersController.getUserById);

router.put("/profile/edit/:id", UsersController.updateCurrentUser);

router.delete("/:id", UsersController.deleteUser);

router.put("/:id", UsersController.updateUser);

// // ADMIN ROLE
// router
//   .route("/:id")
//   .delete(UsersController.deleteUser)
//   .get(UsersController.getAllUsers)
//   .put(UsersController.updateUser);

export default router;
