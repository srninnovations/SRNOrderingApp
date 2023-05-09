import {Box, Button, HStack, Heading} from 'native-base';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

export const OrderUpdatedConfirmation = ({
  newOrder,
  show,
  close,
  kitchenRecipt,
  customerReceipt,
}) => {
  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={close}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}>
            Order updated
          </Heading>

          <View className="flex">
            <Text className="text-center mt-3 mb-4 text-xl">Next?</Text>
            <HStack
              className="justify-center m-4 flex flex-col gap-4"
              space="3"
              px="5"
              pt="2"
              pb="4">
              <TouchableOpacity
                className="py-2 w-full my-2 rounded bg-cyan-500"
                onPress={newOrder}>
                <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                  New Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 w-full my-2 rounded bg-amber-500"
                onPress={kitchenRecipt}>
                <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                  PRINT KITCHEN RECEIPT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 w-full my-2 rounded bg-amber-500"
                onPress={customerReceipt}>
                <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                  PRINT CUSTOMER RECEIPT
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 w-full my-2 rounded bg-custom-grey"
                onPress={close}>
                <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                  Close
                </Text>
              </TouchableOpacity>
              {/* <Button size={'lg'} colorScheme={'amber'} onPress={kitchenRecipt}>
                PRINT KITCHEN RECEIPT
              </Button> */}
              {/* <Button
                size={'lg'}
                colorScheme={'amber'}
                onPress={customerReceipt}>
                PRINT CUSTOMER RECEIPT
              </Button> */}
            </HStack>
          </View>
        </Box>
      </Modal>
    </>
  );
};
