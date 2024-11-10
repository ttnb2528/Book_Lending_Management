import express from "express";
import cors from "cors";
import userRouter from "./app/routes/user.route.js";
import publisherRouter from "./app/routes/publisher.route.js";
import cookieParser from "cookie-parser";
import bookRouter from "./app/routes/book.route.js";
import staffRouter from "./app/routes/staff.route.js";
import usersRouter from "./app/routes/users.route.js";
import lendingRouter from "./app/routes/lending.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// app.use("/api/v1/user", userRouter);
app.use("/api/v1/book", bookRouter);
app.use("/api/v1/publisher", publisherRouter);
// app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/lending", lendingRouter);

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
