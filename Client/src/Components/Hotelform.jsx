import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { API_BASE_URL, imageUrl } from "../api";
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setImage(hotel?.image || "");
    setImageFile(null);
    setTitle(hotel?.title || "");
    setDescription(hotel?.description || "");
    setPrice(hotel?.price ?? "");
    setLatitude(hotel?.latitude ?? "");
    setLongitude(hotel?.longitude ?? "");
  }, [hotel]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || price === "" || latitude === "" || longitude === "") {
      setError("Please fill all the fields");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      setError("Price must be a number greater than 0");
      return;
    }

    if (!Number.isFinite(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      setError("Latitude must be between -90 and 90");
      return;
    }

    if (!Number.isFinite(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      setError("Longitude must be between -180 and 180");
      return;
    }

    if (mode === "add" && !imageFile) {
      setError("Please upload a hotel image");
      return;
    }

    setError("");
    setSaving(true);

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    const request = mode === "add"
      ? axios.post(`${API_BASE_URL}/api/hotels`, formData)
      : axios.put(`${API_BASE_URL}/api/hotels/${hotel.id}`, formData);
    request.then(() => {
      setRefresh((prev) => prev + 1);
      navigate("/");
    }).catch((requestError) => {
      setError(requestError.response?.data?.message || "Could not save the hotel. Please try again.");
    }).finally(() => setSaving(false));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file");
        e.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be 5 MB or smaller");
        e.target.value = "";
        return;
      }
      setError("");
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

        {error && <p role="alert">{error}</p>}
        <input
          type="file"
          accept="image/*"
          required={mode === "add"}
          aria-label="Hotel image"
          onChange={handleImageChange}
        />

        {image && (
          <img
            src={
              image.startsWith("data:") ? image : imageUrl(image)
            }
            alt="Hotel Preview"
            width="200"
          />
        )}

        <input
          type="text"
          placeholder="Title..."
          aria-label="Hotel title"
          required
          maxLength={150}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description..."
          aria-label="Hotel description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <input
          type="number"
          placeholder="Price..."
          aria-label="Price"
          min="0.01"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Latitude..."
          aria-label="Latitude"
          min="-90"
          max="90"
          step="any"
          required
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />

        <input
          type="number"
          placeholder="Longitude..."
          aria-label="Longitude"
          min="-180"
          max="180"
          step="any"
          required
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : mode === "add" ? "Add Hotel" : "Update Hotel"}
        </button>
      </form>
    </div>
  );
};

export default Hotelform;
