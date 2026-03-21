import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

const STORAGE_KEY = "letti-cart";
const AUTH_STORAGE_KEY = "letti-auth-user";
const MIN_STRAND_QUANTITY = 10;
const MAX_STRAND_QUANTITY = 65;
const MIN_SET_QUANTITY = 1;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeCartItem = (item) => {
  const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
  const strandQuantity = clamp(
    Number(item.strandQuantity ?? item.quantity ?? MIN_STRAND_QUANTITY),
    MIN_STRAND_QUANTITY,
    MAX_STRAND_QUANTITY,
  );
  const setQuantity = Math.max(
    MIN_SET_QUANTITY,
    Number(item.setQuantity ?? MIN_SET_QUANTITY),
  );

  return {
    ...item,
    unitPrice,
    price: unitPrice,
    strandQuantity,
    setQuantity,
    liked: Boolean(item.liked),
    selected: item.selected ?? true,
  };
};

const loadCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).map(normalizeCartItem) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage write failures
  }
};

const hasStoredToken = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    const parsedAuth = savedAuth ? JSON.parse(savedAuth) : null;
    return Boolean(parsedAuth?.token);
  } catch {
    return false;
  }
};

const mapBackendCartItem = (item) => ({
  id: String(item.id),
  productId: item.product?.id,
  img: item.product?.photo || item.product?.images?.[0] || "",
  name: item.product?.name || "",
  description: item.product?.description || "",
  unitPrice: Number(item.product?.price ?? 0),
  price: Number(item.product?.price ?? 0),
  length: item.length || "-",
  color: item.color || "-",
  strandQuantity: clamp(
    Number(item.strandQuantity ?? item.product?.count ?? MIN_STRAND_QUANTITY),
    MIN_STRAND_QUANTITY,
    MAX_STRAND_QUANTITY,
  ),
  setQuantity: Math.max(MIN_SET_QUANTITY, Number(item.count ?? MIN_SET_QUANTITY)),
  liked: false,
  selected: true,
});

const initialState = {
  cart: loadCart(),
  status: "fulfilled",
  error: null,
};

export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  if (!hasStoredToken()) {
    return loadCart();
  }

  const response = await axios.get("http://127.0.0.1:8000/cart/me/");
  return (response.data?.cart ?? []).map(mapBackendCartItem);
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const payload = normalizeCartItem(action.payload);
      const existingItem = state.cart.find(
        (item) =>
          item.productId === payload.productId &&
          item.length === payload.length &&
          item.color === payload.color &&
          item.strandQuantity === payload.strandQuantity,
      );

      if (existingItem) {
        existingItem.setQuantity += payload.setQuantity;
      } else {
        state.cart.push({
          id: `${payload.productId}-${payload.length}-${payload.color}-${payload.strandQuantity}-${Date.now()}`,
          ...payload,
          setQuantity: Math.max(MIN_SET_QUANTITY, payload.setQuantity),
        });
      }

      saveCart(state.cart);
    },
    removeItemFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      saveCart(state.cart);
    },
    removeSelectedFromCart: (state) => {
      state.cart = state.cart.filter((item) => !item.selected);
      saveCart(state.cart);
    },
    toggleCartItemLike: (state, action) => {
      const item = state.cart.find((entry) => entry.id === action.payload);
      if (item) {
        item.liked = !item.liked;
      }
      saveCart(state.cart);
    },
    toggleCartItemSelection: (state, action) => {
      const item = state.cart.find((entry) => entry.id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
      saveCart(state.cart);
    },
    toggleSelectAllCartItems: (state, action) => {
      state.cart = state.cart.map((item) => ({
        ...item,
        selected: action.payload,
      }));
      saveCart(state.cart);
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((entry) => entry.id === id);
      if (item) {
        item.setQuantity = Math.max(MIN_SET_QUANTITY, Number(quantity));
      }
      saveCart(state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.cart = action.payload.map(normalizeCartItem);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      });
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  removeSelectedFromCart,
  toggleCartItemLike,
  toggleCartItemSelection,
  toggleSelectAllCartItems,
  updateCartItemQuantity,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
