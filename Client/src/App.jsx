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
import { API_BASE_URL } from "./api";

const App = () => {
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalHotels, setTotalHotels] = useState(0);
const [refresh, setRefresh] = useState(0);
const [fetchError, setFetchError] = useState("");
const hotelsPerPage = 2;
const dispatch = useDispatch();
useEffect(() => {
  let url = `${API_BASE_URL}/api/hotels`;

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
    setFetchError("");
    dispatch(loadHotels(Array.isArray(response.data.hotels) ? response.data.hotels : []));
    const total = Number(response.data.total) || 0;
    setTotalHotels(total);
    const pages = Math.ceil(total / hotelsPerPage);
    if (currentPage > Math.max(pages, 1)) setCurrentPage(Math.max(pages, 1));
  })
  .catch((error) => {
    console.log("Error fetching hotels:", error);
    setFetchError("Could not load hotels. Check that the API server is running.");
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
  fetchError={fetchError}
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



