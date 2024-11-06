import app from "./app.js";
import dotenv from "dotenv";
import MongoDB from "./app/util/mongodb.util.js";

dotenv.config();

async function startServer() {
  const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/lendingbook";
  try {
    await MongoDB.connect(DB_URI);
    console.log("Connected to the database!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to database!", error);
    process.exit();
  }
}

startServer();
