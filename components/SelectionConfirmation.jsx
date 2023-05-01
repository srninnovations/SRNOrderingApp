import {Box, Button, HStack, Heading} from 'native-base';
import {View} from 'react-native';
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
            py={4}>
            Active table
          </Heading>

          <View className="flex">
            <HStack
              className="justify-center m-4"
              space="3"
              px="5"
              pt="2"
              pb={'4'}>
              <Button size={'lg'} colorScheme={'cyan'} onPress={edit}>
                Edit order
              </Button>
              <Button size={'lg'} colorScheme={'amber'} onPress={clear}>
                Clear table
              </Button>
            </HStack>
          </View>

          <HStack justifyContent="flex-end" space="3" px="5" pt="2" pb={'4'}>
            <Button onPress={hideModal} colorScheme={'gray'}>
              Close
            </Button>
          </HStack>
        </Box>
      </Modal>
    </>
  );
};
