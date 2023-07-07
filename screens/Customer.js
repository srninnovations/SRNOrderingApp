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
import ApiServiceUtils from '../utils/ApiServiceUtils';
import StorageUtils from '../utils/StorageUtils';
import GlobalContext from '../utils/GlobalContext.';
import AddressRow from '../components/AddressRow';
import UpsertCustomer from '../components/UpsertCustomer';
import Pagination from '../components/Pagination';
import {paginate} from '../utils/PaginateUtils';

const Customer = ({navigation}) => {
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [paginatedAddresses, setPaginatedAddresses] = useState([]);
  const [isUpdating, setisUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

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
    if (data.length) {
      setAddresses(data);
      setPaginatedAddresses(paginate(data, 10, 1));
      setCurrentPage(1);
    } else {
      setAddresses([]);
    }
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

  const onPageChange = page_number => {
    setCurrentPage(page_number);
    const pageAddresses = paginate(addresses, 10, page_number);
    setPaginatedAddresses(pageAddresses);
  };

  const search = value => {
    setSearchAddress(value);
    if (value.length > 2) {
      const entries = Object.entries(addresses);
      const filtered = entries.filter(customer => {
        const address1 = customer[1]['Address1'];
        const addressLower = address1.toLowerCase();
        const regValue = new RegExp(value);
        if (regValue?.test(addressLower)) {
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
          <HStack justifyContent="space-between" space={10} className="mt-5">
            <TouchableOpacity
              className="px-3 h-12 bg-custom-secondary flex flex-row rounded justify-center items-center"
              onPress={() => {
                setLoading(true);
                getCustomersAddresses();
              }}>
              <AntIcon className="" name="sync" size={15} color="white" />
              <Text className="text-white ml-2 uppercase">Refresh</Text>
            </TouchableOpacity>
            <HStack space={'3'} alignItems={'center'}>
              <Heading className="text-custom-dark uppercase text-xl mb-2">
                Search:
              </Heading>
              <Input
                keyboardType="name-phone-pad"
                size="lg"
                placeholder="Address 1"
                w="2xs"
                h="10"
                focusOutlineColor={'darkBlue.400'}
                className="bg-gray-50"
                onChangeText={value => search(value)}
                // onChangeText={text => filterByOrderId(parseInt(text))}
              />
            </HStack>
            <TouchableOpacity
              className="px-3 h-12 bg-custom-primary flex flex-row rounded justify-center items-center"
              onPress={handleAddOpen}>
              <AntIcon className="" name="plus" size={22} color="white" />
              <Text className="text-white ml-3 uppercase">Add Customer</Text>
            </TouchableOpacity>
          </HStack>
          {addresses.length > 0 && !showResults && (
            <Text className="my-4 text-black uppercase text-xl">
              Addresses: {addresses.length}
            </Text>
          )}
          {showResults && (
            <Text className="my-4 text-green-500 uppercase text-xl">
              Address Found!
            </Text>
          )}
          {addresses.length > 0 ? (
            <VStack minH={'3/5'}>
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
              {showResults
                ? searchResults.map((address, idx) => (
                    <AddressRow
                      key={idx}
                      address={address}
                      updateAddresses={() => {
                        getCustomersAddresses();
                      }}
                    />
                  ))
                : paginatedAddresses.map((address, idx) => (
                    <AddressRow
                      key={idx}
                      address={address}
                      updateAddresses={() => {
                        //maybe for now lets not show the loader and let it refresh in the background
                        // setLoading(true);
                        getCustomersAddresses();
                      }}
                    />
                  ))}
            </VStack>
          ) : (
            <View className="h-[30vh] flex-1 justify-center items-center">
              <Text className="text-3xl text-center text-gray-500">
                No addresses found
              </Text>
            </View>
          )}
          <View className="w-full h-20 pt-4 mb-32 text-black">
            <Pagination
              itemsCount={addresses.length}
              pageSize={10}
              onPageChange={onPageChange}
              currentPage={currentPage}
            />
          </View>
        </ScrollView>
        <UpsertCustomer
          {...{
            setShowModal,
            showModal,
            isUpdating,
            refetch: fetchData,
            onSave: () => {
              getCustomersAddresses();
            },
          }}
        />
      </View>
    </>
  );
};

export default Customer;
