import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import Notification from './components/UI/Notification';
import { uiActions } from './store/ui-slice';

let isInitial = true;

function App() {
  const dispatch = useDispatch();
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  const sendCartData = useCallback(async () => { 
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!',
    }));

    const response = await fetch('https://reduxshopping-e289f-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json', {
        method: "PUT",
        body: JSON.stringify(cart),
      });
      
      if(!response.ok) {
        throw new Error('Sending cart data failed.');
      }

      dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!',
        message: 'Sent cart data successfully!',
      }));

    },[cart, dispatch])

  useEffect(() => {
    if(isInitial) {
      isInitial=false
      return;
    }

    sendCartData().catch(error => {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error!',
        message: 'Sending cart data Failed!',
      }));
    });
  },[cart, dispatch, sendCartData]);


  return (
    <>
      {notification && (
        <Notification
          status={notification?.status} 
          title={notification?.title}
          message={notification?.message} />
      )}

      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
