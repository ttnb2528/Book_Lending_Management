import express from "express";
import StaffController from "../controller/staff.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(StaffController.createStaff)
  .get(StaffController.getAllStaffs);

router.route("/:id").get(StaffController.getStaffById);

router.route("/:id").put(StaffController.updateStaff);

router.route("/:id").delete(StaffController.deleteStaff);

export default router;
