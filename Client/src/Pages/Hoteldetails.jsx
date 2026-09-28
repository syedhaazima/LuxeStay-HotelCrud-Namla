import React, { useEffect, useState } from "react";
import { useParams , useNavigate} from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import "../Css/Hoteldetails.css";
const Hoteldetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

 const [hotel, setHotel] = useState(null);
 const [userLocation, setUserLocation] = useState(null);
 useEffect(() => {
  axios
    .get(`https://luxestay-hotelcrud-namla.onrender.com/api/hotels/${id}`)
    .then((response) => {
      setHotel(response.data);
    })
    .catch((error) => {
      console.log("Error fetching hotel:", error);
    });
}, [id]);
  
//geolocation api fetching
useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    (error) => {
      console.log("Location error:", error);
    }
  );
}, []);

  if (!hotel) {
    return <h2>Loading...</h2>;
  }
  return (
    <div className="hotel-details">
      <Helmet>
    <title>{`${hotel.title} - LuxeStay`}</title>
  <meta
    name="description"
    content={`View details of ${hotel.title} on LuxeStay.`}
  />
</Helmet>
<button
  className="back-explore"
  onClick={() => navigate("/")}
>
  ← Back to Explore
</button>
      <h1>{hotel.title}</h1>

     <img
  src={`https://luxestay-hotelcrud-namla.onrender.com${hotel.image}`}
  alt={hotel.title}
  width="300"
/>

      <p>{hotel.description}</p>

      <p>Price: ₹{hotel.price}</p>

      <p>Latitude: {hotel.latitude}</p>

      <p>Longitude: {hotel.longitude}</p>

      <h2>Hotel Location</h2>
      {userLocation && (
  <p>
    Your current location: {userLocation.latitude},{" "}
    {userLocation.longitude}
  </p>
)}

<iframe
  title="Hotel Location"
  width="600"
  height="400"
  src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&output=embed`}
></iframe>
    </div>
  );
};

export default Hoteldetails;