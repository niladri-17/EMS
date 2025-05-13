import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(
  cors({
    // origin: process.env.CORS_ORIGIN, // allow to server to accept request from different origin
    origin: ["http://localhost:5173"],
    credentials: true, // allows cookies, authorization headers, etc to be passed from client
  })
);

app.use(morgan("dev"));
app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes (import your routes here as needed)
// import adminRoutes from "./routes/admin.route.js";
import studentRoutes from "./routes/student.route.js";

const routePrefix = `${process.env.BASE_URL}/${process.env.API_VERSION}`;

app.get("/api/v1/admin", (req, res) => res.send("Admin API"));

// app.use(`/${routePrefix}/admin`, adminRoutes);
app.use("/api/v1", studentRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
