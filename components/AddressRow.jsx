import {Box, Center, HStack, Stack} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import AddressDeleteConfirmation from '../components/AddressDeleteConfirmation';
import UpsertCustomer from '../components/UpsertCustomer';
import GlobalContext from '../utils/GlobalContext.';
import StorageUtils from '../utils/StorageUtils';
import ApiServiceUtils from '../utils/ApiServiceUtils';

import AntIcon from 'react-native-vector-icons/AntDesign';
import React, {memo, useState, useContext, useEffect} from 'react';

const AddressRow = ({address, idx, updateAddresses}) => {
  const handleUpdateOpen = address => {
    setisUpdating(true);
    // Object.keys(address).forEach(key => {
    //   context.dispatch({
    //     type: 'UPDATE_CUSTOMER',
    //     field: key.toLowerCase(),
    //     payload: address[key].toString(),
    //   });
    // });
    setShowModal(true);
  };

  const context = useContext(GlobalContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
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
          <Text className="text-black text-lg uppercase">
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
          <Text className="text-black text-lg uppercase">
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
          <Text className="text-black text-lg">{address.Contact}</Text>
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
      <UpsertCustomer
        {...{
          setShowModal,
          showModal,
          isUpdating,
          address,
          onSave: () => {
            updateAddresses();
          },
        }}
      />
      <AddressDeleteConfirmation
        {...{
          showDeleteModal,
          onClose: () => {
            setShowDeleteModal(false);
            setSelectedAddress({});
          },
          onSave: () => {
            updateAddresses();
          },
          selectedAddress,
          handleDelete,
        }}
      />
    </>
  );
};

export default memo(AddressRow);
