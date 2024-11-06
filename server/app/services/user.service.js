import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { generateToken } from "../util/createToken.js";

class UserService {
  constructor(client) {
    this.User = client.db().collection("users");
  }

  extractUserData(payload) {
    const Docgia = {
      MaDocGia: payload.name,
      email: payload.email,
      password: payload.password,
      Ten: payload.Ten,
      Phai: payload.Phai,
      HoLot: payload.HoLot,
      NgaySinh: payload.NgaySinh,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
      role: payload.role || "user",
    };
    return Docgia;
  }

  async generateMaDocGia() {
    const lastUser = await this.User.find()
      .sort({ MaDocGia: -1 })
      .limit(1)
      .toArray();

    let newMaDocGia = "DG0000";

    if (lastUser.length > 0) {
      const lastMaDocGia = lastUser[0].MaDocGia;
      const numberPart = parseInt(lastMaDocGia.slice(2));
      newMaDocGia = "DG" + String(numberPart + 1).padStart(4, "0");
    }

    return newMaDocGia;
  }

  async createUser(payload) {
    const { email, password } = payload;

    const userExits = await this.User.findOne({ email });

    if (userExits) {
      return {
        statusCode: 1,
        message: "Người dùng đã tồn tại",
      };
    }

    const saltRounds = Number(process.env.SALT);
    const salt = await bcrypt.genSalt(saltRounds);

    const hashPassword = await bcrypt.hash(password, salt);

    const MaDocGia = await this.generateMaDocGia();

    try {
      const DocGia = this.extractUserData(payload);
      DocGia.MaDocGia = MaDocGia;

      const res = await this.User.insertOne({
        ...DocGia,
        password: hashPassword,
      });

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi tạo người dùng",
        };
      }

      const token = generateToken(DocGia._id); // Sinh token sau khi tạo

      return {
        statusCode: 0,
        message: "Tạo người dùng thành công",
        token,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async getUserById(id) {
    try {
      const user = await this.User.findOne({ _id: new ObjectId(id) });

      delete user.password;
      return user;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.User.find().toArray();
      return users;
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async updateUser(id, payload) {
    try {
      const { password } = payload;
      const user = this.extractUserData(payload);

      const saltRounds = Number(process.env.SALT);
      const salt = await bcrypt.genSalt(saltRounds);

      const hashPassword = await bcrypt.hash(password, salt);

      const res = await this.User.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...user, password: hashPassword } }
      );

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi cập nhật người dùng",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật người dùng thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async deleteUser(id) {
    try {
      const res = await this.User.deleteOne({ _id: new ObjectId(id) });

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi xóa người dùng",
        };
      }

      return {
        statusCode: 0,
        message: "Xóa người dùng thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async loginUser(email, password) {
    try {
      const user = await this.User.findOne({ email });
      if (!user) {
        return {
          statusCode: 1,
          message: "Email không tồn tại",
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          statusCode: 2,
          message: "Sai mật khẩu",
        };
      }

      const token = generateToken(user._id); // Truyền đối tượng res

      return {
        statusCode: 0,
        message: "Đăng nhập thành công",
        token,
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: error.message,
      };
    }
  }

  async logoutUser(res) {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 0, // Xóa cookie
    });

    return {
      statusCode: 0,
      message: "Đăng xuất thành công",
    };
  }
}

export default UserService;
