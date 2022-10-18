import { uiActions } from "./ui-slice";

export const sendCartData = (cart) => {  // create-own-creator-function-Thunk
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