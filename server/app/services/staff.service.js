import { ObjectId } from "mongodb";

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("staffs");
  }

  extractUserData(payload) {
    const Staff = {
      MSNV: payload.MSNV,
      TenNV: payload.TenNV,
      email: payload.email,
      password: payload.password,
      DiaChi: payload.DiaChi,
      ChucVu: payload.ChucVu,
      SoDienThoai: payload.SoDienThoai,
    };

    return Staff;
  }

  async generalMSNV() {
    const lastStaff = await this.Staff.find()
      .sort({ MSNV: -1 })
      .limit(1)
      .toArray();

    let newMSNV = "NV0000";

    if (lastStaff.length > 0) {
      const lastMSNV = lastStaff[0].MSNV;
      const numberPart = parseInt(lastMSNV.slice(2));
      newMSNV = "NV" + String(numberPart + 1).padStart(4, "0");
    }

    return newMSNV;
  }

  async createStaff(payload) {
    const { email } = payload;

    const staffExits = await this.Staff.findOne({ email });

    if (staffExits) {
      return {
        statusCode: 1,
        message: "Email nhân viên đã tồn tại",
      };
    }
    try {
      const Staff = this.extractUserData(payload);
      Staff.MSNV = await this.generalMSNV();

      await this.Staff.insertOne(Staff);

      return {
        statusCode: 0,
        message: "Thêm nhân viên thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 2,
        message: "Thêm nhân viên thất bại",
      };
    }
  }

  async getAllStaffs() {
    try {
      const staffs = await this.Staff.find().toArray();
      return staffs;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Lấy danh sách nhân viên thất bại",
      };
    }
  }

  async getStaffById(id) {
    try {
      const staff = await this.Staff.findOne({ _id: new ObjectId(id) });
      return staff;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Lấy thông tin nhân viên thất bại",
      };
    }
  }

  async updateStaffById(id, payload) {
    try {
      const Staff = this.extractUserData(payload);

      const response = await this.Staff.updateOne(
        { _id: new ObjectId(id) },
        { $set: Staff }
      );

      if (!response) {
        return {
          statusCode: 2,
          message: "Cập nhật thông tin nhân viên thất bại",
        };
      }

      return {
        statusCode: 0,
        message: "Cập nhật thông tin nhân viên thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Cập nhật thông tin nhân viên thất bại",
      };
    }
  }

  async deleteStaffById(id) {
    try {
      const response = await this.Staff.deleteOne({ _id: new ObjectId(id) });

      if (!response) {
        return {
          statusCode: 2,
          message: "Xóa nhân viên thất bại",
        };
      }
      return {
        statusCode: 0,
        message: "Xóa nhân viên thành công",
      };
    } catch (error) {
      console.error(error);
      return {
        statusCode: 1,
        message: "Xóa nhân viên thất bại",
      };
    }
  }
}

export default StaffService;
