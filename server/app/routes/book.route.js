import express from "express";
import BookController from "../controller/book.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(BookController.createBook)
  .get(BookController.getAllBooks);

router.route("/:id").get(BookController.getBookById);

router.route("/:id/").put(BookController.updateBook);

router.route("/:id/").delete(BookController.deleteBook);

router.route("/search").get(BookController.searchBook);

export default router;
