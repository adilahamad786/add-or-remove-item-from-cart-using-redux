import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { uiActions } from './store/ui-slice';

function App() {

  const showCart = useSelector(state => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(uiActions.showNotification({
      status : 'Pending',
      title : 'Sending...',
      message : 'Sending cart data!'
    }));

    const sendCartData = async () => {

      const response = await fetch("https://add-items-in-cart-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json", {
        method : "PUT",
        body : JSON.stringify(cart)
      });

      if (!response.ok) {
        throw new Error("Sending data is failed!");
      }

      dispatch(uiActions.showNotification({
        status : 'Success',
        title : 'Success!',
        message : 'Sent cart data sucessfully!'
      }));
    };

    sendCartData().catch(error => {
      dispatch(uiActions.showNotification({
        status : 'error',
        title : 'Error!',
        message : 'Sending cart data failed!'
      }));
    })

  }, [cart, dispatch]);

  return (
    <>
      <Layout>
        { showCart && <Cart /> }
        <Products />
      </Layout>
    </>
  );
};

export default App;
