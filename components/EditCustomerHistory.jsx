import {
  Spinner,
  Box,
  Text,
  TextArea,
  FormControl,
  Input,
  HStack,
  VStack,
  useToast,
  Heading,
  Stack,
} from 'native-base';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import ApiServiceUtils from '../utils/ApiServiceUtils';
import StorageUtils from '../utils/StorageUtils';
import Modal from 'react-native-modal';
import React, {useRef, useContext, useState} from 'react';
import GlobalContext from '../utils/GlobalContext.';
import FeatherIcon from 'react-native-vector-icons/Feather';
import CustomToast from './CustomToast';

const EditCustomerHistory = ({show, handleClose, refetch, next}) => {
  const toast = useToast();
  const context = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  const nameRef = useRef(null);
  const address1Ref = useRef(null);
  const address2Ref = useRef(null);
  const postcodeRef = useRef(null);
  const contactRef = useRef(null);
  const deliveryNotesRef = useRef(null);

  const updateCustomerState = object =>
    context.dispatch({
      type: 'UPDATE_CUSTOMER',
      field: object.name,
      payload: object.value,
    });
  console.log(context.customerState);

  const clear = () => {
    context.dispatch({type: 'RESET'});
    nameRef?.current?.clear();
    address1Ref?.current?.clear();
    address2Ref?.current?.clear();
    postcodeRef?.current?.clear();
    contactRef?.current?.clear();
    deliveryNotesRef?.current?.clear();
  };

  const editCustomerDetails = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const order = await ApiServiceUtils.getSpecificOrder({
      client_id: clientId.value,
      order_id: context.orderId,
    });
    const newOrder = {...order};
    newOrder.customer = context.customerState;
    const newParams = {
      history: newOrder,
      client: {
        order_id: context.orderId,
        client_id: clientId.value,
      },
    };
    const res = await ApiServiceUtils.updateHistory(newParams);
    if (res.acknowledged || res.modified) {
      !toast.isActive('edit-customer') &&
        toast.show({
          id: 'edit-customer',
          render: () => <CustomToast title={'Your changes were saved.'} />,
          duration: 3000,
        });
      refetch();
      handleClose();
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
    context.setOrderId(0);
    setLoading(false);
  };

  const handleSaveDetails = async () => {
    setLoading(true);
    await editCustomerDetails();
  };

  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={handleClose}>
        <Box
          width={'full'}
          maxW={context.orderType === 'Delivery' ? '4/5' : 'md'}
          bgColor={'white'}
          borderRadius={'md'}>
          <Stack
            py={4}
            px={5}
            direction={'row'}
            borderBottomWidth={1}
            justifyContent={'space-between'}
            //  alignItems={'center'}
          >
            <Heading
              fontWeight={'semibold'}
              color={'gray.800'}
              borderColor={'gray.400'}>
              Edit Customer Details
            </Heading>
            <TouchableOpacity onPress={handleClose}>
              <Text className="pt-4">
                <FeatherIcon name="x" size={40} color="#555" />
              </Text>
            </TouchableOpacity>
          </Stack>

          <ScrollView>
            <View className="flex">
              <HStack
                className="justify-center m-4 flex flex-col gap-4"
                space="3"
                px="5"
                pt="2"
                pb={'4'}>
                {context.orderType == 'Delivery' && (
                  <View className="flex justify-center w-full m-2 align-middle items-center mb-10">
                    <VStack space={6} mt={6}>
                      <HStack space={6}>
                        <Box>
                          <FormControl className="w-96 mb-3">
                            <Text className="text-xl uppercase mb-3">
                              Address 1
                            </Text>
                            <Input
                              ref={address1Ref}
                              size="lg"
                              className="bg-white"
                              name="address1"
                              value={context.customerState.address1}
                              onChangeText={value =>
                                updateCustomerState({name: 'address1', value})
                              }
                              onSubmitEditing={() =>
                                address2Ref.current?.focus()
                              }
                              returnKeyType="next"
                            />
                          </FormControl>
                          <FormControl className="w-96 mb-3">
                            <Text className="text-xl uppercase mb-3">
                              Address 2
                            </Text>
                            <Input
                              ref={address2Ref}
                              size="lg"
                              className="bg-white"
                              name="address2"
                              value={context.customerState.address2}
                              onChangeText={value =>
                                updateCustomerState({name: 'address2', value})
                              }
                              onSubmitEditing={() =>
                                postcodeRef.current?.focus()
                              }
                              returnKeyType="next"
                            />
                          </FormControl>
                          <FormControl className="w-96 mb-3">
                            <Text className="text-xl uppercase mb-3">
                              Postcode
                            </Text>
                            <Input
                              ref={postcodeRef}
                              size="lg"
                              className="bg-white"
                              name="postcode"
                              value={context.customerState.postcode}
                              onChangeText={value =>
                                updateCustomerState({name: 'postcode', value})
                              }
                              onSubmitEditing={() =>
                                contactRef.current?.focus()
                              }
                              returnKeyType="next"
                            />
                          </FormControl>
                        </Box>
                        <Box>
                          <FormControl className="w-96 mb-3">
                            <Text className="text-xl uppercase mb-3">
                              Contact Number
                            </Text>
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
                              onSubmitEditing={() =>
                                deliveryNotesRef.current?.focus()
                              }
                              returnKeyType="next"
                            />
                          </FormControl>
                          <FormControl className="w-96">
                            <Text className="text-xl uppercase mb-3">
                              Delivery Notes
                            </Text>
                            <TextArea
                              ref={deliveryNotesRef}
                              size={'lg'}
                              className="bg-white"
                              h={20}
                              placeholder="Notes.."
                              name="deliveryNotes"
                              value={context.customerState.deliveryNotes}
                              onChangeText={value =>
                                updateCustomerState({
                                  name: 'deliveryNotes',
                                  value,
                                })
                              }
                            />
                          </FormControl>
                        </Box>
                      </HStack>
                      <HStack mt={6} space={4}>
                        <TouchableOpacity
                          disabled={loading}
                          className={`px-5 py-2.5 w-32 rounded ${
                            !loading
                              ? 'bg-custom-warning'
                              : 'bg-custom-warning/50'
                          }`}
                          onPress={clear}>
                          <Text className="tracking-wide text-white my-auto font-semibold uppercase text-center">
                            Clear
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className={`px-5 py-1 w-36 rounded  ${
                            loading
                              ? 'bg-custom-primary/50'
                              : 'bg-custom-primary'
                          }`}
                          disabled={loading}
                          onPress={handleSaveDetails}>
                          <Text className="text-white my-auto font-semibold uppercase text-center">
                            {!loading ? 'Save' : 'Saving...'}
                          </Text>
                        </TouchableOpacity>
                      </HStack>
                    </VStack>
                  </View>
                )}

                {context.orderType == 'Collection' && (
                  <View className="flex flex-row flex-wrap gap-2 justify-center align-middle w-full m-2">
                    <View className="text-center">
                      <FormControl className="w-96">
                        <Text className="text-xl uppercase mb-3">Name</Text>
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
                        <Text className="text-xl uppercase mb-3">
                          Contact Number
                        </Text>
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
                          onSubmitEditing={handleSaveDetails}
                          returnKeyType="done"
                        />
                      </FormControl>
                      <HStack mt={6} space={4}>
                        <TouchableOpacity
                          disabled={loading}
                          className={`px-5 py-2.5 w-32 rounded ${
                            !loading
                              ? 'bg-custom-warning'
                              : 'bg-custom-warning/50'
                          }`}
                          onPress={clear}>
                          <Text className="tracking-wide text-white my-auto font-semibold uppercase text-center">
                            Clear
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          className={`px-5 py-1 w-36 rounded  ${
                            loading
                              ? 'bg-custom-primary/50'
                              : 'bg-custom-primary'
                          }`}
                          disabled={loading}
                          onPress={handleSaveDetails}>
                          <Text className="text-white my-auto font-semibold uppercase text-center">
                            {!loading ? 'Save' : 'Saving...'}
                          </Text>
                        </TouchableOpacity>
                      </HStack>
                    </View>
                  </View>
                )}
              </HStack>
            </View>
          </ScrollView>
        </Box>
      </Modal>
    </>
  );
};

export default EditCustomerHistory;
