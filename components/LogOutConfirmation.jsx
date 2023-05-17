import React, {useRef} from 'react';
import {AlertDialog, Button, Center} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LogOutConfirmation({
  showLogOut,
  setShowLogOut,
  signOut,
}) {
  const onClose = () => setShowLogOut(false);

  const cancelRef = useRef();
  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={showLogOut}
        onClose={onClose}
        motionPreset={'fade'}>
        <AlertDialog.Content>
          <AlertDialog.Header fontWeight="bold">
            <Text className="text-3xl text-gray-900">
              Sign-out Confirmation
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body>
            <Text className="text-xl text-gray-900">Are you sure?</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <TouchableOpacity
              className="rounded px-3 py-2 h-12 items-center justify-center bg-custom-grey"
              ref={cancelRef}
              onPress={onClose}>
              <Text className="text-white font-medium text-lg">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded px-3 py-2 h-12 items-center justify-center bg-custom-danger ml-3"
              onPress={signOut}>
              <Text className="text-white font-medium text-lg">
                <Icon name="sign-out" size={18} color="#fefefe" /> Sign Out
              </Text>
            </TouchableOpacity>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
}
