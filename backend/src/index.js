import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db/dbConnection.js";

connectDB()
  .then(async () => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on port:", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
