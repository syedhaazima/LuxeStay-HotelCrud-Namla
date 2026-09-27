import { createSlice } from "@reduxjs/toolkit";

const hotelSlice = createSlice({
  name: "hotels",

  initialState: [],

  reducers: {
    loadHotels: (state, action) => {
      return action.payload;
    },
  },
});

export const { loadHotels } = hotelSlice.actions;

export default hotelSlice.reducer;