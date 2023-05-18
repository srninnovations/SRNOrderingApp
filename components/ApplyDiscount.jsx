import {
  Box,
  FormControl,
  Input,
  HStack,
  Heading,
  Radio,
  Divider,
} from 'native-base';
import {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import Modal from 'react-native-modal';

export const ApplyDiscount = ({total, discount, show, hide}) => {
  const [validPin] = useState(123456);
  const [discountPin, setDiscountPin] = useState('');
  const [pinIsValid, setPinIsValid] = useState(false);

  const [amount, setAmount] = useState(0);
  const [value, setValue] = useState('fixed');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [error, setError] = useState(null);

  const [applyDiscount, setApplyDiscount] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (discountPin.length === 6) {
      setPinIsValid(discountPin == validPin);
      if (discountPin != validPin) {
        setError('Invalid pin');
      } else {
        setError(null);
      }
    }
  }, [discountPin]);

  useEffect(() => {
    if (value == 'percentage') {
      const calculatedDiscountAmount = (total * amount) / 100;
      setDiscountAmount(calculatedDiscountAmount);
    }
  }, [amount]);

  useEffect(() => {
    if (applyDiscount && error == null && pinIsValid && amount > 0) {
      if (value === 'fixed') {
        discount(Number(amount));
      } else if (value === 'percentage') {
        discount(Number(discountAmount));
      }
      setDiscountPin('');
      setAmount(0);
      setPinIsValid(false);
      setApplyDiscount(false);
      hide();
    }
  }, [applyDiscount]);

  const validateInput = inputValue => {
    const parsedValue = Number(inputValue);
    if (value === 'fixed' && parsedValue > total) {
      setError('Discount cannot exceed total amount');
      return false;
    }
    if (value === 'percentage' && parsedValue > 100) {
      setError('Percentage cannot be more than 100');
      return false;
    }
    if (parsedValue < 0) {
      setError('Amount cannot be less than 0');
      return false;
    }
    if (!isSubmitted) {
      setError(null);
    }
    return true;
  };

  const handleApplyDiscount = () => {
    if (error == null && pinIsValid && amount > 0) {
      if (value === 'fixed') {
        discount(Number(amount));
      } else if (value === 'percentage') {
        discount(Number(discountAmount));
      }
      setDiscountPin('');
      setAmount(0);
      setPinIsValid(false);
      hide();
    }
  };

  return (
    <>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={hide}>
        <Box width={'full'} maxW={'md'} bgColor={'white'} borderRadius={'md'}>
          <Heading
            borderBottomWidth={1}
            fontWeight={'semibold'}
            color={'gray.800'}
            borderColor={'gray.400'}
            px={5}
            py={4}>
            Apply discount
          </Heading>

          {!pinIsValid && (
            <View className="flex m-6 justify-center items-center">
              <Text className="text-2xl">Enter pin</Text>
              <FormControl className="w-32">
                <Input
                  size="lg"
                  className="bg-white text-center text-xl"
                  type="password"
                  keyboardType="number-pad"
                  onChangeText={text => setDiscountPin(text)}
                  value={discountPin}
                  maxLength={6}
                />
              </FormControl>
              <Text className="text-custom-danger">{error}</Text>
            </View>
          )}
          {pinIsValid && (
            <View className="flex m-6 justify-center items-center">
              <Text className="text-2xl">
                Select fixed amount or percentage
              </Text>
              <Radio.Group
                className="my-4"
                value={value}
                onChange={nextValue => {
                  setValue(nextValue);
                }}>
                <Radio value="fixed" my={1}>
                  <Text className="text-xl">Fixed</Text>
                </Radio>
                <Radio value="percentage" my={1}>
                  <Text className="text-xl">Percentage</Text>
                </Radio>
              </Radio.Group>

              <Divider my="3" />

              {value == 'fixed' && (
                <>
                  <Text className="text-2xl mb-4">Enter amount (£)</Text>
                  <FormControl className="w-32">
                    <Input
                      size="lg"
                      className="bg-white text-center text-xl"
                      keyboardType="number-pad"
                      onChangeText={value => {
                        setIsSubmitted(false);
                        if (validateInput(value)) {
                          setAmount(value);
                        }
                      }}
                      onSubmitEditing={() => {
                        setIsSubmitted(true);
                        if (validateInput(amount)) {
                          handleApplyDiscount();
                        }
                      }}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <Text className="text-custom-danger m-1 text-lg">
                    {error}
                  </Text>
                </>
              )}
              {value == 'percentage' && (
                <>
                  <Text className="text-2xl mb-4">Enter percentage (%)</Text>
                  <FormControl className="w-32">
                    <Input
                      size="lg"
                      className="bg-white text-center text-xl"
                      keyboardType="number-pad"
                      onChangeText={value => {
                        setIsSubmitted(false);
                        if (validateInput(value)) {
                          setAmount(value);
                        }
                      }}
                      onSubmitEditing={() => {
                        if (validateInput(amount)) {
                          handleApplyDiscount();
                        }
                      }}
                      returnKeyType="next"
                    />
                  </FormControl>
                  <Text className="text-custom-danger m-1 text-lg">
                    {error}
                  </Text>
                </>
              )}
            </View>
          )}
          <HStack
            justifyContent="flex-end"
            space="3"
            px="5"
            pt="2"
            pb={'4'}
            mt={10}>
            <TouchableOpacity
              onPress={hide}
              className="bg-custom-grey w-32 h-10 flex justify-center rounded">
              <Text className="text-white text-center text-xl uppercase">
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={error != null || pinIsValid == false || amount == 0}
              onPress={() => {
                setIsSubmitted(true);
                if (validateInput(amount)) {
                  handleApplyDiscount();
                }
              }}
              className={`bg-custom-primary w-32 h-10 flex justify-center rounded ${
                error != null || pinIsValid == false || amount == 0
                  ? 'opacity-60'
                  : ''
              }`}>
              <Text className="text-white text-center text-xl uppercase">
                Apply
              </Text>
            </TouchableOpacity>
          </HStack>
        </Box>
      </Modal>
    </>
  );
};
