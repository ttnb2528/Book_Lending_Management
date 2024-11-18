import { ObjectId } from "mongodb";
import MongoDB from "../util/mongodb.util.js";

class BookService {
  constructor() {
    this.Book = MongoDB.client.db().collection("books");
  }

  extractUserData(payload) {
    const Book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: parseFloat(payload.DonGia),
      SoQuyen: parseInt(payload.SoQuyen),
      NamXuatBan: parseInt(payload.NamXuatBan),
      MaNXB: payload.MaNXB,
      TacGia: payload.TacGia,
      AnhSach: payload.AnhSach || null,
      MoTa: payload.MoTa || null,
    };

    return Book;
  }

  async generalMaSach() {
    const lastBook = await this.Book.find()
      .sort({ MaSach: -1 })
      .limit(1)
      .toArray();

    let newMaSach = "S0000";

    if (lastBook.length > 0) {
      const lastMaSach = lastBook[0].MaSach;
      const numberPart = parseInt(lastMaSach.slice(1));
      newMaSach = "S" + String(numberPart + 1).padStart(4, "0");
    }

    return newMaSach;
  }

  async createBook(payload) {
    try {
      console.log("Creating book with payload:", payload);

      const existingBook = await this.Book.findOne({
        TenSach: payload.TenSach
      });

      if (existingBook) {
        return {
          statusCode: 2,
          message: "Sách này đã tồn tại trong hệ thống"
        };
      }

      const Book = this.extractUserData(payload);
      Book.MaSach = await this.generalMaSach();

      const result = await this.Book.insertOne(Book);
      console.log("Insert result:", result);

      if (result.acknowledged) {
        return {
          statusCode: 0,
          message: "Thêm sách thành công",
          data: Book
        };
      } else {
        return {
          statusCode: 2,
          message: "Thêm sách thất bại"
        };
      }
    } catch (error) {
      console.error("Error in createBook:", error);
      return {
        statusCode: -1,
        message: error.message
      };
    }
  }

  async getBookById(id) {
    try {
      const book = await this.Book.aggregate([
        {
          $match: { MaSach: id }, // Tìm sách theo _id
        },
        {
          $lookup: {
            from: "publishers", // Collection chứa nhà xuất bản
            localField: "MaNXB", // Sử dụng trường ObjectId của MaNXB
            foreignField: "MaNXB", // Khóa chính trong collection publishers
            as: "publisherInfo", // Gắn thông tin nhà xuất bản vào sách
          },
        },
        {
          $unwind: "$publisherInfo", // Tách mảng thông tin nhà xuất bản thành đối tượng
        },
      ]).toArray();

      // Vì chỉ có 1 sách cần trả về, lấy phần tử đầu tiên trong mảng kết quả
      return book.length > 0 ? book[0] : null;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async getAllBooks() {
    try {
      const books = await this.Book.aggregate([
        {
          $lookup: {
            from: "publishers",
            localField: "MaNXB", // Sử dụng trường ObjectId mới
            foreignField: "MaNXB",
            as: "publisherInfo",
          },
        },
        {
          $unwind: "$publisherInfo", // Tách mảng thông tin nhà xuất bản
        },
      ]).toArray();

      return books;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async updateBookById(id, payload) {
    try {
      // Kiểm tra xem có sách nào khác (không phải sách đang sửa) có cùng tên không
      const existingBook = await this.Book.findOne({
        TenSach: payload.TenSach,
        MaSach: { $ne: id } // Loại trừ sách hiện tại
      });

      if (existingBook) {
        return {
          statusCode: 2,
          message: "Đã tồn tại sách khác có cùng tên trong hệ thống"
        };
      }

      const Book = this.extractUserData(payload);
      const res = await this.Book.updateOne({ MaSach: id }, { $set: Book });

      if (!res.acknowledged) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi cập nhật sách",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật sách thành công",
      };
    } catch (error) {
      console.error("Error in updateBookById:", error);
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async deleteBookById(id) {
    try {
      const res = await this.Book.deleteOne({ MaSach: id });

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi xóa sách",
        };
      }

      return {
        statusCode: 0,
        message: "Xóa sách thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async searchBook(query) {
    // console.log(query);
    
    try {
      const books = await this.Book.aggregate([
        {
          $lookup: {
            from: "publishers",
            localField: "MaNXB",
            foreignField: "MaNXB",
            as: "publisherInfo",
          },
        },
        {
          $unwind: "$publisherInfo",
        },
        {
          $match: {
            $or: [
              { TenSach: { $regex: query, $options: "i" } },
              { TacGia: { $regex: query, $options: "i" } },
              { "publisherInfo.TenNXB": { $regex: query, $options: "i" } },
            ],
          },
        },
      ]).toArray();

      return books;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async create(payload) {
    try {
      console.log("Received payload:", payload); // Debug log

      // Chuyển đổi các trường số
      const bookDocument = {
        ...payload,
        DonGia: parseFloat(payload.DonGia),
        SoQuyen: parseInt(payload.SoQuyen),
        NamXuatBan: parseInt(payload.NamXuatBan),
      };

      console.log("Processed document:", bookDocument); // Debug log

      const result = await this.Book.insertOne(bookDocument);
      console.log("Insert result:", result); // Debug log

      return result;
    } catch (error) {
      console.error("Error in BookService.create:", error);
      throw new Error("Error creating book: " + error.message);
    }
  }
}

export default BookService;
