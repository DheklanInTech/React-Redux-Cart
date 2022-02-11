import {createSlice,configureStore} from '@reduxjs/toolkit';




const initialUiState = {cartIsVisible:false, notification: null};

const uiSlice = createSlice({
   name: 'ui',
   initialState:initialUiState,
   reducers:{
       toggle(state){
           state.cartIsVisible = !state.cartIsVisible;
       },
       showNotification(state,action){
           state.notification = {
               status: action.payload.status,
               title: action.payload.title,
               message: action.payload.message,
           };
       }
   }
})

// cartSlice starts here
const initailCartState = {items:[],totalQuantity:0, changed:false}
const cartSlice = createSlice({
  name:'cart',
  initialState: initailCartState,
  reducers:{
      replaceCart(state, action){
    state.totalQuantity = action.payload.totalQuantity;
    state.items = action.payload.items
      },
      addItemToCart(state,action){
          const newItem = action.payload;
          const existingItem = state.items.find(item => item.id === newItem.id);
          state.totalQuantity++;
          state.changed = true;
          if(!existingItem){
              state.items.push({
                  id:newItem.id,
                  price:newItem.price,
                  quantity:1,
                  totalPrice: newItem.price,
                  name:newItem.title
              });
          }else{
              existingItem.quantity++;
              existingItem.totalPrice = existingItem.totalPrice + newItem.price
          }
      },
      removeItemFromCart(state,action){
          const id = action.payload;
          const existingItem = state.items.find(item => item.id === id);
          state.totalQuantity--;
          state.changed = true;
          if(existingItem.quantity === 1){
           state.items = state.items.filter(item => item.id !== id);
          }else{
              existingItem.quantity--;
              existingItem.totalPrice = existingItem.totalPrice - existingItem.price
          }
      }
  }
})
                  // cartSlice Ends Here




                   //creating action creators  here(thunks)
                   //--------------------------------------

                   //this is to fetch cart data from the backend..

      export const fetchCartData = () => {
          return async dispatch => {
              const fetchData = async () => {
                  const response = await fetch('https://products-49d90-default-rtdb.firebaseio.com/cart.json');

                  if(!response.ok){
                      throw new Error('could not fetch cart data')
                  }

                  const data = await response.json()

                  return data;
              };
              
              try{
               const cartData = await fetchData();
               dispatch(cartActions.replaceCart({
                   items: cartData.items || [],
                   totalQuantity: cartData.totalQuantity 
               }))
              }catch(error){
                dispatch(uiActions.showNotification({
                    status: 'error',
                    title: 'Error!..',
                    message:'Fetching cart data failed!..'
                  }))
              }
          }
      }







                  //this is to send data to our backend

   export const sendCartData = (cart) => {
     return async (dispatch) => {
        dispatch(uiActions.showNotification({
            status: 'pending',
            title: 'sending...',
            message:'sending cart data'
          }))

          const sendRequest = async () => {
            const response = await fetch('https://products-49d90-default-rtdb.firebaseio.com/cart.json',{
            method:'PUT',
            body:JSON.stringify({items: cart.items, totalQuantity: cart.totalQuantity})
          })
          if(!response.ok){
            throw new Error('sending cart data failed');
          }
     }
     
      try{
         await sendRequest();

        dispatch(uiActions.showNotification({
        status: 'success',
        title: 'Success!..',
        message:'sending cart data successfully'
      }))
       
      }catch(error){
        dispatch(uiActions.showNotification({
            status: 'error',
            title: 'Error!..',
            message:'sending cart data failed!..'
          }))
      }
   };
  
}

// sending data to backend ends here
   
const store = configureStore({
    reducer:{ui:uiSlice.reducer,cart:cartSlice.reducer}
})



export default store;
export const uiActions = uiSlice.actions;
export const cartActions = cartSlice.actions;
