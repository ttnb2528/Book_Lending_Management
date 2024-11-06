import ApiError from "../api-error.js";
import StaffService from "../services/staff.service.js";
import MongoDB from "../util/mongodb.util.js";

class StaffController {
  static async createStaff(req, res, next) {
    const { TenNV, email, password, SoDienThoai, DiaChi, ChucVu } = req.body;
    if (!TenNV || !email || !password || !DiaChi || !ChucVu || !SoDienThoai) {
      return next(new ApiError(400, "All fields are required"));
    }
    try {
      const staffService = new StaffService(MongoDB.client);
      const response = await staffService.createStaff({
        TenNV,
        email,
        password,
        SoDienThoai,
        DiaChi,
        ChucVu,
      });
      if (response.statusCode === 0) {
        return res.status(201).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while creating the staff")
      );
    }
  }

  static async getAllStaffs(req, res, next) {
    try {
      const staffService = new StaffService(MongoDB.client);
      const staffs = await staffService.getAllStaffs();
      return res.status(200).json(staffs);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting all staffs")
      );
    }
  }

  static async getStaffById(req, res, next) {
    const { id } = req.params;
    try {
      const staffService = new StaffService(MongoDB.client);
      const staff = await staffService.getStaffById(id);
      return res.status(200).json(staff);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the staff")
      );
    }
  }

  static async updateStaff(req, res, next) {
    const { id } = req.params;
    const { TenNV, email, password, SoDienThoai, DiaChi, ChucVu } = req.body;
    if (!TenNV || !email || !password || !DiaChi || !ChucVu || !SoDienThoai) {
      return next(new ApiError(400, "All fields are required"));
    }
    try {
      const staffService = new StaffService(MongoDB.client);
      const response = await staffService.updateStaffById(id, {
        TenNV,
        email,
        password,
        SoDienThoai,
        DiaChi,
        ChucVu,
      });
      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while updating the staff")
      );
    }
  }

  static async deleteStaff(req, res, next) {
    const { id } = req.params;
    try {
      const staffService = new StaffService(MongoDB.client);
      const response = await staffService.deleteStaffById(id);
      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while deleting the staff")
      );
    }
  }
}

export default StaffController;
