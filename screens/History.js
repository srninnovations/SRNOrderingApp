import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../components/Header';
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
import GlobalContext from '../utils/GlobalContext.';
import StorageUtils from '../utils/StorageUtils';
import ApiServiceUtils from '../utils/ApiServiceUtils';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Ignore from '../utils/Ignore';
import {DeleteConfirmation} from '../components/DeleteConfirmation';
import ViewModal from '../components/ViewModal';
import DeleteAllConfirm from '../components/DeleteAllConfirm';
import * as RNLocalize from 'react-native-localize';
import moment from 'moment-timezone';
import CustomToast from '../components/CustomToast';
import EditCustomerHistory from '../components/EditCustomerHistory';

export default function History({navigation}) {
  Ignore();
  const toast = useToast();
  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filterDineIn, setFilterDineIn] = useState(false);
  const [filterDelivery, setFilterDelivery] = useState(false);
  const [filterCollection, setFilterCollection] = useState(false);
  const [filterByIdFound, setFilterByIdFound] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [deleteLoad, setDeleteLoad] = useState(false);

  useEffect(() => {
    if (context.staff == '') {
      navigation.navigate('Dashboard');
      if (!toast.isActive('staff'))
        toast.show({
          id: 'staff',
          render: () => <CustomToast title="Select a staff to view history" />,
        });
    } else {
      setLoading(true);
      getHistoryData();
    }
  }, []);

  useEffect(() => {
    const filterOrders = [...allOrders];

    const filtered = filterOrders.filter(order => {
      if (
        (filterCollection && order.orderType.toLowerCase() == 'collection') ||
        (filterDelivery && order.orderType.toLowerCase() == 'delivery') ||
        (filterDineIn && order.orderType.toLowerCase() == 'dine in')
      ) {
        return order;
      }

      if (!filterCollection && !filterDelivery && !filterDineIn) {
        return order;
      }
    });

    setOrders(filtered);
  }, [filterCollection, filterDelivery, filterDineIn]);

  const getHistoryData = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    if (clientId.value) {
      const history = await ApiServiceUtils.getOrders(clientId.value);
      if (history) {
        const sorted = history.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
        );

        setOrders(sorted);
        setAllOrders(sorted);
        await StorageUtils.saveAsyncStorageData('history', sorted);
      }
    } else
      toast.show({
        render: () => (
          <CustomToast title="Unexpected error occurred while getting history, please log out and try again. If the issue persists please contact us." />
        ),
      });
    setLoading(false);
  };

  const filterByOrderId = orderId => {
    // if (orderId) {
    // }
    const filtered = allOrders.filter(o => o.order_id === orderId);
    if (filtered.length > 0) {
      setFilterByIdFound(true);
      setOrders(filtered);
    } else {
      setFilterByIdFound(false);
      setOrders(allOrders);
    }
  };
  const showModal = order => {
    setSelectedOrder(order);
    setShow(true);
  };

  const hideModal = () => {
    clearTimeout(setTimeout(() => setSelectedOrder({}), 500));
    setShow(false);
  };

  const hideDeleteAllModal = () => {
    setShowAll(false);
  };

  const convertMillisToTime = millis => {
    const date = new Date(millis);
    const deviceTimeZone = RNLocalize.getTimeZone();
    return moment(date).tz(deviceTimeZone).format('HH:mm');
    // return moment(date).tz('Europe/London').format('HH:mm');
  };

  const confirmDelete = async order => {
    setDeleteLoad(true);
    const client = await StorageUtils.getAsyncStorageData('client');
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const res = await ApiServiceUtils.deleteHistory({
      client: client.value,
      client_id: clientId.value,
      order_id: order.order_id,
    });

    if (res === 200) {
      const filteredHistory = orders.filter(o => o.order_id !== order.order_id);
      setOrders(filteredHistory);
      setAllOrders(filteredHistory);
      hideModal();
      if (!toast.isActive('delete'))
        toast.show({
          id: 'delete',
          render: () => <CustomToast title={'Deleted Successfully!'} />,
          duration: 3000,
        });
    }
  };

  const confirmDeleteAll = async () => {
    const client = await StorageUtils.getAsyncStorageData('client');
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    setDeleteLoad(true);
    const res = await ApiServiceUtils.deleteAllHistory({
      client: client.value,
      client_id: clientId.value,
    });

    if (res === 200) {
      setOrders([]);
      setAllOrders([]);
      hideDeleteAllModal();
      if (!toast.isActive('delete-all'))
        toast.show({
          id: 'delete-all',
          render: () => <CustomToast title="Cleared all orders!" />,
          duration: 3000,
        });
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
            History
          </Text>
          {allOrders.length > 0 && (
            <HStack
              justifyContent="space-between"
              space={10}
              className="px-3 mt-5">
              <Checkbox.Group accessibilityLabel="Filter history">
                <Heading className="text-custom-dark uppercase text-xl">
                  Filter by:
                </Heading>
                <VStack space={1} my={2}>
                  <Checkbox
                    onChange={isChecked => setFilterCollection(isChecked)}
                    value="Collection">
                    <Text className="text-black text-xl">Collection</Text>
                  </Checkbox>
                  <Checkbox
                    onChange={isChecked => setFilterDelivery(isChecked)}
                    value="Delivery">
                    <Text className="text-black text-xl">Delivery</Text>
                  </Checkbox>
                  <Checkbox
                    className="text-xl"
                    onChange={isChecked => setFilterDineIn(isChecked)}
                    value="Dine In">
                    <Text className="text-black text-xl">Dine In</Text>
                  </Checkbox>
                </VStack>
              </Checkbox.Group>
              <VStack>
                <Heading className="text-custom-dark uppercase text-xl mb-2">
                  Find by:
                </Heading>
                <Input
                  keyboardType="numeric"
                  size="lg"
                  placeholder="Order ID"
                  w="2xs"
                  h="10"
                  focusOutlineColor={'darkBlue.400'}
                  className="bg-gray-50"
                  onChangeText={text => filterByOrderId(parseInt(text))}
                />
              </VStack>
              {orders.length > 0 && (
                <DeleteAllConfirm
                  heading={'Are you sure you want to delete all orders?'}
                  message={
                    'This will delete all order types and clear all tables.'
                  }
                  order={selectedOrder}
                  show={showAll}
                  deleteLoad={deleteLoad}
                  showModal={() => setShowAll(true)}
                  hideModal={hideDeleteAllModal}
                  confirmDelete={async () => {
                    await confirmDeleteAll();
                    setDeleteLoad(false);
                  }}
                />
              )}
            </HStack>
          )}
          {orders.length > 0 && !loading ? (
            <>
              {filterByIdFound ? (
                <Text className="m-2 text-green-400">Found order</Text>
              ) : (
                <Text className="my-4 text-black uppercase text-xl">
                  Orders: {orders.length}
                </Text>
              )}
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
                      Order type
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
                      Order time
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
                      Order id
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
                      Served by
                    </Text>
                  </Box>
                  <Center h="10" borderColor="gray.400" maxW={'1/5'} w="full">
                    <Text className="text-black uppercase font-semibold text-xl">
                      Action
                    </Text>
                  </Center>
                </HStack>
                {orders.map((order, index) => (
                  <HStack
                    key={order.order_id}
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
                      <Text className="text-black text-lg">
                        {order.orderType}{' '}
                        {order.orderType.toUpperCase() == 'COLLECTION' && (
                          <Text className="ml-2 text-sm">
                            {'\n'}
                            {order.customer.name}
                          </Text>
                        )}
                        {order.orderType.toUpperCase() == 'DINE IN' && (
                          <>
                            <Text className="px-2 text-sm">
                              {'\n'}Table {order.customer.name}
                            </Text>
                          </>
                        )}
                        {order.orderType.toUpperCase() == 'DELIVERY' && (
                          <>
                            <Text className="px-2 text-sm">
                              {'\n'}
                              {order.customer.address1}
                            </Text>
                          </>
                        )}
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
                        {convertMillisToTime(order.orderDate)}
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
                        {order.order_id}
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
                      <Text className="text-black text-lg">{order.staff}</Text>
                    </Box>
                    <Center h="16" borderColor="gray.400" maxW={'1/5'} w="full">
                      <Stack
                        direction="row"
                        flex={1}
                        space={2}
                        justifyContent="center"
                        alignItems="center">
                        <ViewModal
                          showEditModal={() => {
                            setShowEdit(true);
                          }}
                          order={order}
                        />
                        <TouchableOpacity
                          className="p-2.5 bg-gray-600 rounded"
                          onPress={() =>
                            navigation.navigate('Menu', {
                              order_id: order.order_id,
                            })
                          }>
                          <AntIcon name="edit" size={22} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="p-2.5 bg-custom-danger rounded"
                          onPress={() => showModal(order)}>
                          <AntIcon name="delete" size={22} color="white" />
                        </TouchableOpacity>
                      </Stack>
                    </Center>
                  </HStack>
                ))}
              </VStack>
              <DeleteConfirmation
                order={selectedOrder}
                show={show}
                hideModal={hideModal}
                deleteLoad={deleteLoad}
                confirmDelete={async () => {
                  await confirmDelete(selectedOrder);
                  setDeleteLoad(false);
                }}
              />
              <EditCustomerHistory
                {...{
                  show: showEdit,
                  handleClose: () => setShowEdit(false),
                  refetch: () => {
                    setLoading(true);
                    getHistoryData();
                  },
                }}
              />
            </>
          ) : (
            <View className="h-[30vh] w-full flex-1 justify-center items-center">
              <Text className="text-3xl text-center text-gray-500">
                No orders found
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}
