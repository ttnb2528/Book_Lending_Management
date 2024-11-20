import express from "express";
import LendingController from "../controller/lending.controller.js";

const router = express.Router();

router
  .route("/")
  .post(LendingController.createLending)
  .get(LendingController.getAllLendings);

router.route("/:id").get(LendingController.getLendingById);

router.route("/lendings/:MaDocGia").get(LendingController.getLendingsByMaDocGia);

router.route("/:id").put(LendingController.updateLendingById);

router.route("/:id").delete(LendingController.deleteLendingById);

export default router;
