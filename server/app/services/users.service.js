import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { generateToken } from "../util/createToken.js";

class UsersService {
  constructor(client) {
    this.User = client.db().collection("users1");
  }

  extractUserData(payload) {
    const User = {
      MaID: payload.MaID,
      email: payload.email,
      password: payload.password,
      Ten: payload.Ten,
      Phai: payload.Phai,
      NgaySinh: payload.NgaySinh,
      DiaChi: payload.DiaChi,
      DienThoai: payload.DienThoai,
      ChucVu: payload.ChucVu,
      role: payload.role,
    };

    return User;
  }

  async generateMaID(role) {
    let prefix = "";

    if (role === "user") {
      prefix = "DG";
    } else if (role === "staff") {
      prefix = "NV";
    } else if (role === "admin") {
      return "AD"; // Mã cho admin không cần tăng
    }

    // Lọc các user với mã bắt đầu bằng prefix tương ứng với role
    const lastUser = await this.User.find({ MaID: { $regex: `^${prefix}` } })
      .sort({ MaID: -1 })
      .limit(1)
      .toArray();

    let newMaID = prefix + "0000";

    if (lastUser.length > 0) {
      const lastMaID = lastUser[0].MaID;
      const numberPart = parseInt(lastMaID.slice(2)); // Lấy phần số từ mã
      newMaID = prefix + String(numberPart + 1).padStart(4, "0");
    }

    return newMaID;
  }

  async createUser(payload) {
    const { email, password, role } = payload;

    const userExists = await this.User.findOne({ email });

    if (userExists) {
      return {
        statusCode: 1,
        message: "Email người dùng đã tồn tại",
      };
    }

    const saltRounds = Number(process.env.SALT);
    const salt = await bcrypt.genSalt(saltRounds);

    const hashPassword = await bcrypt.hash(password, salt);

    const MaID = await this.generateMaID(role);

    if (!MaID) {
      return {
        statusCode: 1,
        message: "Không thể tạo mã ID",
      };
    }

    try {
      const User = this.extractUserData(payload);
      User.MaID = MaID;

      const res = await this.User.insertOne({
        ...User,
        password: hashPassword,
      });

      if (!res) {
        return {
          statusCode: 2,
          message: "Có lỗi xảy ra khi tạo người dùng",
        };
      }

      const token = generateToken(User._id);

      return {
        statusCode: 0,
        message: "Tạo người dùng thành công",
      };
    } catch (error) {
      return {
        statusCode: -1,
        message: "Có lỗi xảy ra khi tạo người dùng",
      };
    }
  }

  async getUserById(id) {
    // console.log(id);

    try {
      const query = ObjectId.isValid(id)
        ? { _id: new ObjectId(id) }
        : { MaID: id };

      // console.log(query);

      const user = await this.User.findOne(query);

      return user;
    } catch (error) {
      return {
        statusCode: -1,
        by: error.message,
        message: "Không thể lấy thông tin người dùng",
      };
    }
  }

  async getCurrentUser(id) {
    try {
      // console.log(id);

      const user = await this.User.findOne({ _id: new ObjectId(id) });

      // delete user.password;
      return user;
    } catch (error) {
      return {
        statusCode: -1,
        by: error.message,
        message: "Không thể lấy thông tin người dùng",
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.User.find().toArray();

      users.forEach((user) => {
        delete user.password;
      });

      return {
        statusCode: 0,
        message: "Lấy danh sách người dùng thành công",
        data: users,
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Không thể lấy danh sách người dùng",
      };
    }
  }

  async getAllUsersByRole(role) {
    try {
      const users = await this.User.find({ role }).toArray();

      users.forEach((user) => {
        delete user.password;
      });

      return {
        statusCode: 0,
        message: "Lấy danh sách người dùng thành công",
        data: users,
      };
    } catch (error) {
      return {
        statusCode: 1,
        message: "Không thể lấy danh sách người dùng",
      };
    }
  }

  async updateUser(id, payload) {
    try {
      const user = this.extractUserData(payload);

      // console.log(user);

      const res = await this.User.updateOne(
        { MaID: id },
        { $set: { ...user } }
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

  async updateCurrentUser(id, payload) {
    try {
      const { password, ...userData } = payload;
      // console.log(payload);

      let updateData = userData;

      if (password) {
        const saltRounds = Number(process.env.SALT);
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);
        updateData = { ...userData, password: hashPassword };
      }

      console.log(updateData);
      delete updateData._id;
      // Cập nhật người dùng
      const res = await this.User.updateOne({ MaID: id }, { $set: updateData });

      console.log(res);
      

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
      const res = await this.User.deleteOne({ MaID: id });

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

      const token = generateToken(user._id);

      return {
        statusCode: 0,
        message: "Đăng nhập thành công",
        user,
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
    // res.cookie("jwt", "", {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   sameSite: "strict",
    //   maxAge: 0, // Xóa cookie
    // });

    res.clearCookie("jwt");

    return {
      statusCode: 0,
      message: "Đăng xuất thành công",
    };
  }
}

export default UsersService;
