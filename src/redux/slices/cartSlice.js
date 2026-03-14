import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";
const initialState = {
  cart: [],
  status: "pending",
  error: null,
};
export const fetchCart = createAsyncThunk("cart/fetchCart", async (id) => {
  const response = await axios.get(`http://127.0.0.1:8000/cart/${id}/`);
  return response.data;
});
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "pending";
        state.cart = [];
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});
export const cartReducer = cartSlice.reducer;
