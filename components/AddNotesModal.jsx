import {View, Text, Button, SafeAreaView, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import React, {useContext} from 'react';
import GlobalContext from '../utils/GlobalContext.';
import {Stack, TextArea} from 'native-base';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function AddNotesModal({
  show,
  setSavedNotes,
  handleClose,
  notes,
}) {
  const context = useContext(GlobalContext);
  const handleSave = () => {
    handleClose();
    setSavedNotes(context.notes);
  };
  return (
    <View>
      <Modal
        isVisible={show}
        animationType="fade"
        className="flex-1 justify-center items-center"
        onBackButtonPress={handleClose}>
        <View className="bg-white w-[500px] rounded-xl p-4">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <Text className="text-2xl font-medium text-black">
              Add notes to order
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <FeatherIcon name="x" size={40} color="#555" />
            </TouchableOpacity>
          </Stack>
          <SafeAreaView>
            <TextArea
              h={24}
              placeholder="Food allergies etc..."
              w="full"
              my={6}
              color="trueGray.500"
              bgColor="trueGray.50"
              focusOutlineColor="lightBlue.400"
              className="text-black text-xl"
              defaultValue={notes.length > 0 ? notes : ''}
              onChangeText={text => context.setNotes(text)}
              onSubmitEditing={handleSave}
            />
          </SafeAreaView>
          <Stack
            direction="row"
            space={4}
            alignItems="center"
            justifyContent="flex-end">
            <TouchableOpacity
              onPress={handleClose}
              className="flex justify-center h-10 w-32 rounded bg-custom-grey">
              <Text className="text-white uppercase text-xl text-center">
                Close
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              className="flex justify-center w-32 h-10 rounded bg-custom-primary">
              <Text className="text-white text-center uppercase text-xl">
                Save
              </Text>
            </TouchableOpacity>
          </Stack>
        </View>
      </Modal>
    </View>
  );
}
