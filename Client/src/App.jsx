import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Navbar from "./Components/Navbar";
import Landingpage from "./Components/Landingpage";
import Hotellist from "./Pages/Hotellist";
import Addhotel from "./Pages/Addhotel";
import Edithotel from "./Pages/Edithotel";
import Hoteldetails from "./Pages/Hoteldetails";
import { useDispatch } from "react-redux";
import { loadHotels } from "./Redux/Hotelsclice";
import Footer from "./Components/Footer";

const App = () => {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalHotels, setTotalHotels] = useState(0);
const [refresh, setRefresh] = useState(0);
const hotelsPerPage = 8;
const dispatch = useDispatch();
useEffect(() => {
  let url = "https://luxestay-hotelcrud-namla.onrender.com/api/hotels";

  const params = new URLSearchParams();
  params.append("limit", hotelsPerPage);
params.append("offset", (currentPage - 1) * hotelsPerPage);

  if (search) {
    params.append("title", search);
  }

  if (minPrice) {
    params.append("minPrice", minPrice);
  }

  if (maxPrice) {
    params.append("maxPrice", maxPrice);
  }

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

 axios.get(url)
  .then((response) => {
    dispatch(loadHotels(response.data.hotels));
    setTotalHotels(response.data.total);
  })
  .catch((error) => {
    console.log("Error fetching hotels:", error);
  });
}, [search, minPrice, maxPrice,  currentPage,dispatch,refresh]);
useEffect(() => {
  setCurrentPage(1);
}, [search, minPrice, maxPrice]);
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <>
              <Landingpage search={search} setSearch={setSearch}   minPrice={minPrice}
  setMinPrice={setMinPrice}
  maxPrice={maxPrice}
  setMaxPrice={setMaxPrice}/>
  <Hotellist 
  currentPage={currentPage} 
  setCurrentPage={setCurrentPage}
  totalHotels={totalHotels}
   setRefresh={setRefresh}
/>
            </>
          }
        />

        <Route path="/add" element={<Addhotel setRefresh={setRefresh} />} />

        <Route path="/edit/:id" element={<Edithotel setRefresh={setRefresh}/>} />
        <Route path="/hotel/:id" element={<Hoteldetails />} />

      </Routes>
<Footer />
    </BrowserRouter>
  );
};

export default App;