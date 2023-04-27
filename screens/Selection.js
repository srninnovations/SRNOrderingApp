import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import StorageUtils from '../utils/StorageUtils';
import Header from '../components/Header';
import ApiServiceUtils from '../utils/ApiServiceUtils';

import {
  Spinner,
  Box,
  Button,
  Text,
  TextArea,
  FormControl,
  Input,
  HStack,
  VStack,
} from 'native-base';

export default function Selection({navigation}) {
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState('');
  const [tables, setTables] = useState(0);
  const [activeTables, setActiveTables] = useState([]);
  const [orderType, setOrderType] = useState('');

  const [customerState, setCustomerState] = useState({
    address1: '',
    address2: '',
    postcode: '',
    contact: '',
    deliveryNotes: '',
  });

  const scrollViewRef = useRef();

  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const postcodeRef = useRef(null);
  const contactRef = useRef(null);
  const deliveryNotesRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getDetails();
  }, []);

  const active = tableNo => {
    if (activeTables) {
      const activeTb = activeTables.find(tb => tb === tableNo);
      if (activeTb) {
        return true;
      }
    }
    return false;
  };

  const getDetails = async () => {
    const clientObject = await StorageUtils.getAsyncStorageData('client');
    setClient(clientObject.value);

    const orderTypeResult = await StorageUtils.getAsyncStorageData('orderType');

    if (orderTypeResult) {
      const orderTypeValue = orderTypeResult.value;
      setOrderType(orderTypeValue);
      if (orderTypeValue && orderTypeValue == 'Dine In') {
        const tables = await ApiServiceUtils.getTables(clientObject.value);
        setActiveTables(tables.active_tables);
        setTables(tables.no_tables);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }

    // const menuResult = await StorageUtils.getAsyncStorageData('tables');
    // if (menuResult) {
    //   const menuObject = menuResult.value;
    //   const categories = Object.keys(menuObject);
    //   setMenu([]);
    //   for (let category of categories) {
    //     const categoryObj = {
    //       category: category,
    //       items: menuObject[category],
    //     };
    //     setMenu(oldArray => [...oldArray, categoryObj]);
    //   }
    // }

    // const categoriesResult = await StorageUtils.getAsyncStorageData(
    //   'categories',
    // );
    // if (categoriesResult) {
    //   const categoryObj = categoriesResult.value;
    //   const sortedCategories = categoryObj.sort((a, b) => a.order - b.order);
    //   setCategories(sortedCategories);
    // }
  };

  const selectTable = async table => {
    await StorageUtils.saveAsyncStorageData('table', table);
    navigation.navigate('Menu');
  };

  const updateCustomerState = event => {
    const {name, value} = event.target;
    setCustomerState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const {address1, postcode, contact} = customerState;
    return (
      address1.trim() !== '' && postcode.trim() !== '' && contact.trim() !== ''
    );
  };

  const takeOrder = () => {
    if (isFormValid()) {
      // Proceed with the next steps of taking the order
    } else {
      // Show an error message or handle the invalid form submission
      alert(
        `Please fill out all required fields:\n\nAddress 1, Postcode, Contact Number`,
      );
    }
  };

  const clear = () => {
    setCustomerState({
      address1: '',
      address2: '',
      postcode: '',
      contact: '',
      deliveryNotes: '',
    });
    // setSearchAddress('');
    // setDeliveryNotes('');
  };

  return (
    <View className="bg-light h-full">
      <Header />
      <ScrollView ref={scrollViewRef} className="mt-10">
        {loading ? (
          <HStack space={8} justifyContent="center" alignItems="center">
            <Spinner size="lg" />
          </HStack>
        ) : (
          <>
            <View className="flex flex-row flex-wrap gap-2 justify-center align-middle w-full m-2">
              {[...Array(tables)].map((x, i) => (
                <TouchableOpacity onPress={() => selectTable(i + 1)} key={i}>
                  <Box
                    alignItems="center"
                    className={`w-64 border-1 p-5 bg-custom-light rounded-md ${
                      active(i + 1) ? 'bg-custom-danger' : 'bg-custom-light'
                    }`}>
                    <Box>
                      <Text className="text-3xl text-center text-white mb-4">
                        Table {i + 1}
                      </Text>

                      {active(i + 1) ? (
                        <Box className="bg-custom-amber flex rounded-md p-2">
                          <Text className="text-black font-bold text-center">
                            Clear
                          </Text>
                        </Box>
                      ) : (
                        <Box className="bg-custom-primary flex rounded-md p-2">
                          <Text className="text-white font-bold text-center">
                            Available
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TouchableOpacity>
              ))}
            </View>
            {orderType == 'Delivery' && (
              <View className="flex justify-center w-full m-2 align-middle items-center mb-10">
                <View className="text-center">
                  <Text className="text-3xl font-semibold mb-8">
                    Delivery Order
                  </Text>
                </View>
                <FormControl className="w-96">
                  <Input
                    size="lg"
                    placeholder="Search.."
                    className="bg-white"
                    onSubmitEditing={() => address1Ref.current?.focus()}
                    returnKeyType="next"
                  />

                  {/* Render your search results dropdown here */}
                </FormControl>
                <VStack space={6} mt={6}>
                  <FormControl className="w-96">
                    <Text className="text-xl mb-3">Address 1</Text>
                    <Input
                      ref={address1Ref}
                      size="lg"
                      className="bg-white"
                      name="address1"
                      value={customerState.address1}
                      onChangeText={value =>
                        updateCustomerState({target: {name: 'address1', value}})
                      }
                      onSubmitEditing={() => address2Ref.current?.focus()}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <FormControl className="w-96">
                    <Text className="text-xl mb-3">Address 2</Text>
                    <Input
                      ref={address2Ref}
                      size="lg"
                      className="bg-white"
                      name="address2"
                      value={customerState.address2}
                      onChangeText={value =>
                        updateCustomerState({target: {name: 'address2', value}})
                      }
                      onSubmitEditing={() => postcodeRef.current?.focus()}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <FormControl className="w-96">
                    <Text className="text-xl mb-3">Postcode</Text>
                    <Input
                      ref={postcodeRef}
                      size="lg"
                      className="bg-white"
                      name="postcode"
                      value={customerState.postcode}
                      onChangeText={value =>
                        updateCustomerState({target: {name: 'postcode', value}})
                      }
                      onSubmitEditing={() => contactRef.current?.focus()}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <FormControl className="w-96">
                    <Text className="text-xl mb-3">Contact number</Text>
                    <Input
                      ref={contactRef}
                      size="lg"
                      className="bg-white"
                      keyboardType="number-pad"
                      name="contact"
                      value={customerState.contact}
                      onChangeText={value =>
                        updateCustomerState({target: {name: 'contact', value}})
                      }
                      onSubmitEditing={() => deliveryNotesRef.current?.focus()}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <FormControl className="w-96">
                    <Text className="text-xl mb-3">Delivery notes</Text>
                    <TextArea
                      ref={deliveryNotesRef}
                      size={'lg'}
                      className="bg-white"
                      h={20}
                      placeholder="Notes.."
                      name="deliveryNotes"
                      value={customerState.deliveryNotes}
                      onChangeText={value =>
                        updateCustomerState({
                          target: {name: 'deliveryNotes', value},
                        })
                      }
                    />
                  </FormControl>
                  <HStack mt={6} space={4}>
                    <Button
                      // variant="outline"
                      // colorScheme="yellow"
                      className="bg-custom-amber w-32"
                      onPress={() => clear()}>
                      <Text className=" text-black">Clear</Text>
                    </Button>
                    <Button
                      className="bg-custom-primary w-32"
                      onPress={() => takeOrder()}>
                      Next
                    </Button>
                  </HStack>
                </VStack>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
