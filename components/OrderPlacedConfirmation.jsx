import {Box, Button, HStack, Heading} from 'native-base';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

export const OrderPlacedConfirmation = ({newOrder, show, edit}) => {
  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={edit}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}>
            Sent to printer
          </Heading>

          <View className="flex">
            <Text className="text-center mt-3 text-xl">Next?</Text>
            <HStack
              className="justify-center m-4"
              space="3"
              px="5"
              pt="2"
              pb={'4'}>
              <TouchableOpacity
                className="py-3 w-28 my-2 rounded bg-cyan-500"
                onPress={newOrder}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  New Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 w-28 my-2 rounded bg-amber-500"
                onPress={edit}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Edit Order
                </Text>
              </TouchableOpacity>
            </HStack>
          </View>
        </Box>
      </Modal>
    </>
  );
};
