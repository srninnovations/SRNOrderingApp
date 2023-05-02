import {Box, Button, HStack, Heading} from 'native-base';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';

export const OrderPlacedComfirmation = ({newOrder, show, edit}) => {
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
              <Button size={'lg'} colorScheme={'cyan'} onPress={newOrder}>
                NEW ORDER
              </Button>
              <Button size={'lg'} colorScheme={'amber'} onPress={edit}>
                EDIT ORDER
              </Button>
            </HStack>
          </View>
        </Box>
      </Modal>
    </>
  );
};
