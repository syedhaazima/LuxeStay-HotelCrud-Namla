const express = require("express");
const router = express.Router();

const {
  addHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
} = require("../Controllers/hotelcontroller");

const upload = require("../Middleware/upload");

router.get("/hotels", getHotels);
router.get("/hotels/:id", getHotelById);
router.post("/hotels", upload.single("image"), addHotel);
router.put("/hotels/:id", upload.single("image"), updateHotel);
router.delete("/hotels/:id", deleteHotel);

module.exports = router;