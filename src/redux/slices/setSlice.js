import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";
const initialState = {
  sets: [],
  status: "pending",
  error: null,
};
export const fetchSets = createAsyncThunk("sets/fetchSets", async () => {
  const response = await axios.get("http://127.0.0.1:8000/products/");
  return response.data;
});
const setsSlice = createSlice({
  name: "sets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSets.pending, (state) => {
        state.status = "pending";
        state.error = null;
        state.sets = [];
      })
      .addCase(fetchSets.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.sets = action.payload.products;
      })
      .addCase(fetchSets.rejected, (state) => {
        state.status = "rejected";
        state.error = "error";
        state.sets = [];
      });
  },
});
export const setsReducer = setsSlice.reducer;
