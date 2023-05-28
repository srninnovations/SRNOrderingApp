import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {
  Box,
  Center,
  Checkbox,
  HStack,
  Heading,
  Input,
  Spinner,
  Stack,
  VStack,
  useToast,
} from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import React, {useState, useEffect, useContext} from 'react';
import Header from '../components/Header';
import DeleteAllConfirm from '../components/DeleteAllConfirm';
import UpsertCustomer from '../components/UpsertCustomer';
import ApiServiceUtils from '../utils/ApiServiceUtils';
import StorageUtils from '../utils/StorageUtils';
import GlobalContext from '../utils/GlobalContext.';
import AddressDeleteConfirmation from '../components/AddressDeleteConfirmation';

const Customer = ({navigation}) => {
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomersAddresses = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const params = {
      client: {
        client: client.value,
        client_id: clientId.value,
      },
    };

    const data = await ApiServiceUtils.getCustomers(params);
    if (data.length) setAddresses(data);
    setLoading(false);
  };

  const fetchData = () => {
    setLoading(true);
    getCustomersAddresses();
  };

  const handleAddOpen = () => {
    setisUpdating(false);
    setShowModal(true);
  };

  const handleUpdateOpen = address => {
    setisUpdating(true);
    Object.keys(address).forEach(key => {
      context.dispatch({
        type: 'UPDATE_CUSTOMER',
        field: key.toLowerCase(),
        payload: address[key].toString(),
      });
    });
    setShowModal(true);
  };

  const handleDeleteOpen = address => {
    setSelectedAddress(address);
    setShowDeleteModal(true);
  };

  const handleDelete = async address => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');
    return await ApiServiceUtils.deleteCustomer(
      JSON.stringify({client_id: clientId.value, client: client.value}),
      JSON.stringify(address),
    );
  };
  if (loading)
    return (
      <View className="h-screen w-full flex-1 justify-center items-center">
        <Spinner size="lg" />
      </View>
    );

  return (
    <>
      <Header />
      <View className="px-20 bg-white min-h-screen">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-3xl font-medium uppercase text-center text-custom-dark py-5 border-b border-custom-border-color w-full">
            Manage Customer Addresses
          </Text>
          {addresses.length > 0 && (
            <HStack justifyContent="flex-end" space={10} className="mt-5">
              <TouchableOpacity
                className="px-3 h-12 bg-custom-primary flex flex-row rounded justify-center items-center"
                onPress={handleAddOpen}>
                <AntIcon className="" name="plus" size={22} color="white" />
                <Text className="text-white ml-3 uppercase">Add Customer</Text>
              </TouchableOpacity>
              {/* {true && (
                <DeleteAllConfirm
                  heading="Are you sure you want to delete all customers?"
                  message="This will delete all addresses, contacts and postcodes."
                  // order={selectedOrder}
                  // show={true}
                  // deleteLoad={deleteLoad}
                  // showModal={() => setShowAll(true)}
                  // hideModal={hideDeleteAllModal}
                  // confirmDelete={async () => {
                  //   await confirmDeleteAll();
                  //   setDeleteLoad(false);
                  // }}
                />
              )} */}
            </HStack>
          )}
          {addresses.length > 0 && (
            <Text className="my-4 text-black uppercase text-xl">
              Addresses: {addresses.length}
            </Text>
          )}
          {addresses.length > 0 ? (
            <VStack minH={'3/5'} pb="32">
              <HStack
                justifyContent="center"
                borderColor="gray.400"
                borderWidth={'1'}
                color={'gray.800'}>
                <Box
                  justifyContent="center"
                  pl={2}
                  h="10"
                  borderRightWidth={'1'}
                  borderColor="gray.400"
                  maxW={'1/5'}
                  w="full">
                  <Text className="text-black uppercase font-semibold text-xl">
                    Address 1
                  </Text>
                </Box>
                <Box
                  justifyContent="center"
                  pl={2}
                  borderRightWidth={'1'}
                  h="10"
                  borderColor="gray.400"
                  maxW={'1/5'}
                  w="full">
                  <Text className="text-black uppercase font-semibold text-xl">
                    Address 2
                  </Text>
                </Box>
                <Box
                  justifyContent="center"
                  pl={2}
                  borderRightWidth={'1'}
                  h="10"
                  borderColor="gray.400"
                  maxW={'1/5'}
                  w="full">
                  <Text className="text-black uppercase font-semibold text-xl">
                    Contact
                  </Text>
                </Box>
                <Box
                  justifyContent="center"
                  pl={2}
                  borderRightWidth={'1'}
                  h="10"
                  borderColor="gray.400"
                  maxW={'1/5'}
                  w="full">
                  <Text className="text-black uppercase font-semibold text-xl">
                    Postcode
                  </Text>
                </Box>
                <Center h="10" borderColor="gray.400" maxW={'1/5'} w="full">
                  <Text className="text-black uppercase font-semibold text-xl">
                    Action
                  </Text>
                </Center>
              </HStack>
              {addresses.map((address, idx) => (
                <HStack
                  key={idx}
                  justifyContent="center"
                  borderColor="gray.400"
                  borderWidth="1"
                  color="gray.800">
                  <Box
                    justifyContent="center"
                    pl={2}
                    h="16"
                    borderRightWidth={'1'}
                    borderColor="gray.400"
                    maxW={'1/5'}
                    w="full">
                    <Text className="text-black text-lg capitalize">
                      {address.Address1}
                    </Text>
                  </Box>
                  <Box
                    justifyContent="center"
                    pl={2}
                    borderRightWidth={'1'}
                    h="16"
                    borderColor="gray.400"
                    maxW={'1/5'}
                    w="full">
                    <Text className="text-black text-lg capitalize">
                      {address.Address2}
                    </Text>
                  </Box>
                  <Box
                    justifyContent="center"
                    pl={2}
                    borderRightWidth={'1'}
                    h="16"
                    borderColor="gray.400"
                    maxW={'1/5'}
                    w="full">
                    <Text className="text-black text-lg">
                      {address.Contact}
                    </Text>
                  </Box>
                  <Box
                    justifyContent="center"
                    pl={2}
                    borderRightWidth={'1'}
                    h="16"
                    borderColor="gray.400"
                    maxW={'1/5'}
                    w="full">
                    <Text className="text-black text-lg uppercase">
                      {address.Postcode}
                    </Text>
                  </Box>
                  <Center h="16" borderColor="gray.400" maxW={'1/5'} w="full">
                    <Stack
                      direction="row"
                      flex={1}
                      space={2}
                      justifyContent="center"
                      alignItems="center">
                      <TouchableOpacity
                        className="p-2.5 bg-gray-600 rounded"
                        onPress={() => handleUpdateOpen(address)}>
                        <AntIcon name="edit" size={22} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="p-2.5 bg-custom-danger rounded"
                        onPress={() => handleDeleteOpen(address)}>
                        <AntIcon name="delete" size={22} color="white" />
                      </TouchableOpacity>
                    </Stack>
                  </Center>
                </HStack>
              ))}
            </VStack>
          ) : (
            <View className="h-[30vh] flex-1 justify-center items-center">
              <Text className="text-3xl text-center text-gray-500">
                No addresses found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <UpsertCustomer
        {...{
          setShowModal,
          showModal,
          isUpdating,
          refetch: fetchData,
        }}
      />
      <AddressDeleteConfirmation
        {...{
          showDeleteModal,
          onClose: () => {
            setShowDeleteModal(false);
            setSelectedAddress({});
          },
          selectedAddress,
          handleDelete,
        }}
      />
    </>
  );
};

export default Customer;
