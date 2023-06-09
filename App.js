import React, {useState, useReducer} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './navigations/AuthNavigator';
import GlobalContext from './utils/GlobalContext.';
import {NativeBaseProvider} from 'native-base';
import {StatusBar} from 'react-native';
import Ignore from './utils/Ignore';
const App = () => {
  const initialCustomer = {
    address1: '',
    address2: '',
    contact: '',
    name: '',
    postcode: '',
    deliveryNotes: '',
  };

  const customerReducer = (state, action) => {
    if (action.type === 'UPDATE_CUSTOMER')
      return {...state, [action.field]: action.payload};
    if (action.type === 'RESET') {
      for (const s in state) state[s] = '';
      return state;
    }
  };

  const [staff, setStaff] = useState('');
  const [orderType, setOrderType] = useState('');
  const [orders, setOrders] = useState([]);
  const [customer, setCustomer] = useState({});
  const [tableNo, setTableNo] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [people, setPeople] = useState(0);
  const [tableNumbers, setTableNumbers] = useState(0);
  const [orderId, setOrderId] = useState(0);
  const [originalTime, setOriginalTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [customerState, dispatch] = useReducer(
    customerReducer,
    initialCustomer,
  );
  Ignore();
  return (
    <>
      <NavigationContainer>
        <NativeBaseProvider>
          <GlobalContext.Provider
            value={{
              staff,
              setStaff,
              orderType,
              setOrderType,
              tableNo,
              setTableNo,
              orders,
              setOrders,
              loggedIn,
              setLoggedIn,
              customer,
              setCustomer,
              tableNumbers,
              setTableNumbers,
              people,
              setPeople,
              customerState,
              orderId,
              setOrderId,
              originalTime,
              setOriginalTime,
              dispatch,
              notes,
              setNotes,
              deliveryNotes,
              setDeliveryNotes,
            }}>
            <AuthNavigator />
            <StatusBar hidden />
          </GlobalContext.Provider>
        </NativeBaseProvider>
      </NavigationContainer>
    </>
  );
};

export default App;
