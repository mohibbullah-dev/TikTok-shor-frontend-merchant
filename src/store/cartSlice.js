import { createSlice } from "@reduxjs/toolkit";

// For distribution center — select multiple products
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    selectedProducts: [],
  },
  reducers: {
    addProduct: (state, action) => {
      const exists = state.selectedProducts.find(
        (p) => p._id === action.payload._id,
      );
      if (!exists) {
        state.selectedProducts.push(action.payload);
      }
    },

    removeProduct: (state, action) => {
      state.selectedProducts = state.selectedProducts.filter(
        (p) => p._id !== action.payload,
      );
    },

    selectAll: (state, action) => {
      state.selectedProducts = action.payload;
    },

    clearCart: (state) => {
      state.selectedProducts = [];
    },
  },
});

export const { addProduct, removeProduct, selectAll, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
