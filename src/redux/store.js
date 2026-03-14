import { configureStore } from "@reduxjs/toolkit";
import { setsReducer } from "./slices/setSlice";
import { authReducer } from "./slices/authSlice";
import { cartReducer } from "./slices/cartSlice";
export const store = configureStore({
  reducer: { sets: setsReducer, auth: authReducer, cart: cartReducer },
});
