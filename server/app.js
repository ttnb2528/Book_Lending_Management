import express from "express";
import cors from "cors";
import userRouter from "./app/routes/user.route.js";
import publisherRouter from "./app/routes/publisher.route.js";
import cookieParser from "cookie-parser";
import bookRouter from "./app/routes/book.route.js";
import staffRouter from "./app/routes/staff.route.js";
import usersRouter from "./app/routes/users.route.js";
import lendingRouter from "./app/routes/lending.route.js";
import uploadRoutes from "./app/routes/upload.route.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Serve static files from assets folder
app.use('/images', express.static(path.join(__dirname, 'assets/images')));

// Routes
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/publisher", publisherRouter);
app.use("/api/v1/lending", lendingRouter);
app.use("/api/v1/upload", uploadRoutes);

app.use("/api/v1/users", usersRouter);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to lending book manager application." });
});

export default app;
