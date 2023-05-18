import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {useContext, useEffect, useReducer, useState} from 'react';
import Modal from 'react-native-modal';
import {Box, Button, Divider, HStack, Heading, VStack} from 'native-base';
import {PrintingOptions} from './PrintingOptions';
import {
  printNewKitckenReceipt,
  printNewCustomerReceipt,
} from '../utils/PrinterService';
import {useNavigation} from '@react-navigation/native';
import GlobalContext from '../utils/GlobalContext.';

const initialState = {
  starterItems: 0,
  mainItems: 0,
  sundriesItems: 0,
  dessertItems: 0,
  beverageItems: 0,
  alcoholItems: 0,
  sundayItems: 0,
  subTotal: 0,
};
const orderMenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_STARTER':
      return {...state, starterItems: state.starterItems + 1};
    case 'ADD_MAIN':
      return {...state, mainItems: state.mainItems + 1};
    case 'ADD_SUNDER':
      return {...state, sundriesItems: state.sundriesItems + 1};
    case 'ADD_DESSERT':
      return {...state, dessertItems: state.dessertItems + 1};
    case 'ADD_BEVERAGE':
      return {...state, beverageItems: state.beverageItems + 1};
    case 'ADD_ALCOHOL':
      return {...state, alcoholItems: state.alcoholItems + 1};
    case 'ADD_SUNDAY':
      return {...state, sundayItems: state.sundayItems + 1};
    case 'SET_SUBTOTAL':
      return {...state, subTotal: action.payload};
    default:
      return state;
  }
};
export default function ViewModal({order, showEditModal}) {
  const context = useContext(GlobalContext);

  const navigation = useNavigation();

  const [orderState, dispatch] = useReducer(orderMenuReducer, initialState);

  const [modalShow, setModalShow] = useState(false);

  const [showPrintOptions, setShowPrintOptions] = useState(false);

  useEffect(() => {
    let subTotal = 0;
    for (const item of order.items) {
      subTotal = subTotal + item.price * item.quantity;
      if (
        item.category != 'STARTERS' &&
        item.category != 'SUNDRIES' &&
        item.category != 'DESSERTS' &&
        item.category != 'BEVERAGES' &&
        item.category != 'SUNDAY MENU' &&
        item.category != 'ALCOHOL'
      )
        dispatch({type: 'ADD_MAIN'});
      if (item.category === 'STARTERS') dispatch({type: 'ADD_STARTER'});
      if (item.category === 'SUNDRIES') dispatch({type: 'ADD_SUNDER'});
      if (item.category === 'DESSERTS') dispatch({type: 'ADD_DESSERT'});
      if (item.category === 'BEVERAGES') dispatch({type: 'ADD_BEVERAGE'});
      if (item.category === 'ALCOHOL') dispatch({type: 'ADD_ALCOHOL'});
      if (item.category === 'SUNDAY MENU') dispatch({type: 'ADD_SUNDAY'});
    }
    dispatch({type: 'SET_SUBTOTAL', payload: subTotal});
  }, [order]);

  const printKitcken = async () => {
    const orderDetails = {
      orderNotes: order.notes,
      orderType: order.orderType,
      customerDetails: order.customer,
    };

    await printNewKitckenReceipt(order.items, orderDetails);
  };

  const printCustomer = async () => {
    const totals = {
      total: order.total,
      subTotal: order.subTotal,
      hotDrinks: order.hotDrinks,
      desserts: order.desserts,
      discount: order.discount,
      drinks: order.drinks,
    };

    const orderDetails = {
      orderId: order.order_id,
      orderDate: order.orderDate,
      orderType: order.orderType,
      customerDetails: order.customer,
    };

    await printNewCustomerReceipt(order.items, totals, orderDetails);
  };
  const handleEditCustomer = () => {
    setModalShow(false);
    Object.keys(order.customer).forEach(info => {
      context.dispatch({
        type: 'UPDATE_CUSTOMER',
        field: info,
        payload: order.customer[info],
      });
    });
    context.setOrderId(order.order_id);
    context.setOrderType(order.orderType);
    showEditModal();
    return;
  };

  return (
    <>
      <TouchableOpacity
        className="p-3 rounded bg-custom-primary"
        onPress={() => setModalShow(true)}>
        <Text className="text-white my-auto font-semibold uppercase">View</Text>
      </TouchableOpacity>
      <Modal
        isVisible={modalShow}
        onBackButtonPress={() => setModalShow(false)}
        className="flex-1 justify-center items-center">
        <Box width={'full'} maxW={'lg'} bgColor={'white'} borderRadius={'md'}>
          <Heading fontWeight={'medium'} mx={'5'} mt={'5'}>
            Order Details
          </Heading>
          <Text className="text-gray-500 text-xl mx-5">
            Order ID: {order.order_id}
          </Text>
          <Divider my="3" />
          <PrintingOptions
            show={showPrintOptions}
            close={() => setShowPrintOptions(false)}
            kitchenRecipt={printKitcken}
            customerReceipt={printCustomer}
          />
          <VStack mx={'5'} maxH={'1/3'}>
            <ScrollView className="my-2 border-2 border-gray-200 p-2">
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category == 'STARTERS' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.starterItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category !== 'STARTERS' &&
                    o.category !== 'SUNDRIES' &&
                    o.category != 'DESSERTS' &&
                    o.category != 'BEVERAGES' &&
                    o.category != 'SUNDAY MENU' &&
                    o.category != 'ALCOHOL' && (
                      <Text className="text-black text-xl">
                        {o.quantity} x {o.name}
                        {o.notes && `- ${o.notes}`}
                      </Text>
                    )}
                </Box>
              ))}
              {orderState.mainItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'SUNDAY MENU' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.sundayItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'SUNDRIES' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.sundriesItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'DESSERTS' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.dessertItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'BEVERAGES' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.beverageItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'ALCOHOL' && (
                    <Text className="text-black text-xl">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.alcoholItems > 0 && <Divider my="3" />}
            </ScrollView>
          </VStack>

          <HStack justifyContent={'center'}>
            <VStack>
              {/* <ScrollView> */}
              {order.notes && order.notes.length > 0 && (
                <>
                  <Text className="text-gray-800 mx-5 border-b pb-3 border-custom-border-color">
                    <Text className="font-bold text-xl">Notes</Text>:
                    {order.notes}
                  </Text>
                </>
              )}
              <HStack w={'2/3'} mx="5" my="1" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Order:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  {order.orderType.toLowerCase()}
                </Text>
              </HStack>
              {order.orderType.toUpperCase() === 'DINE IN' && (
                <HStack
                  w={'2/3'}
                  mx="5"
                  mb="5"
                  justifyContent={'space-between'}>
                  <Text className="text-gray-900 text-xl">Table:</Text>
                  <Text className="text-gray-900 text-xl capitalize">
                    {order.customer.name}
                    {order?.people && ` (${order.people} people)`}
                  </Text>
                </HStack>
              )}
              {order.orderType.toUpperCase() === 'DELIVERY' && (
                <HStack
                  w={'2/3'}
                  mx="5"
                  mb={order.deliveryNotes.length > 0 ? '0' : '5'}
                  justifyContent={'space-between'}>
                  <View className="flex flex-col">
                    <Text className="text-gray-900 font-semibold text-xl my-2">
                      Address
                    </Text>
                    <Text className="text-gray-900 text-xl">
                      {`${order.customer.address1}, ${order.customer.address2}`}
                    </Text>
                  </View>
                </HStack>
              )}
              {order.orderType.toUpperCase() === 'COLLECTION' && (
                <HStack
                  w={'2/3'}
                  mx="5"
                  mb="5"
                  justifyContent={'space-between'}>
                  <Text className="text-gray-900 text-xl">Name:</Text>
                  <Text className="text-gray-900 text-xl">
                    {order.customer.name}
                  </Text>
                </HStack>
              )}
              {order.deliveryNotes && (
                <HStack
                  w={'2/3'}
                  mx="5"
                  mb="5"
                  justifyContent={'space-between'}>
                  <Text className="text-gray-900 text-xl">Notes:</Text>
                  <Text className="text-gray-900 text-xl">
                    {order.deliveryNotes}
                  </Text>
                </HStack>
              )}
              <HStack w={'2/3'} mx="5" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Drinks:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.drinks.toFixed(2)}
                </Text>
              </HStack>
              <HStack w={'2/3'} mx="5" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Desserts:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.desserts.toFixed(2)}
                </Text>
              </HStack>
              <HStack w={'2/3'} mx="5" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Hot drinks:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.hotDrinks.toFixed(2)}
                </Text>
              </HStack>
              <HStack w={'2/3'} mx="5" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Subtotal:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.subTotal.toFixed(2)}
                </Text>
              </HStack>
              <HStack w={'2/3'} mx="5" justifyContent={'space-between'}>
                <Text className="text-gray-900 text-xl">Discount:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.discount.toFixed(2)}
                </Text>
              </HStack>
              <HStack w={'2/3'} mx="5" my="2" justifyContent={'space-between'}>
                <Text className="text-gray-900 font-bold text-xl">Total:</Text>
                <Text className="text-gray-900 text-xl capitalize">
                  £{order.total.toFixed(2)}
                </Text>
              </HStack>
              {/* </ScrollView> */}
            </VStack>
          </HStack>
          <HStack space="2" justifyContent="flex-end" mx="5" my="7">
            <TouchableOpacity
              onPress={() => setShowPrintOptions(true)}
              className="bg-custom-primary w-32 h-10 flex justify-center rounded">
              <Text className="text-white text-center uppercase text-xl">
                Print
              </Text>
            </TouchableOpacity>
            {order.orderType.toUpperCase() !== 'DINE IN' && (
              <TouchableOpacity
                onPress={handleEditCustomer}
                className="bg-gray-700 px-4 h-10 flex justify-center rounded">
                <Text className="text-white text-center uppercase text-xl">
                  Edit Details
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setModalShow(false)}
              className="bg-custom-grey w-32 h-10 flex justify-center rounded ">
              <Text className="text-white text-center uppercase text-xl">
                Close
              </Text>
            </TouchableOpacity>
          </HStack>
        </Box>
      </Modal>
    </>
  );
}
