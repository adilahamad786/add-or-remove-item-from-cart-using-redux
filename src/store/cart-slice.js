import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalQuantity: 0 },
  reducers: {
    addItemFromCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;

      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          title : newItem.title
        });
      }
      else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
      }
    },
    removeItemFromCart(state, action) {
        const id = action.payload;
        const existingItem = state.items.find( item => item.id === id );
        state.totalQuantity--;

        if (existingItem.quantity === 1) {
            state.items = state.items.filter( item => item.id !== id);
        }
        else {
            existingItem.quantity--;
            existingItem.totalPrice -= existingItem.price;
        }
    }
  },
});

// create-own-creator-function-Thunk
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "Pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const response = await fetch(
        "https://add-items-in-cart-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );

      if (!response.ok) {
        throw new Error("Sending data is failed!");
      }
    };

    try {
      await sendRequest();
      dispatch(
        uiActions.showNotification({
          status: "Success",
          title: "Success!",
          message: "Sent cart data sucessfully!",
        })
      );
    } catch (error) {
      sendCartData().catch((error) => {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error!",
            message: "Sending cart data failed!",
          })
        );
      });
    }
  };
};

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;