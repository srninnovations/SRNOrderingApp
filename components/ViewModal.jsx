import {Text, ScrollView} from 'react-native';
import {useEffect, useReducer, useState} from 'react';
import Modal from 'react-native-modal';
import {Box, Button, Divider, HStack, Heading, VStack} from 'native-base';
import {printReceipt} from '../utils/PrinterService';

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
export default function ViewModal({order}) {
  const [orderState, dispatch] = useReducer(orderMenuReducer, initialState);

  const [modalShow, setModalShow] = useState(false);

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

  const placeOrder = () => {
    printReceipt(order.items);
  };

  return (
    <>
      <Button
        onPress={() => setModalShow(true)}
        size="sm"
        colorScheme={'lightBlue'}>
        View
      </Button>
      <Modal
        isVisible={modalShow}
        onBackButtonPress={() => setModalShow(false)}
        className="flex-1 justify-center items-center">
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading fontWeight={'medium'} mx={'5'} mt={'5'}>
            Order Details
          </Heading>
          <Text className="text-gray-500 text-xl mx-5">
            Order ID: {order.order_id}
          </Text>
          <Divider my="3" />
          <VStack mx={'5'} maxH={'1/3'}>
            <ScrollView>
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category == 'STARTERS' && (
                    <Text className="text-black">
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
                      <Text className="text-black">
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
                    <Text className="text-black">
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
                    <Text className="text-black">
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
                    <Text className="text-black">
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
                    <Text className="text-black">
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
                    <Text className="text-black">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.alcoholItems > 0 && <Divider my="3" />}
              {order.items.map((o, idx) => (
                <Box key={idx}>
                  {o.category === 'ALCOHOL' && (
                    <Text className="text-black">
                      {o.quantity} x {o.name}
                      {o.notes && `- ${o.notes}`}
                    </Text>
                  )}
                </Box>
              ))}
              {orderState.alcoholItems > 0 && <Divider my="3" />}
            </ScrollView>
          </VStack>

          <VStack minH="1/3">
            {order.notes && order.notes.length > 0 && (
              <>
                <Text className="text-gray-800 mx-5 border-b pb-3 border-custom-border-color">
                  <Text className="font-bold">Notes</Text>: {order.notes}
                </Text>
              </>
            )}
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Order:</Text>
              <Text className="text-gray-900 capitalize">
                {order.orderType.toLowerCase()}
              </Text>
            </HStack>
            {order.orderType === 'DINE IN' && (
              <HStack
                maxW={'1/3'}
                mx="5"
                mb="5"
                justifyContent={'space-between'}>
                <Text className="text-gray-900">Table:</Text>
                <Text className="text-gray-900 capitalize">
                  {order.customer.name}
                  {order?.people && ` (${order.people} people)`}
                </Text>
              </HStack>
            )}
            {order.orderType === 'DELIVERY' && (
              <HStack
                maxW={'1/3'}
                mx="5"
                mb={order.deliveryNotes.length > 0 ? '0' : '5'}
                justifyContent={'space-between'}>
                <Text className="text-gray-900">Address:</Text>
                <Text className="text-gray-900">
                  {`${order.customer.address1}, ${order.customer.address2}`}
                </Text>
              </HStack>
            )}
            {order.orderType === 'COLLECTION' && (
              <HStack
                maxW={'1/3'}
                mx="5"
                mb="5"
                justifyContent={'space-between'}>
                <Text className="text-gray-900">Name:</Text>
                <Text className="text-gray-900">{order.customer.name}</Text>
              </HStack>
            )}
            {order.deliveryNotes && (
              <HStack
                maxW={'1/3'}
                mx="5"
                mb="5"
                justifyContent={'space-between'}>
                <Text className="text-gray-900">Notes:</Text>
                <Text className="text-gray-900">{order.deliveryNotes}</Text>
              </HStack>
            )}
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Drinks:</Text>
              <Text className="text-gray-900 capitalize">
                £{order.drinks.toFixed(2)}
              </Text>
            </HStack>
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Desserts:</Text>
              <Text className="text-gray-900 capitalize">
                £{order.desserts.toFixed(2)}
              </Text>
            </HStack>
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Hot drinks:</Text>
              <Text className="text-gray-900 capitalize">
                £{order.hotDrinks.toFixed(2)}
              </Text>
            </HStack>
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Subtotal:</Text>
              <Text className="text-gray-900 capitalize">
                £{order.subTotal.toFixed(2)}
              </Text>
            </HStack>
            <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
              <Text className="text-gray-900">Discount:</Text>
              <Text className="text-gray-900 capitalize">
                {order.orderType === 'DINE IN'
                  ? `£${order.discount.toFixed(2)}`
                  : `${order.discount.toFixed(2)}%`}
              </Text>
            </HStack>
          </VStack>
          <HStack maxW={'1/3'} mx="5" justifyContent={'space-between'}>
            <Text className="text-gray-900 font-bold">Total:</Text>
            <Text className="text-gray-900 capitalize">
              £{order.total.toFixed(2)}
            </Text>
          </HStack>
          <HStack space="2" justifyContent="flex-end" mr="5" mb="4">
            <Button colorScheme="gray" onPress={() => setModalShow(false)}>
              Close
            </Button>
            <Button onPress={placeOrder} colorScheme="lightBlue">
              Print
            </Button>
          </HStack>
        </Box>
      </Modal>
    </>
  );
}
