import MongoDB from "../util/mongodb.util.js";
import { ObjectId } from "mongodb";

const LendingStatus = {
  PENDING: "Chờ xử lý",
  BORROWED: "Đang cho mượn",
  RETURNED: "Đã trả",
  OVERDUE: "Trễ hạn",
};

class LendingService {
  constructor() {
    this.Lending = MongoDB.client.db().collection("lendings");
    this.Book = MongoDB.client.db().collection("books");
  }

  extractLendingData(payload) {
    const lending = {
      MaPhieuMuon: payload.MaPhieuMuon,
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon,
      NgayTra: payload.NgayTra,
      TinhTrang: Object.values(LendingStatus).includes(payload.TinhTrang)
        ? payload.TinhTrang
        : LendingStatus.PENDING, // Default status is PENDING
    };
    return lending;
  }

  async generateMaPhieuMuon() {
    const lastLending = await this.Lending.find()
      .sort({ MaPhieuMuon: -1 })
      .limit(1)
      .toArray();

    let newMaPhieuMuon = "PM0000";

    if (lastLending.length > 0) {
      const lastMaPhieuMuon = lastLending[0].MaPhieuMuon;
      const numberPart = parseInt(lastMaPhieuMuon.slice(2));
      newMaPhieuMuon = "PM" + String(numberPart + 1).padStart(4, "0");
    }

    return newMaPhieuMuon;
  }

