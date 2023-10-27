import { createSlice } from "@reduxjs/toolkit";
import { CartItemTypes } from "../types/entities";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems") as string)
    : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem: CartItemTypes) =>
          cartItem.id === action.payload.id &&
          cartItem.variantId === action.payload.variantId
      );

      if (itemIndex >= 0) {
        state.cartItems[itemIndex].cartQuantity += 1;
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProduct);
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart(state, action) {
      const nextCartItems = state.cartItems.filter(
        (cartItem: CartItemTypes) =>
          cartItem.variantId !== action.payload.variantId
      );

      state.cartItems = nextCartItems;

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseCartQuantity(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem: CartItemTypes) =>
          cartItem.variantId !== action.payload.variantId
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (cartItem: CartItemTypes) =>
            cartItem.id !== action.payload.id &&
            cartItem.variantId !== action.payload.variantId
        );

        state.cartItems = nextCartItems;
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart(state, action) {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    getTotals(state, action) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        { total: 0, quantity: 0 }
      );

      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  decreaseCartQuantity,
  getTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
