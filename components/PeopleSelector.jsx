import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  VStack,
  FormControl,
  Input,
} from 'native-base';

export default function PeopleSelector({confirm, show, hideModal}) {
  const peoples = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const [people, setPeople] = useState(0);
  return (
    <>
      <Modal
        className="flex-1 justify-center items-center"
        isVisible={show}
        onBackButtonPress={hideModal}>
        <Box
          className="p-4 my-4"
          width={'full'}
          maxW={'lg'}
          bgColor={'white'}
          borderRadius={'md'}>
          <Heading fontWeight={'medium'} mx={'5'} mt={'5'}>
            Select people
          </Heading>
          <Divider my="3" />
          <VStack mx={'5'}>
            <View className="flex flex-wrap flex-row">
              {peoples.map(p => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeople(p)}
                  className={`${
                    p == people ? 'bg-custom-amber' : 'bg-custom-secondary'
                  } m-1 w-32 h-16 flex justify-center`}>
                  <Text
                    className={`text-2xl font-bold ${
                      p == people ? 'text-black' : 'text-white'
                    } text-center p-4`}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}

              <View className="bg-custom-secondary m-1 w-32 h-16 flex justify-center items-center">
                <FormControl className="w-16">
                  <Input
                    //   ref={contactRef}
                    size="lg"
                    className="bg-white text-center"
                    keyboardType="number-pad"
                    onChangeText={value => setPeople(value)}
                    onSubmitEditing={() => {
                      confirm(people);
                    }}
                    returnKeyType="next"
                  />
                </FormControl>
              </View>
            </View>
          </VStack>
          <Divider my="3" />

          <HStack space="2" justifyContent="flex-end" mr="5" mb="4">
            <TouchableOpacity
              className="py-2.5 w-28 rounded bg-custom-grey"
              onPress={hideModal}>
              <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-2.5 w-28 rounded bg-custom-primary"
              onPress={() => confirm(people)}>
              <Text className="text-white my-auto text-center font-semibold uppercase text-lg">
                Confirm
              </Text>
            </TouchableOpacity>
          </HStack>
        </Box>
      </Modal>
    </>
  );
}
