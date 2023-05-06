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
import {useState} from 'react';
import Modal from 'react-native-modal';
import AntIcon from 'react-native-vector-icons/AntDesign';

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
      <Button onPress={showModal} size="lg" colorScheme={'danger'}>
        <AntIcon name="delete" size={22} color="white" />
      </Button>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        backdropOpacity={0.35}
        onBackButtonPress={hideModal}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
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
              <Button
                onPress={validateCode}
                my={'2'}
                maxW={'24'}
                size={'md'}
                colorScheme={'lightBlue'}>
                Unlock
              </Button>
            </FormControl>
          )}
          <HStack justifyContent="flex-end" space="3" px="5" pt="2" pb={'4'}>
            <Button
              isDisabled={deleteLoad}
              onPress={hideModal}
              colorScheme={'gray'}>
              Close
            </Button>
            {validPin && (
              <Button
                isLoading={deleteLoad}
                isLoadingText="Deleting"
                onPress={confirmDelete}
                colorScheme={'danger'}>
                Delete
              </Button>
            )}
          </HStack>
        </Box>
      </Modal>
    </>
  );
};
