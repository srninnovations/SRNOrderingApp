import {StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useRef, useContext} from 'react';
import StorageUtils from '../utils/StorageUtils';
import Header from '../components/Header';
import ApiServiceUtils from '../utils/ApiServiceUtils';
import {SelectionConfirmation} from '../components/SelectionConfirmation';
import PeopleSelector from '../components/PeopleSelector';

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
  useToast,
} from 'native-base';
import GlobalContext from '../utils/GlobalContext.';

export default function Selection({navigation}) {
  const [loading, setLoading] = useState(false);
  const context = useContext(GlobalContext);
  const [client, setClient] = useState('');
  const [selectedTable, setSelectedTable] = useState(0);
  const [tables, setTables] = useState(0);
  const [activeTables, setActiveTables] = useState([]);
  const [orderType, setOrderType] = useState('');
  const [customers, setCustomers] = useState([]);

  const [searchAddress, setSearchAddress] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);

  const [show, setShow] = useState(false);
  const [selectorShow, setSelectorShow] = useState(false);

  // const [customerState, setCustomerState] = useState({
  //   name: '',
  //   address1: '',
  //   address2: '',
  //   postcode: '',
  //   contact: '',
  //   deliveryNotes: '',
  // });
  const toast = useToast();

  const scrollViewRef = useRef();

  const nameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const postcodeRef = useRef(null);
  const contactRef = useRef(null);
  const deliveryNotesRef = useRef(null);

  useEffect(() => {
    clear();
    setLoading(true);
    getDetails();
  }, []);

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const showSelectorModal = () => {
    setSelectorShow(true);
  };

  const hideSelectorModal = () => {
    setSelectorShow(false);
  };

  const active = table => {
    if (activeTables) {
      const activeTb = activeTables.find(tb => tb === table);
      if (activeTb) {
        return true;
      }
    }
    return false;
  };

  const getCustomersAddresses = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const params = {
      client: {
        client: client.value,
        client_id: clientId.value,
      },
    };

    const customers = await ApiServiceUtils.getCustomers(params);
    if (customers) {
      setCustomers(customers);
    }
  };

  const updateCustomer = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const body = {
      client: {
        client: client.value,
        client_id: clientId.value,
      },
      address: [
        {
          Address1: context.customerState.address1,
          Address2: context.customerState.address2,
          Postcode: context.customerState.postcode,
          Contact: context.customerState.contact,
        },
      ],
    };
    return await ApiServiceUtils.addCustomer(body);
  };

  const search = value => {
    setSearchAddress(value);
    if (value.length > 2) {
      const entries = Object.entries(customers);
      const filtered = entries.filter(customer => {
        const address1 = customer[1]['Address1'];

        if (address1.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
        return false;
      });

      if (filtered[0]) {
        const details = filtered[0][1];
        const exists = searchResults.filter(res => {
          if (res.Address1 == details.Address1) {
            return res;
          }
        });

        if (exists.length == 0) {
          setSearchResults([
            // with a new array
            ...searchResults, // that contains all the old items
            details, // and one new item at the end
          ]);
        }
        setShowResults(true);
      } else {
        setShowResults(false);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
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
      } else if (orderTypeValue && orderTypeValue == 'Delivery') {
        await getCustomersAddresses();
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const selectTable = async table => {
    setSelectedTable(table);

    const isActive = active(table);
    context.dispatch({type: 'UPDATE_CUSTOMER', field: 'name', payload: table});
    // setCustomerState({
    //   name: table,
    //   address1: '',
    //   address2: '',
    //   postcode: '',
    //   contact: '',
    //   deliveryNotes: '',
    // });

    if (!isActive) {
      showSelectorModal();
    } else {
      setShow(true);
    }
  };

  const startOrder = async () => {
    context.setTableNo(selectedTable);
    // await StorageUtils.saveAsyncStorageData('table', selectedTable);
    // await StorageUtils.saveAsyncStorageData('customerState', {
    //   name: selectedTable,
    //   address1: '',
    //   address2: '',
    //   postcode: '',
    //   contact: '',
    //   deliveryNotes: '',
    // });
    context.dispatch({
      type: 'UPDATE_CUSTOMER',
      field: 'name',
      payload: selectedTable,
    });

    navigation.navigate('Menu');
  };

  const updateCustomerState = object => {
    const {name, value} = object;
    // setCustomerState(prevState => ({
    //   ...prevState,
    //   [name]: value,
    // }));
    context.dispatch({type: 'UPDATE_CUSTOMER', field: name, payload: value});
  };

  const isFormValid = () => {
    if (orderType == 'Delivery') {
      const {address1, postcode, contact} = context.customerState;

      return (
        address1.trim() !== '' &&
        postcode.trim() !== '' &&
        contact.trim() !== ''
      );
    }
    if (orderType == 'Collection') {
      const {name, contact} = context.customerState;
      return name.trim() !== '' && contact.trim() !== '';
    }
    return false;
  };

  const takeOrder = async () => {
    if (isFormValid()) {
      setLoading(true);
      // Proceed with the next steps of taking the order
      if (orderType == 'Delivery') {
        await updateCustomer();
      }
      await StorageUtils.saveAsyncStorageData(
        'customerState',
        context.customerState,
      );
      setLoading(false);
      navigation.navigate('Menu');
    } else {
      // Show an error message or handle the invalid form submission
      if (orderType == 'Delivery') {
        toast.show({
          title:
            'Please fill out all required fields:\n\nAddress 1, Postcode, Contact Number',
        });
      }
      if (orderType == 'Collection') {
        toast.show({
          title: `Please fill out all required fields:\n\nName, Contact Number`,
        });
      }
    }
  };

  const clear = () => {
    context.dispatch({type: 'RESET'});
    // setCustomerState({
    //   name: '',
    //   address1: '',
    //   address2: '',
    //   postcode: '',
    //   contact: '',
    //   deliveryNotes: '',
    // });
    // setSearchAddress('');
    // setDeliveryNotes('');
  };

  const editOrder = async () => {
    setShow(false); // close modal

    context.setTableNo(selectedTable);
    // await StorageUtils.saveAsyncStorageData('table', selectedTable);
    // await StorageUtils.saveAsyncStorageData('customerState', {
    //   name: selectedTable,
    //   address1: '',
    //   address2: '',
    //   postcode: '',
    //   contact: '',
    //   deliveryNotes: '',
    // });
    const orderObj = await ApiServiceUtils.getTableOrder(client, selectedTable);
    // console.log(orderObj.order_id);
    navigation.navigate('Menu', {order_id: JSON.parse(orderObj.order_id)});
  };

  const clearTable = async () => {
    setShow(false); // close modal
    setLoading(true);

    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const body = {
      table: context.customerState.name,
      updateTable: false,
      client: {
        client: client.value,
        client_id: clientId.value,
      },
    };
    await ApiServiceUtils.updateActiveTables(body);

    await getDetails();
  };

  const confirmSelection = async value => {
    hideSelectorModal();
    setLoading(true);
    context.dispatch({type: 'UPDATE_CUSTOMER', field: 'name', payload: value});
    context.setPeople(value);
    // await StorageUtils.saveAsyncStorageData('people', value);
    await startOrder();
  };

  const autoFill = address => {
    updateCustomerState({name: 'address1', value: address.Address1});
    updateCustomerState({name: 'address2', value: address.Address2});
    updateCustomerState({name: 'postcode', value: address.Postcode});
    updateCustomerState({name: 'contact', value: address.Contact.toString()});
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="lg" />
      </View>
    );

  return (
    <View className="bg-light h-full">
      <Header />

      <SelectionConfirmation
        clear={clearTable}
        show={show}
        edit={editOrder}
        hideModal={hideModal}
      />

      <PeopleSelector
        show={selectorShow}
        hideModal={hideSelectorModal}
        confirm={e => confirmSelection(e)}
      />

      <ScrollView ref={scrollViewRef} className="mt-10">
        {orderType == 'Dine In' && (
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
                          Active
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
        )}

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
                value={searchAddress}
                onChangeText={e => search(e)}
              />
            </FormControl>
            {showResults && (
              <View className="relative">
                {searchResults.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      className="py-2 px-4 bg-white border-b border-gray-200"
                      onPress={() => {
                        setShowResults(false);
                        autoFill(item);
                      }}>
                      <Text className="text-gray-700 text-xl">
                        {item.Address1}, {item.Address2}, {item.Postcode}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <VStack space={6} mt={6}>
              <FormControl className="w-96">
                <Text className="text-xl mb-3">Address 1</Text>
                <Input
                  ref={address1Ref}
                  size="lg"
                  className="bg-white"
                  name="address1"
                  value={context.customerState.address1}
                  onChangeText={value =>
                    updateCustomerState({name: 'address1', value})
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
                  value={context.customerState.address2}
                  onChangeText={value =>
                    updateCustomerState({name: 'address2', value})
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
                  value={context.customerState.postcode}
                  onChangeText={value =>
                    updateCustomerState({name: 'postcode', value})
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
                  value={context.customerState.contact}
                  onChangeText={value =>
                    updateCustomerState({name: 'contact', value})
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
                  value={context.customerState.deliveryNotes}
                  onChangeText={value =>
                    updateCustomerState({name: 'deliveryNotes', value})
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

        {orderType == 'Collection' && (
          <View className="flex flex-row flex-wrap gap-2 justify-center align-middle w-full m-2">
            <View className="text-center">
              <Text className="text-3xl font-semibold mb-8">
                Collection Order
              </Text>
              <FormControl className="w-96">
                <Text className="text-xl mb-3">Name</Text>
                <Input
                  ref={nameRef}
                  size="lg"
                  className="bg-white"
                  name="name"
                  value={context.customerState.name}
                  onChangeText={value =>
                    updateCustomerState({name: 'name', value})
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
                  value={context.customerState.contact}
                  onChangeText={value =>
                    updateCustomerState({name: 'contact', value})
                  }
                  onSubmitEditing={() => takeOrder()}
                  returnKeyType="next"
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
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
