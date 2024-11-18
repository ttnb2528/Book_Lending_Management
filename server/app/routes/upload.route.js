import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const router = express.Router();

// Lấy đường dẫn hiện tại trong ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../../assets/images");
    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Tạo tên file unique bằng timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Kiểm tra file type
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    console.log("Upload request received"); // Debug log
    
    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ 
        message: "No file uploaded",
        details: "Request must include a file"
      });
    }

    console.log("File received:", req.file); // Debug log

    const filePath = `/images/${req.file.filename}`;
    console.log("File path:", filePath); // Debug log

    res.json({ 
      message: "File uploaded successfully",
      filePath: filePath
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Could not upload the file",
      error: error.message,
      details: error.stack
    });
  }
});

export default router;