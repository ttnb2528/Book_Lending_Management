import { StatusCode } from "../util/constants.js";
import jsonGenerate from "../util/helpers.js";
import jwt from "jsonwebtoken";
import UsersService from "../services/users.service.js";
import MongoDB from "../util/mongodb.util.js"; // Để kết nối MongoDB

const authenticate = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log("Token từ cookie:", jwt);

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded token:", decoded);

    const userService = new UsersService(MongoDB.client);
    const user = await userService.getUserById(decoded.userId);

    // console.log("User:", user);

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed." });
  }
};

const authorizeRole = (requiredRole) => (req, res, next) => {
  if (req.user && req.user.role === requiredRole) {
    next();
  } else {
    return res.status(403).json({ message: "Không có quyền truy cập." });
  }
};

export { authenticate, authorizeRole };
