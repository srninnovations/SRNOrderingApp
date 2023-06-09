import {Box, Button, HStack, Heading} from 'native-base';
import {View, Text} from 'react-native';
import Modal from 'react-native-modal';

export const PrintingOptions = ({
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
            Print options
          </Heading>

          <View className="flex">
            <HStack
              className="justify-center m-4 flex flex-col gap-4"
              space="3"
              px="5"
              pt="2"
              pb={'4'}>
              <Button size={'lg'} colorScheme={'amber'} onPress={kitchenRecipt}>
                PRINT KITCHEN RECEIPT
              </Button>
              <Button
                size={'lg'}
                colorScheme={'amber'}
                onPress={customerReceipt}>
                PRINT CUSTOMER RECEIPT
              </Button>
              <Button size={'lg'} colorScheme={'light'} onPress={close}>
                Close
              </Button>
            </HStack>
          </View>
        </Box>
      </Modal>
    </>
  );
};
