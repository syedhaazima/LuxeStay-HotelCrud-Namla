import { configureStore } from "@reduxjs/toolkit";
import hotelReducer from "../Redux/Hotelsclice";

export const store = configureStore({
  reducer: {
    hotels: hotelReducer
  }
});