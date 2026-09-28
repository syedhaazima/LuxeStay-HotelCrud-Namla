const path = require("path");
const express = require("express");
const cors = require("cors");
const pool = require("./Db");
const hotelRoutes = require("./Routes/hotelRoutes");
const { uploadDir } = require("./Middleware/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadDir));

app.use("/api", hotelRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 5 MB or smaller" });
  }
  return res.status(400).json({ message: error.message || "Invalid request" });
});

app.get("/", (req, res) => {
  res.send("LuxeStay Backend is running");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
