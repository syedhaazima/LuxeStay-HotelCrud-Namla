const pool = require("../Db");
const fs = require("fs");
const path = require("path");
const { uploadDir } = require("../Middleware/upload");

const validHotelFields = ({ title, description, latitude, longitude, price }) => {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const amount = Number(price);
  return Boolean(title?.trim() && description?.trim()) &&
    Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    Number.isFinite(lng) && lng >= -180 && lng <= 180 &&
    Number.isFinite(amount) && amount > 0;
};

const removeUpload = (file) => {
  if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
};

const addHotel = async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    if (!req.file || !validHotelFields(req.body)) {
      removeUpload(req.file);
      return res.status(400).json({
        message: "Provide an image, title, description, valid coordinates, and a price greater than 0"
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      `INSERT INTO hotels
      (image, title, description, latitude, longitude, price)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        imagePath,
        title,
        description,
        latitude,
        longitude,
        price
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    removeUpload(req.file);
    console.log(error);

    res.status(500).json({
      message: "Failed to create hotel"
    });
  }
};


const getHotels = async (req, res) => {
  try {
    const {
      title,
      minPrice,
      maxPrice,
      limit = 8,
      offset = 0
    } = req.query;

    const parsedLimit = Number(limit);
    const parsedOffset = Number(offset);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 100 ||
        !Number.isInteger(parsedOffset) || parsedOffset < 0 ||
        (minPrice !== undefined && (!Number.isFinite(Number(minPrice)) || Number(minPrice) < 0)) ||
        (maxPrice !== undefined && (!Number.isFinite(Number(maxPrice)) || Number(maxPrice) < 0)) ||
        (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice))) {
      return res.status(400).json({ message: "Invalid price range or pagination values" });
    }

    let query = "SELECT * FROM hotels WHERE 1=1";
    let countQuery = "SELECT COUNT(*) FROM hotels WHERE 1=1";

    const values = [];
    const countValues = [];

    if (title) {
      values.push(`%${title}%`);
      query += ` AND title ILIKE $${values.length}`;

      countValues.push(`%${title}%`);
      countQuery += ` AND title ILIKE $${countValues.length}`;
    }

    if (minPrice) {
      values.push(minPrice);
      query += ` AND price >= $${values.length}`;

      countValues.push(minPrice);
      countQuery += ` AND price >= $${countValues.length}`;
    }

    if (maxPrice) {
      values.push(maxPrice);
      query += ` AND price <= $${values.length}`;

      countValues.push(maxPrice);
      countQuery += ` AND price <= $${countValues.length}`;
    }

    query += ` ORDER BY id DESC`;

    values.push(limit);
    query += ` LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    const countResult = await pool.query(
      countQuery,
      countValues
    );

    const total = Number(countResult.rows[0].count);

    res.json({
      hotels: result.rows,
      total: total
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch hotels"
    });
  }
};


const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch hotel"
    });
  }
};


const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    if (!validHotelFields(req.body)) {
      removeUpload(req.file);
      return res.status(400).json({
        message: "Provide a title, description, valid coordinates, and a price greater than 0"
      });
    }

    const oldHotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (oldHotel.rows.length === 0) {
      removeUpload(req.file);
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    let imagePath = oldHotel.rows[0].image;

   
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;

     
    }

    const result = await pool.query(
      `UPDATE hotels
       SET image = $1,
           title = $2,
           description = $3,
           latitude = $4,
           longitude = $5,
           price = $6
       WHERE id = $7
       RETURNING *`,
      [
        imagePath,
        title,
        description,
        latitude,
        longitude,
        price,
        id
      ]
    );

    if (req.file && oldHotel.rows[0].image) {
      const oldImageName = path.basename(oldHotel.rows[0].image);
      const oldImagePath = path.join(uploadDir, oldImageName);
      const stillReferenced = await pool.query(
        "SELECT 1 FROM hotels WHERE image = $1 AND id <> $2 LIMIT 1",
        [oldHotel.rows[0].image, id]
      );
      if (!stillReferenced.rowCount && fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update hotel"
    });
  }
};


const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

   
    const hotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (hotel.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    const image = hotel.rows[0].image;

   
    await pool.query(
      "DELETE FROM hotels WHERE id = $1",
      [id]
    );

  
    if (image) {
      const imageName = path.basename(image);
      const imagePath = path.join(uploadDir, imageName);
      const stillReferenced = await pool.query(
        "SELECT 1 FROM hotels WHERE image = $1 LIMIT 1",
        [image]
      );
      if (!stillReferenced.rowCount && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      message: "Hotel deleted successfully"
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to delete hotel"
    });
  }
};


module.exports = {
  addHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
};
