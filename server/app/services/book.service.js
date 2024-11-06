import { ObjectId } from "mongodb";

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
  }

  extractUserData(payload) {
    const Book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB,
      TacGia: payload.TacGia,
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
    const { TenSach } = payload;

    const bookExits = await this.Book.findOne({ TenSach });

    if (bookExits) {
      return {
        statusCode: 1,
        message: "Sách đã tồn tại",
      };
    }

    try {
      const Book = this.extractUserData(payload);
      Book.MaSach = await this.generalMaSach();

      await this.Book.insertOne(Book);

      return {
        statusCode: 0,
        message: "Thêm sách thành công",
      };
    } catch (error) {
      console.error(error);

      return {
        statusCode: 2,
        message: "Thêm sách thất bại",
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
      const Book = this.extractUserData(payload);

      const res = await this.Book.updateOne({ MaSach: id }, { $set: Book });

      if (!res) {
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
    console.log(query);
    
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
}

export default BookService;
