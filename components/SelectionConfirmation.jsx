import {Box, Button, HStack, Heading} from 'native-base';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

export const SelectionConfirmation = ({clear, show, edit, hideModal}) => {
  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={hideModal}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}
            className="uppercase">
            Active table
          </Heading>

          <View className="flex">
            <HStack
              className="justify-center m-4"
              space="3"
              px="5"
              pt="2"
              pb={'4'}>
              <TouchableOpacity
                className="py-3 w-28 my-2 rounded bg-cyan-500"
                onPress={edit}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Edit Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-3 w-28 my-2 rounded bg-amber-500"
                onPress={clear}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Clear table
                </Text>
              </TouchableOpacity>
            </HStack>
          </View>

          <HStack justifyContent="flex-end" space="3" px="5" pt="2" pb={'4'}>
            <TouchableOpacity
              className="py-2 w-20 rounded bg-custom-grey"
              onPress={hideModal}>
              <Text className="text-white my-auto text-center font-semibold uppercase">
                Close
              </Text>
            </TouchableOpacity>
          </HStack>
        </Box>
      </Modal>
    </>
  );
};
