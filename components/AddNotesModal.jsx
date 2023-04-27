import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useContext} from 'react';
import GlobalContext from '../utils/GlobalContext.';
import {StyledComponent} from 'nativewind';
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
        <StyledComponent
          component={View}
          tw="bg-white w-[500px] rounded-xl p-4">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center">
            <StyledComponent
              component={Text}
              tw="text-2xl font-medium text-black">
              Add notes to order
            </StyledComponent>
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
              focusOutlineColor="blueGray.400"
              defaultValue={notes.length > 0 ? notes : ''}
              onChangeText={e => context.setNotes(e)}
              onSubmitEditing={handleSave}
            />
          </SafeAreaView>
          <Stack
            direction="row"
            space={4}
            alignItems="center"
            justifyContent="flex-end">
            <StyledComponent
              component={Button}
              tw="w-1/2 rounded"
              title="Close"
              color="grey"
              onPress={handleClose}
            />
            <StyledComponent
              component={Button}
              tw="w-1/2 rounded"
              title="Save"
              onPress={handleSave}
            />
          </Stack>
        </StyledComponent>
      </Modal>
    </View>
  );
}
