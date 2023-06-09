import React, {useContext, useEffect, useRef, useState, memo} from 'react';
import {
  AlertDialog,
  Box,
  Button,
  Center,
  FormControl,
  HStack,
  Input,
  TextArea,
  VStack,
  useToast,
} from 'native-base';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GlobalContext from '../utils/GlobalContext.';
import ApiServiceUtils from '../utils/ApiServiceUtils';
import StorageUtils from '../utils/StorageUtils';
import CustomToast from './CustomToast';
import UniqueID from '../utils/UniqueIdUtils';

function UpsertCustomer({
  showModal,
  setShowModal,
  isUpdating,
  address,
  onSave,
}) {
  const toast = useToast();
  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(true);

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [contact, setContact] = useState('');
  const [postcode, setPostcode] = useState('');

  useEffect(() => {
    setAddress1(address?.Address1);
    setAddress2(address?.Address2);
    setContact(address?.Contact?.toString());
    setPostcode(address?.Postcode);
  }, []);

  useEffect(() => {
    if (
      address1?.length > 0 &&
      contact?.toString().length > 0 &&
      postcode?.length > 0
    )
      setInvalid(false);
    else setInvalid(true);
  }, [address1, contact, postcode]);
  const cancelRef = useRef();
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const postcodeRef = useRef(null);
  const contactRef = useRef(null);

  const clear = () => {
    context.dispatch({type: 'RESET'});
    address1Ref?.current?.clear();
    address2Ref?.current?.clear();
    postcodeRef?.current?.clear();
    contactRef?.current?.clear();
    setInvalid(true);
  };

  const onClose = () => {
    setShowModal(false);
    clear();
  };

  // const updateCustomerState = object =>
  //   context.dispatch({
  //     type: 'UPDATE_CUSTOMER',
  //     field: object.name,
  //     payload: object.value,
  //   });

  const insertDetails = async () => {
    setLoading(true);
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const body = {
      client: {
        client: client.value,
        client_id: clientId.value,
      },
      address: [
        {
          Address1: address1.toUpperCase(),
          Address2: address2?.toUpperCase(),
          address_id: UniqueID(),
          Postcode: postcode,
          Contact: contact,
        },
      ],
    };
    return await ApiServiceUtils.addCustomer(body);
  };

  const updateDetails = async () => {
    setLoading(true);
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');

    const body = {
      client: {
        client: client.value,
        client_id: clientId.value,
      },
      address: {
        Address1: address1.toUpperCase(),
        Address2: address2.toUpperCase(),
        address_id: Number(address.address_id),
        Postcode: postcode,
        Contact: contact,
      },
    };
    return await ApiServiceUtils.editCustomer(body);
  };

  const handleSaveDetails = async () => {
    if (address1 == '' || postcode == '' || contact == '') {
      return;
    }

    const res = isUpdating ? await updateDetails() : await insertDetails();
    if (res) {
      !toast.isActive('edit-customer') &&
        toast.show({
          id: 'edit-customer',
          render: () => <CustomToast title={'Your changes were saved.'} />,
          duration: 3000,
        });
      onSave();
    } else {
      !toast.isActive('edit-customer') &&
        toast.show({
          id: 'edit-customer',
          render: () => (
            <CustomToast
              title={
                'Unexpected error occurred while getting history, please log out and try again. If the issue persists please contact us'
              }
            />
          ),
        });
    }
    onClose();
    setLoading(false);
  };

  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={showModal}
        onClose={onClose}
        motionPreset={'fade'}>
        <AlertDialog.Content maxW={'3/5'}>
          <AlertDialog.Header fontWeight="bold">
            <Text className="text-3xl text-gray-900">
              {isUpdating ? 'Edit Customer Details' : 'Add Customer'}
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <View className="flex justify-center w-full px-10 align-middle items-center my-5">
              <VStack mt={1}>
                <HStack space={6}>
                  <Box>
                    <FormControl className="w-72 mb-3">
                      <Text className="text-xl uppercase mb-3 text-black">
                        Address 1<Text className="text-red-500">*</Text>
                      </Text>
                      <Input
                        ref={address1Ref}
                        size="lg"
                        className="bg-white"
                        name="address1"
                        value={address1}
                        onChangeText={value => setAddress1(value)}
                        onSubmitEditing={() => address2Ref.current?.focus()}
                        returnKeyType="next"
                      />
                    </FormControl>
                    <FormControl className="w-72 mb-3">
                      <Text className="text-xl uppercase mb-3 text-black">
                        Address 2
                      </Text>
                      <Input
                        ref={address2Ref}
                        size="lg"
                        className="bg-white"
                        name="address2"
                        value={address2}
                        onChangeText={value => setAddress2(value)}
                        onSubmitEditing={() => postcodeRef.current?.focus()}
                        returnKeyType="next"
                      />
                    </FormControl>
                    <FormControl className="w-72 mb-3">
                      <Text className="text-xl uppercase mb-3 text-black">
                        Postcode<Text className="text-red-500">*</Text>
                      </Text>
                      <Input
                        ref={postcodeRef}
                        size="lg"
                        className="bg-white"
                        name="postcode"
                        value={postcode}
                        onChangeText={value => setPostcode(value)}
                        onSubmitEditing={() => contactRef.current?.focus()}
                        returnKeyType="next"
                      />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl className="w-72 mb-3">
                      <Text className="text-xl uppercase mb-3 text-black">
                        Contact Number<Text className="text-red-500">*</Text>
                      </Text>
                      <Input
                        ref={contactRef}
                        size="lg"
                        className="bg-white"
                        keyboardType="number-pad"
                        name="contact"
                        value={contact}
                        onChangeText={value => setContact(value)}
                        // onSubmitEditing={handleSaveDetails}
                        returnKeyType="done"
                      />
                    </FormControl>
                  </Box>
                </HStack>
                <HStack mt={6} space={4}>
                  <TouchableOpacity
                    disabled={loading}
                    className={`px-5 py-2.5 w-32 rounded ${
                      !loading ? 'bg-custom-warning' : 'bg-custom-warning/50'
                    }`}
                    onPress={clear}>
                    <Text className="text-lg text-white my-auto font-semibold uppercase text-center">
                      Clear
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`px-5 py-1 w-36 rounded  ${
                      loading || invalid
                        ? 'bg-custom-primary/50'
                        : 'bg-custom-primary'
                    }`}
                    disabled={loading || invalid}
                    onPress={handleSaveDetails}>
                    <Text className="text-white text-lg my-auto font-semibold uppercase text-center">
                      {!loading ? 'Save' : 'Saving...'}
                    </Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </View>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <TouchableOpacity
              className={`rounded px-6 h-14 items-center justify-center ${
                loading ? 'bg-custom-grey/50' : 'bg-custom-grey'
              }`}
              disabled={loading}
              ref={cancelRef}
              onPress={onClose}>
              <Text className="text-white font-medium text-lg uppercase">
                Close
              </Text>
            </TouchableOpacity>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
}

export default memo(UpsertCustomer);
