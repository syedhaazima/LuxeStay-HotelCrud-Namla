import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HotelCard from "../Components/Hotelcard";
import SuccessPopup from "../Components/Successpopup";
import Pagination from "../Components/Pagination";
import "../Css/Hotellist.css";
import { Helmet } from "react-helmet-async";

const Hotellist = ({currentPage,setCurrentPage,totalHotels,setRefresh,fetchError }) => {
  const hotels = useSelector((state) => state.hotels);


  const [showPopup, setShowPopup] = useState(false);
  const hotelsPerPage = 2;
  const totalPages = Math.ceil(totalHotels / hotelsPerPage);




  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  

  return (
    <div>
      <Helmet>
        <title>Hotels - LuxeStay</title>
        <meta name="description" content="Browse, search, and manage hotel listings on LuxeStay." />
      </Helmet>
      {showPopup && (
        <SuccessPopup message="Hotel deleted successfully!" />
      )}

      <h1>Hotel List</h1>
      {fetchError && <p role="alert">{fetchError}</p>}

      <div className="hotel-list">
        {hotels.length ? hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onDelete={() => setShowPopup(true)}
            setRefresh={setRefresh}
          />
        )) : <p className="hotel-list-empty">No hotels match these filters.</p>}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Hotellist;



