import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

const initialState = {
  user: null,
  status: "pending",
  error: null,
};

export const fetchLogin = createAsyncThunk(
  "auth/fetchLogin",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/login/",
        params,
      );
      return response.data;
    } catch (error) {
      const serverError = error.response?.data;
      return rejectWithValue({
        message: serverError?.code?.[0] || error.message,
        code: error.response?.status,
        serverError,
      });
    }
  },
);

export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",

  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register/",
        params,
      );
      return response.data;
    } catch (error) {
      const serverError = error.response?.data;
      return rejectWithValue({
        message: serverError?.code?.[0] || error.message,
        code: error.response?.status,
        serverError,
      });
    }
  },
);
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.user = action.payload;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload?.message;
      })
      .addCase(fetchLogin.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.user = action.payload;
      })
      .addCase(fetchLogin.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchLogin.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload?.message;
      });
  },
});

export const authReducer = authSlice.reducer;
