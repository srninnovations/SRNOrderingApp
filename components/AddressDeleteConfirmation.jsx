import React, {useRef, useState} from 'react';
import {
  Alert,
  AlertDialog,
  Button,
  Center,
  HStack,
  VStack,
  useToast,
} from 'native-base';
import {Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomToast from './CustomToast';

export default function AddressDeleteConfirmation({
  showDeleteModal,
  onClose,
  selectedAddress,
  handleDelete,
  refetch,
}) {
  const toast = useToast();
  const cancelRef = useRef();

  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    const res = await handleDelete(selectedAddress);
    if (res && Array.isArray(res)) {
      !toast.isActive('edit-customer') &&
        toast.show({
          id: 'edit-customer',
          render: () => <CustomToast title={'Your changes were saved.'} />,
          duration: 3000,
        });
      refetch();
    } else {
      !toast.isActive('edit-customer') &&
        toast.show({
          id: 'edit-customer',
          render: () => (
            <CustomToast
              title={
                'Unexpected error occurred while getting history, please log out and try again. If the issue persists please contact us'
              }
            />
          ),
        });
    }
    onClose();
    setLoading(false);
  };

  return (
    <Center>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={showDeleteModal}
        onClose={onClose}
        motionPreset={'fade'}>
        <AlertDialog.Content maxW={'2xl'}>
          <AlertDialog.Header fontWeight="bold">
            <Text className="text-3xl font-semibold text-gray-900">
              Delete Confirmation
            </Text>
          </AlertDialog.Header>
          <AlertDialog.Body width={'xl'} className="mx-auto px-3 py-2">
            <Alert width={'full'} mt={'5'} mb={2} status="error">
              <HStack flexShrink={1} space={2} justifyContent="space-between">
                <VStack flexShrink={1} space={2}>
                  <HStack alignItems="center" space={1}>
                    <Alert.Icon size={'2xl'} />
                    <Text className="text-gray-800 font-medium text-xl">
                      Are you sure you want to delete this selected address,
                    </Text>
                  </HStack>
                  <Text className="pl-4 text-xl">
                    Address:{' '}
                    {selectedAddress
                      ? selectedAddress.Address1 +
                        ', ' +
                        selectedAddress.Address2
                      : ''}
                  </Text>
                  <Text className="pl-4 text-xl">
                    Contact : {selectedAddress ? selectedAddress.Contact : ''}
                  </Text>
                  <Text className="pl-4 text-xl">
                    Postcode : {selectedAddress ? selectedAddress.Postcode : ''}
                  </Text>
                </VStack>
              </HStack>
              <Text className="font-bold text-lg text-red-900 mt-2 text-2xl">
                THIS ACTION CAN NOT BE REVERSED!
              </Text>
            </Alert>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <TouchableOpacity
              disabled={loading}
              className={`rounded px-3 py-2 h-12 items-center justify-center ${
                loading ? 'bg-custom-grey/50' : 'bg-custom-grey'
              }`}
              ref={cancelRef}
              onPress={onClose}>
              <Text className="text-white font-medium text-lg">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              className={`rounded px-3 py-2 h-12 items-center justify-center ml-3 ${
                loading ? 'bg-custom-danger/50' : 'bg-custom-danger'
              }`}
              onPress={confirmDelete}>
              <Text className="text-white font-medium text-lg">
                {loading ? 'Deleting...' : 'Delete'}
              </Text>
            </TouchableOpacity>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
}
