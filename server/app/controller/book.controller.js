import ApiError from "../api-error.js";
import BookService from "../services/book.service.js";
import MongoDB from "../util/mongodb.util.js";

class BookController {
  static async createBook(req, res) {
    try {
      console.log("Received request body:", req.body);

      const bookService = new BookService();
      const response = await bookService.createBook(req.body);

      console.log("Create book response:", response);

      return res.json(response);
    } catch (error) {
      console.error("Error in createBook controller:", error);
      return res.status(500).json({
        statusCode: -1,
        message: "Có lỗi xảy ra khi thêm sách",
        error: error.message,
      });
    }
  }

  static async getAllBooks(req, res, next) {
    try {
      const bookService = new BookService();
      const books = await bookService.getAllBooks();
      return res.json(books);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting all books")
      );
    }
  }

  static async getBookById(req, res, next) {
    const { id } = req.params;
    try {
      const bookService = new BookService();
      const book = await bookService.getBookById(id);
      return res.json(book);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the book")
      );
    }
  }

  static async updateBook(req, res, next) {
    const { id } = req.params;
    try {
      const bookService = new BookService();
      const response = await bookService.updateBookById(id, req.body);
      return res.json(response);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while updating the book")
      );
    }
  }

  static async deleteBook(req, res, next) {
    const { id } = req.params;
    try {
      const bookService = new BookService();
      const response = await bookService.deleteBookById(id);
      return res.json(response);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while deleting the book")
      );
    }
  }

  static async searchBook(req, res, next) {
    const { search } = req.query;
    try {
      const bookService = new BookService();
      const books = await bookService.searchBook(search);
      return res.json(books);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while searching for books")
      );
    }
  }
}

export default BookController;
