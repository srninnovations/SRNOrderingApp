import {
  Alert,
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {TouchableOpacity} from 'react-native';

export const DeleteConfirmation = ({
  confirmDelete,
  show,
  showModal,
  hideModal,
  order,
  deleteLoad,
}) => {
  const [validPin, setValidPin] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [code, setCode] = useState();

  const validCode = 123456;
  const validateCode = e => {
    e.preventDefault();
    if (code == validCode) {
      setValidPin(true);
      setIncorrect(false);
    } else {
      setIncorrect(true);
      setValidPin(false);
    }
  };
  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        backdropOpacity={0.7}
        onBackButtonPress={hideModal}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            className="uppercase"
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}>
            Delete Confirmation
          </Heading>
          {validPin ? (
            <Alert mx={'10'} mt={'5'} mb={2} status="error">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <VStack flexShrink={1} space={2}>
                  <HStack alignItems="center" space={1}>
                    <Alert.Icon />
                    <Text className="text-gray-800 font-medium">
                      Are you sure you want to delete this order,
                    </Text>
                  </HStack>
                  <Text className="pl-4">
                    Order Type: {order ? order.orderType : ''}
                  </Text>
                  <Text className="pl-4">
                    Order ID: {order ? order.order_id : ''}
                  </Text>
                </VStack>
              </HStack>
              <Text className="font-bold text-lg text-red-900 mt-2">
                THIS ACTION CAN NOT BE REVERSED!
              </Text>
            </Alert>
          ) : (
            <FormControl isInvalid={incorrect} maxW={'2/3'} p={'5'}>
              <Input
                keyboardType="number-pad"
                secureTextEntry={true}
                type="password"
                placeholder="Enter Passcode"
                focusOutlineColor={'lightBlue.400'}
                bgColor={'muted.100'}
                colorScheme={'muted'}
                onChangeText={pin => setCode(pin)}
                onSubmitEditing={validateCode}
                invalidOutlineColor={'danger.400'}
                w={'2xs'}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}>
                Invalid pin!
              </FormControl.ErrorMessage>
              <TouchableOpacity
                className="py-2 w-24 my-2 rounded bg-custom-primary"
                onPress={validateCode}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Unlock
                </Text>
              </TouchableOpacity>
            </FormControl>
          )}
          <HStack justifyContent="flex-end" space="3" px="5" pt="2" pb={'4'}>
            <TouchableOpacity
              disabled={deleteLoad}
              className={`py-2 w-24 rounded ${
                !deleteLoad ? 'bg-custom-grey' : 'bg-custom-grey/40'
              } `}
              onPress={hideModal}>
              <Text className="text-white my-auto text-center font-semibold uppercase">
                Close
              </Text>
            </TouchableOpacity>
            {validPin && (
              <TouchableOpacity
                disabled={deleteLoad}
                className={`py-2 w-24 rounded uppercase ${
                  !deleteLoad ? 'bg-custom-danger' : 'bg-custom-danger/40'
                } `}
                onPress={confirmDelete}>
                <Text className="text-white my-auto text-center uppercase font-semibold ">
                  {deleteLoad ? 'Deleting' : 'Delete'}
                </Text>
              </TouchableOpacity>
            )}
          </HStack>
        </Box>
      </Modal>
    </>
  );
};
