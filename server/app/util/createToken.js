import jwt from "jsonwebtoken";

// Chỉ tạo token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

// Thiết lập cookie với token (chỉ dùng khi có đối tượng res)
const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // secure: false,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 ngày
  });
};

export { generateToken, setTokenCookie };