  async createLending(payload) {
    const { MaDocGia, MaSach } = payload;
    console.log(MaDocGia, MaSach);

    // Kiểm tra số lượng sách
    const book = await this.Book.findOne({ MaSach: payload.MaSach });
    if (!book) {
      return {
        statusCode: 2,
        message: "Không tìm thấy sách",
      };
    }

    if (book.SoQuyen <= 0) {
      return {
        statusCode: 2,
        message: "Sách đã hết, không thể mượn",
      };
    }

    const lendingExits = await this.Lending.find({
      MaDocGia,
      MaSach,
    }).toArray();
    console.log(lendingExits);

    if (lendingExits.length > 0) {
      if (
        lendingExits[lendingExits.length - 1].TinhTrang !==
        LendingStatus.RETURNED
      ) {
        // Kiểm tra nếu chưa trả
        return {
          statusCode: 1,
          message:
            "Phiếu mượn đã tồn tại đang chờ xử lý hoặc chưa trả. Bạn cần trả sách trước khi mượn lại.",
        };
      }
    }

    const MaPhieuMuon = await this.generateMaPhieuMuon();

    try {
      const lending = this.extractLendingData(payload);
      lending.MaPhieuMuon = MaPhieuMuon;

      const result = await this.Lending.insertOne(lending);

      if (result.acknowledged) {
        await this.Book.updateOne(
          { MaSach: payload.MaSach },
          { $inc: { SoQuyen: -1 } }
        );
        return {
          statusCode: 0,
          message: "Phiếu mượn được tạo thành công",
        };
      }

      return {
        statusCode: 2,
        message: "Tạo phiếu mượn thất bại",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async getAllLendings() {
    try {
      const lendings = await this.Lending.aggregate([
        {
          $lookup: {
            from: "users1", // Bảng users
            localField: "MaDocGia", // Trường mã độc giả trong lendings
            foreignField: "MaID", // Trường mã ID trong users
            as: "userInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$userInfo", // Tách mảng userInfo để dễ truy cập
        },
        {
          $lookup: {
            from: "books", // Bảng books
            localField: "MaSach", // Trường mã sách trong lendings
            foreignField: "MaSach", // Trường mã sách trong books
            as: "bookInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$bookInfo", // Tách mảng bookInfo để dễ truy cập
        },
        {
          $project: {
            MaPhieuMuon: 1,
            NgayMuon: 1,
            NgayTra: 1,
            TinhTrang: 1,
            "userInfo.Ten": 1, // Chỉ lấy tên người dùng từ userInfo
            "userInfo.email": 1, // Lấy email người dùng
            "userInfo.MaID": 1, // Lấy email người dùng
            "bookInfo.MaSach": 1, // Chỉ lấy tên sách từ bookInfo
            "bookInfo.TenSach": 1, // Chỉ lấy tên sách từ bookInfo
            "bookInfo.TacGia": 1, // Lấy tác giả sách
            "bookInfo.DonGia": 1, // Lấy đơn giá sách
            "bookInfo.AnhSach": 1, // Lấy đường dẫn ảnh sách
          },
        },
      ]).toArray();
      //   const lendings = await this.lending.find().toArray();
      return lendings;
    } catch (error) {
      console.error(error);
      return {
        statusCode: -1,
        message: "An error occurred while getting all lendings",
      };
    }
  }

  async getLendingById(id) {
    try {
      const lending = await this.Lending.aggregate([
        {
          $match: { MaPhieuMuon: id },
        },
        {
          $lookup: {
            from: "users1", // Bảng users
            localField: "MaDocGia", // Trường mã độc giả trong lendings
            foreignField: "MaID", // Trường mã ID trong users
            as: "userInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$userInfo", // Tách mảng userInfo để dễ truy cập
        },
        {
          $lookup: {
            from: "books", // Bảng books
            localField: "MaSach", // Trường mã sách trong lendings
            foreignField: "MaSach", // Trường mã sách trong books
            as: "bookInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$bookInfo", // Tách mảng bookInfo để dễ truy cập
        },
        {
          $project: {
            MaPhieuMuon: 1,
            NgayMuon: 1,
            NgayTra: 1,
            TinhTrang: 1,
            "userInfo.Ten": 1, // Chỉ lấy tên người dùng từ userInfo
            "userInfo.email": 1, // Lấy email người dùng
            "userInfo.MaID": 1,
            "bookInfo.MaSach": 1,
            "bookInfo.TenSach": 1, // Chỉ lấy tên sách từ bookInfo
            "bookInfo.TacGia": 1, // Lấy tác giả sách
            "bookInfo.DonGia": 1, // Lấy đơn giá sách
          },
        },
      ]).toArray();
      return lending.length > 0 ? lending[0] : null;
    } catch (error) {
      console.error(error);
      return {
        statusCode: -1,
        message: "An error occurred while getting the lending",
      };
    }
  }

  async getLendingsByMaDocGia(MaDocGia) {
    try {
      const lending = await this.Lending.aggregate([
        {
          $match: { MaDocGia: MaDocGia },
        },
        {
          $lookup: {
            from: "users1", // Bảng users
            localField: "MaDocGia", // Trường mã độc giả trong lendings
            foreignField: "MaID", // Trường mã ID trong users
            as: "userInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$userInfo", // Tách mảng userInfo để dễ truy cập
        },
        {
          $lookup: {
            from: "books", // Bảng books
            localField: "MaSach", // Trường mã sách trong lendings
            foreignField: "MaSach", // Trường mã sách trong books
            as: "bookInfo", // Tên trường sau khi lookup
          },
        },
        {
          $unwind: "$bookInfo", // Tách mảng bookInfo để dễ truy cập
        },
        {
          $project: {
            MaPhieuMuon: 1,
            NgayMuon: 1,
            NgayTra: 1,
            TinhTrang: 1,
            "userInfo.Ten": 1, // Chỉ lấy tên người dùng từ userInfo
            "userInfo.email": 1, // Lấy email người dùng
            "userInfo.MaID": 1,
            "bookInfo.MaSach": 1,
            "bookInfo.TenSach": 1, // Chỉ lấy tên sách từ bookInfo
            "bookInfo.TacGia": 1, // Lấy tác giả sách
            "bookInfo.DonGia": 1, // Lấy đơn giá sách
          },
        },
      ]).toArray();
      return lending.length > 0 ? lending : null;
    } catch (error) {
      console.error(error);
      return {
        statusCode: -1,
        message: "An error occurred while getting the lending",
      };
    }
  }

  async updateLending(id, updates) {
    // console.log("Updates:", updates);

    try {
      if ("_id" in updates) {
        delete updates._id;
      }

      const currentLending = await this.Lending.findOne({
        MaPhieuMuon: id,
      });
      if (!currentLending) {
        return {
          statusCode: 1,
          message: "Phiếu mượn không tồn tại",
        };
      }

      // Kiểm tra tình trạng hiện tại và tình trạng mới
      // if (updates.TinhTrang && updates.TinhTrang !== currentLending.TinhTrang) {
      // Chỉ cho phép chuyển đổi hợp lệ giữa các trạng thái
      const validTransitions = {
        [LendingStatus.PENDING]: [
          LendingStatus.PENDING,
          LendingStatus.BORROWED,
          LendingStatus.RETURNED,
        ], // Cho phép chuyển từ Chờ xử lý sang Đã trả
        [LendingStatus.BORROWED]: [
          LendingStatus.BORROWED,
          LendingStatus.RETURNED,
          LendingStatus.OVERDUE,
        ],
        [LendingStatus.OVERDUE]: [
          LendingStatus.OVERDUE,
          LendingStatus.RETURNED,
        ],
      };

      const allowedTransitions = validTransitions[currentLending.TinhTrang];
      if (!allowedTransitions.includes(updates.TinhTrang)) {
        return {
          statusCode: 2,
          message: "Không thể cập nhật trạng thái phiếu mượn theo yêu cầu",
        };
      }
      // }

      if (updates.TinhTrang === LendingStatus.RETURNED) {
        const currentDate = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng yyyy-mm-dd
        updates.NgayTra = currentDate;
        const lending = await this.Lending.findOne({ MaPhieuMuon: id });
          await this.Book.updateOne(
            { MaSach: lending.MaSach },
            { $inc: { SoQuyen: 1 } }
          );
      }

      // Thực hiện cập nhật phiếu mượn
      const updateResult = await this.Lending.updateOne(
        { MaPhieuMuon: id },
        { $set: updates }
      );

      if (!updateResult.modifiedCount) {
        return {
          statusCode: 3,
          message: "Không có trường nào được cập nhật",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật phiếu mượn thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: -1,
        message: "An error occurred while updating the lending",
      };
    }
  }

  async deleteLending(id) {
    try {
      // Nếu phiếu mượn chưa trả sách, cập nhật lại số lượng sách
      const lending = await this.Lending.findOne({ MaPhieuMuon: id });
      if (lending.TinhTrang !== "Đã trả") {
        await this.Book.updateOne(
          { MaSach: lending.MaSach },
          { $inc: { SoQuyen: 1 } }
        );
      }

      const res = await this.Lending.deleteOne({ MaPhieuMuon: id });

      if (!res) {
        return {
          statusCode: 2,
          message: "Không tìm thấy phiếu mượn",
        };
      }

      const result = await this.Lending.deleteOne({ MaPhieuMuon: id });

      if (!result) {
        return {
          statusCode: 2,
          message: "Xóa phiếu mượn thất bại",
        };
      }
      return {
        statusCode: 0,
        message: "Xóa phiếu mượn thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async markAsBorrowed(MaPhieuMuon) {
    return this.updateLendingByMaPhieuMuon(MaPhieuMuon, LendingStatus.BORROWED);
  }

  async markAsReturned(MaPhieuMuon) {
    return this.updateLendingByMaPhieuMuon(MaPhieuMuon, LendingStatus.RETURNED);
  }

  async markAsOverdue(MaPhieuMuon) {
    return this.updateLendingByMaPhieuMuon(MaPhieuMuon, LendingStatus.OVERDUE);
  }
}

export default LendingService;
