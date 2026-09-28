import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Css/Hotelcard.css";
import { API_BASE_URL, imageUrl } from "../api";

const Hotelcard = ({ hotel, onDelete, setRefresh }) => {
  const navigate = useNavigate();


  return (
    <div
      className="hotel-card"
      onClick={() => navigate(`/hotel/${hotel.id}`)}
    >
    <img
  src={imageUrl(hotel.image)}
  alt={hotel.title}
  className="hotel-image"
/>

      <h2>{hotel.title}</h2>

      <p>
        {hotel.description.length > 80
          ? hotel.description.slice(0, 80) + "..."
          : hotel.description}
      </p>

      <p>₹{hotel.price}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/edit/${hotel.id}`);
        }}
      >
        Edit
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();

          axios
            .delete(`${API_BASE_URL}/api/hotels/${hotel.id}`)
            .then(() => {
              setRefresh((prev) => prev + 1);
              onDelete();
            })
            .catch((error) => {
              console.log("Error deleting hotel:", error);
            });
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Hotelcard;
