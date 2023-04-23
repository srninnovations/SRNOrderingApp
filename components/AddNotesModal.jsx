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
import {Stack} from 'native-base';
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
      <StyledComponent
        component={Modal}
        tw="flex-1 justify-center items-center"
        hasBackdrop={true}
        animationType="fade"
        backdropOpacity={0.5}
        visible={show}
        onBackButtonPress={handleClose}>
        {/*All views of Modal*/}
        <StyledComponent
          component={View}
          tw="bg-white w-[500px] rounded-xl border border-border-color p-4">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingBottom={4}>
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
            <StyledComponent
              component={TextInput}
              tw="w-full border border-gray-300 rounded my-6 text-custom-dark"
              multiline={true}
              numberOfLines={5}
              onChangeText={e => context.setNotes(e)}
              placeholder="Food allergies etc..."
              placeholderTextColor={'grey'}
              defaultValue={notes.length > 0 ? notes : ''}
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
              // style={styles.btn}
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
      </StyledComponent>
    </View>
  );
}
