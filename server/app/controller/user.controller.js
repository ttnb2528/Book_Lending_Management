import ApiError from "../api-error.js";
import UserService from "../services/user.service.js";
import { setTokenCookie } from "../util/createToken.js";
import MongoDB from "../util/mongodb.util.js";

class UserController {
  static async createUser(req, res, next) {
    const { email, password, ...otherFields } = req.body; // Lấy các trường khác từ body

    // Kiểm tra xem email và password có được cung cấp không
    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    try {
      // Khởi tạo UserService với client MongoDB
      const userService = new UserService(MongoDB.client);

      // Gọi phương thức createUser từ UserService
      const response = await userService.createUser({
        email,
        password,
        ...otherFields,
      });

      // Xử lý kết quả trả về từ userService
      if (response.statusCode === 0) {
        setTokenCookie(res, response.token);
        return res.status(201).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(409).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while creating the user")
      );
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      // Khởi tạo UserService với client MongoDB
      const userService = new UserService(MongoDB.client);

      // Gọi phương thức getAllUsers từ UserService
      const users = await userService.getAllUsers();

      // Trả về danh sách người dùng
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting all users")
      );
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const userService = new UserService(MongoDB.client);
      const user = await userService.getUserById(req.user.id);

      return res.status(200).json({
        data: user,
      });
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the user")
      );
    }
  }

  static async updateUser(req, res, next) {
    const { id } = req.params;

    const userService = new UserService(MongoDB.client);
    const user = await userService.getUserById(id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const { email, password, ...otherFields } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    try {
      const response = await userService.updateUser(id, {
        email,
        password,
        ...otherFields,
      });

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(404).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while updating the user")
      );
    }
  }

  static async deleteUser(req, res, next) {
    const { id } = req.params;

    const userService = new UserService(MongoDB.client);
    const user = await userService.getUserById(id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    try {
      const response = await userService.deleteUser(id);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(404).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while deleting the user")
      );
    }
  }

  static async loginUser(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    try {
      // Khởi tạo UserService với client MongoDB
      const userService = new UserService(MongoDB.client);

      // Gọi phương thức loginUser từ UserService
      const response = await userService.loginUser(email, password, res);

      // Xử lý kết quả trả về từ userService
      if (response.statusCode === 0) {
        setTokenCookie(res, response.token);
        return res.status(200).json({ data: response });
      } else if (response.statusCode === 1) {
        return res.status(404).json({ data: response });
      } else if (response.statusCode === 2) {
        return res.status(401).json({ data: response });
      } else {
        return res.status(500).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(new ApiError(500, "An error occurred while logging in"));
    }
  }

  static async logoutUser(req, res, next) {
    try {
      const userService = new UserService(MongoDB.client);
      const response = await userService.logoutUser(res);

      return res.status(200).json({
        data: response,
      });
    } catch (error) {
      console.error(error);
      return next(new ApiError(500, "An error occurred while logging out"));
    }
  }
}

export default UserController;
