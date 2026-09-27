import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import "../Css/Hotelform.css";

const Hotelform = ({ mode = "add", hotel, setRefresh }) => {
  const navigate = useNavigate();

  const [image, setImage] = useState(hotel?.image || "");
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState(hotel?.title || "");
  const [description, setDescription] = useState(
    hotel?.description || ""
  );
  const [price, setPrice] = useState(hotel?.price || "");
  const [latitude, setLatitude] = useState(hotel?.latitude || "");
  const [longitude, setLongitude] = useState(hotel?.longitude || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !price || !latitude || !longitude) {
      setError("Please fill all the fields");
      return;
    }

    if (Number(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (Number(latitude) < -90 || Number(latitude) > 90) {
      setError("Latitude must be between -90 and 90");
      return;
    }

    if (Number(longitude) < -180 || Number(longitude) > 180) {
      setError("Longitude must be between -180 and 180");
      return;
    }

    if (mode === "add" && !imageFile) {
      setError("Please upload a hotel image");
      return;
    }

    setError("");

    if (mode === "add") {
      const formData = new FormData();

      formData.append("image", imageFile);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      axios
        .post("https://luxestay-hotelcrud-namla.onrender.com/api/hotels", formData)
        .then(() => {
          setRefresh((prev) => prev + 1);
          navigate("/");
        })
        .catch((error) => {
          console.log("Error adding hotel:", error);
        });
    } else {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      axios
        .put(
          `https://luxestay-hotelcrud-namla.onrender.com/api/hotels/${hotel.id}`,
          formData
        )
        .then(() => {
          setRefresh((prev) => prev + 1);
          navigate("/");
        })
        .catch((error) => {
          console.log("Error updating hotel:", error);
        });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Helmet>
        <title>
          {mode === "add"
            ? "Add Hotel - LuxeStay"
            : "Edit Hotel - LuxeStay"}
        </title>
      </Helmet>

      <form onSubmit={handleSubmit}>
        <h1>
          {mode === "add" ? "Add Hotel" : "Edit Hotel"}
        </h1>

        {error && <p>{error}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {image && (
          <img
            src={
              image.startsWith("data:")
                ? image
                : `https://luxestay-hotelcrud-namla.onrender.com${image}`
            }
            alt="Hotel Preview"
            width="200"
          />
        )}

        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <input
          type="number"
          placeholder="Price..."
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Latitude..."
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        <input
          type="number"
          placeholder="Longitude..."
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <button type="submit">
          {mode === "add" ? "Add Hotel" : "Update Hotel"}
        </button>
      </form>
    </div>
  );
};

export default Hotelform;