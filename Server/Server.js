const express = require("express");
const cors = require("cors");
const pool = require("./Db");
const hotelRoutes = require("./Routes/hotelRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api", hotelRoutes);

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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});