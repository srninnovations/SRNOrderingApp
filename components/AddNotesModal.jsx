import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useContext} from 'react';
import GlobalContext from '../utils/GlobalContext.';

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
        style={styles.container}
        hasBackdrop={true}
        animationType="fade"
        backdropOpacity={0.5}
        visible={show}
        onBackButtonPress={handleClose}>
        {/*All views of Modal*/}
        <View style={styles.modal}>
          <Text style={styles.header}>Add notes to order</Text>
          <SafeAreaView>
            <TextInput
              multiline={true}
              numberOfLines={5}
              style={styles.input}
              onChangeText={e => context.setNotes(e)}
              placeholder="Food allergies etc..."
              placeholderTextColor={'grey'}
              defaultValue={notes.length > 0 ? notes : ''}
            />
          </SafeAreaView>
          <View style={styles.btnWrapper}>
            <Button
              style={styles.btn}
              title="Close"
              color="grey"
              onPress={handleClose}
            />
            <Button style={styles.btn} title="Save" onPress={handleSave} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 500,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 42,
    fontWeight: 500,
  },
  input: {
    width: '100%',
    borderColor: 'rgb(206, 212, 218)',
    borderWidth: 0.8,
    borderRadius: 4,
    marginVertical: 10,
  },
  btnWrapper: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
    marginTop: 28,
  },
  btn: {
    width: '50%',
    borderRadius: 4,
  },
});
