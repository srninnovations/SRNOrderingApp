import {
  FormControl,
  Box,
  Input,
  Text,
  WarningOutlineIcon,
  Heading,
} from 'native-base';
import {TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';

const PrivateScreen = ({navigation, screenName, show, hideModal}) => {
  const [validPin, setValidPin] = useState(false);
  const [incorrect, setIncorrect] = useState(false);
  const [code, setCode] = useState();

  const validCode = 123456;
  const validateCode = e => {
    e.preventDefault();
    if (code == validCode) {
      setValidPin(true);
      setIncorrect(false);
      navigation.navigate(screenName);
      hideModal();
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
        <Box width={'full'} maxW={'lg'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            className="capitalize"
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}>
            {screenName} - Authorize Access
          </Heading>
          <FormControl isInvalid={incorrect} maxW={'2/3'} p={'5'}>
            <Input
              className="text-2xl"
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
              isFocused={true}
            />
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}>
              Invalid pin!
            </FormControl.ErrorMessage>
            <View className="flex flex-row gap-5 mt-2">
              <TouchableOpacity
                className="py-2 w-24 my-2 rounded bg-custom-primary"
                onPress={validateCode}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Unlock
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="py-2 w-24 my-2 rounded bg-custom-grey"
                onPress={hideModal}>
                <Text className="text-white my-auto text-center font-semibold uppercase">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default PrivateScreen;
