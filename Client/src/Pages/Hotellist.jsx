import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import HotelCard from "../Components/Hotelcard";
import SuccessPopup from "../Components/Successpopup";
import Pagination from "../Components/Pagination";
import "../Css/Hotellist.css";

const Hotellist = ({currentPage,setCurrentPage,totalHotels,setRefresh }) => {
  const hotels = useSelector((state) => state.hotels);


  const [showPopup, setShowPopup] = useState(false);
  const totalPages = Math.ceil(totalHotels / 8);




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
      {showPopup && (
        <SuccessPopup message="Hotel deleted successfully!" />
      )}

      <h1>Hotel List</h1>

      <div className="hotel-list">
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            onDelete={() => setShowPopup(true)}
            setRefresh={setRefresh}
          />
        ))}
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