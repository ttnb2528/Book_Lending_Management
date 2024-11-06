import express from "express";
import PublisherController from "../controller/publisher.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(PublisherController.createPublisher)
  .get(PublisherController.getAllPublishers);

router.get("/:id", PublisherController.getPublisherById);

router.put("/:id", PublisherController.updatePublisher);

router.delete("/:id", PublisherController.deletePublisher);

export default router;
