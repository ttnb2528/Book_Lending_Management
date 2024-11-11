import ApiError from "../api-error.js";
import BookService from "../services/book.service.js";
import MongoDB from "../util/mongodb.util.js";

class BookController {
  static async createBook(req, res, next) {
    const { TenSach, DonGia, SoQuyen, NamXuatBan, MaNXB, TacGia } = req.body;
    if (!TenSach || !DonGia || !SoQuyen || !NamXuatBan || !MaNXB || !TacGia) {
      return next(new ApiError(400, "All fields are required"));
    }
    try {
      const bookService = new BookService(MongoDB.client);
      const response = await bookService.createBook({
        TenSach,
        DonGia,
        SoQuyen,
        NamXuatBan,
        MaNXB,
        TacGia,
      });
      if (response.statusCode === 0) {
        return res.status(201).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while creating the book")
      );
    }
  }

  static async getAllBooks(req, res, next) {
    try {
      const bookService = new BookService(MongoDB.client);
      const books = await bookService.getAllBooks();
      return res.status(200).json(books);
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
      const bookService = new BookService(MongoDB.client);
      const book = await bookService.getBookById(id);
      return res.status(200).json(book);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the book")
      );
    }
  }

  static async updateBook(req, res, next) {
    const { id } = req.params;
    const {
      TenSach,
      DonGia,
      SoQuyen,
      NamXuatBan,
      MaNXB,
      TacGia,
      ...otherField
    } = req.body;
    if (!TenSach || !DonGia || !SoQuyen || !NamXuatBan || !MaNXB || !TacGia) {
      return next(new ApiError(400, "All fields are required"));
    }
    try {
      const bookService = new BookService(MongoDB.client);
      const response = await bookService.updateBookById(id, {
        TenSach,
        DonGia,
        SoQuyen,
        NamXuatBan,
        MaNXB,
        TacGia,
        ...otherField,
      });
      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
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
      const bookService = new BookService(MongoDB.client);
      const response = await bookService.deleteBookById(id);
      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while deleting the book")
      );
    }
  }

  static async searchBook(req, res, next) {
    const { search } = req.query;

    // console.log(search);
    
    // if (!search) {
    //     return res.status(400).json({ error: "Missing search parameter" });
    // }
    // try {
    //     const bookService = new BookService(MongoDB.client);
    //     const books = await bookService.searchBook(search);
    //     return res.status(200).json(books);
    // } catch (error) {
    //     console.error(error);
    //     return next(new ApiError(500, "An error occurred while searching for books"));
    // }
}
}

export default BookController;
