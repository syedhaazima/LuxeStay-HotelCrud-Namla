const pool = require("../Db");
const fs = require("fs");
const path = require("path");

const addHotel = async (req, res) => {
  try {
    const {
      title,
      description,
      latitude,
      longitude,
      price
    } = req.body;

    if (
      !req.file ||
      !title ||
      !description ||
      !latitude ||
      !longitude ||
      !price
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90"
      });
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180"
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

    if (
      !title ||
      !description ||
      !latitude ||
      !longitude ||
      !price
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90"
      });
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180"
      });
    }

    const oldHotel = await pool.query(
      "SELECT * FROM hotels WHERE id = $1",
      [id]
    );

    if (oldHotel.rows.length === 0) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    let imagePath = oldHotel.rows[0].image;

   
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;

     
      if (oldHotel.rows[0].image) {
        const oldImageName = path.basename(
          oldHotel.rows[0].image
        );

        const oldImagePath = path.join(
          __dirname,
          "..",
          "uploads",
          oldImageName
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
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

      const imagePath = path.join(
        __dirname,
        "..",
        "uploads",
        imageName
      );

      if (fs.existsSync(imagePath)) {
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