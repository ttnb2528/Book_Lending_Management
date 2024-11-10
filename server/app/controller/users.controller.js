import ApiError from "../api-error.js";
import UsersService from "../services/users.service.js";
import { setTokenCookie } from "../util/createToken.js";
import MongoDB from "../util/mongodb.util.js";

class UsersController {
  static async createUser(req, res, next) {
    const { email, password, role, ...otherFields } = req.body;
    console.log(email, password, role, otherFields);

    if (!email || !password || !role) {
      return next(new ApiError(400, "email, password and role are required"));
    }

    try {
      const usersService = new UsersService(MongoDB.client);

      const response = await usersService.createUser({
        email,
        password,
        role,
        ...otherFields,
      });

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
      console.log("getAllUsers");

      const usersService = new UsersService(MongoDB.client);

      const users = await usersService.getAllUsers();

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting all users")
      );
    }
  }

  static async getAllUsersByRole(req, res, next) {
    const { role } = req.body;

    if (!role) {
      return next(new ApiError(400, "Role is required"));
    }

    try {
      const usersService = new UsersService(MongoDB.client);

      const users = await usersService.getAllUsersByRole(role);

      return res.status(200).json(users);
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while getting all users by role")
      );
    }
  }

  static async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const usersService = new UsersService(MongoDB.client);

      const user = await usersService.getUserById(id);

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the user")
      );
    }
  }

  static async getCurrentUser(req, res, next) {
    try {
      const usersService = new UsersService(MongoDB.client);

      console.log(req.user);

      const user = await usersService.getCurrentUser(req.user.id);

      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return next(
        new ApiError(500, "An error occurred while getting the user")
      );
    }
  }

  static async updateUser(req, res, next) {
    const { id } = req.params;
    const { email, role } = req.body;

    const usersService = new UsersService(MongoDB.client);
    const user = await usersService.getUserById(id);

    console.log(user);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!email || !role) {
      return next(new ApiError(400, "email and role are required"));
    }

    try {
      const usersService = new UsersService(MongoDB.client);

      const response = await usersService.updateUser(id, req.body);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
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

  static async updateCurrentUser(req, res, next) {
    const { id } = req.params;
    const { email, password, role, ...otherFields } = req.body;
    const usersService = new UsersService(MongoDB.client);
    const user = await usersService.getUserById(id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (!email || !password || !role) {
      return next(new ApiError(400, "email, password and role are required"));
    }

    try {
      const usersService = new UsersService(MongoDB.client);

      const response = await usersService.updateCurrentUser(req.params.id, {
        email,
        password,
        role,
        ...otherFields,
      });

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
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
    console.log(id);

    const usersService = new UsersService(MongoDB.client);
    const user = await usersService.getUserById(id);

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }
    try {
      const usersService = new UsersService(MongoDB.client);

      const response = await usersService.deleteUser(id);

      if (response.statusCode === 0) {
        return res.status(200).json({ data: response });
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
    console.log(email, password);

    if (!email || !password) {
      return next(new ApiError(400, "Email and password are required"));
    }

    try {
      const usersService = new UsersService(MongoDB.client);

      const response = await usersService.loginUser(email, password);

      if (response.statusCode === 0) {
        console.log("response token: ", response.token);
        
        setTokenCookie(res, response.token);
        return res.status(200).json({ data: response });
      } else {
        return res.status(401).json({ data: response });
      }
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while logging in the user")
      );
    }
  }

  static async logoutUser(req, res, next) {
    try {
      const usersService = new UsersService(MongoDB.client);
      const response = await usersService.logoutUser(res);

      return res.status(200).json({ data: response });
    } catch (error) {
      console.error(error);

      return next(
        new ApiError(500, "An error occurred while logging out the user")
      );
    }
  }
}

export default UsersController;
