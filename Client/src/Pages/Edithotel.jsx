import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios";
import Hotelform from '../Components/Hotelform'
import { API_BASE_URL } from "../api";
const Edithotel = ({ setRefresh }) => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    useEffect(() => {
 axios
    .get(`${API_BASE_URL}/api/hotels/${id}`)
    .then((response) => {
      setHotel(response.data);
    })
    .catch((error) => {
      console.log("Error fetching hotel:", error);
    });
}, [id]);
 if (!hotel) {
    return <h2>Loading...</h2>;
  }
  return (
    <div>
        <Hotelform mode="edit" hotel={hotel} setRefresh={setRefresh} />
    </div>
  )
}

export default Edithotel
