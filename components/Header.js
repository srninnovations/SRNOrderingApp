import React from 'react';
import {Text, View, Image, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import StorageUtils from '../utils/StorageUtils';

import {useNavigation} from '@react-navigation/native';

export default function Header() {
  const navigation = useNavigation();

  const signOut = async () => {
    const keychainRemoveResult = await StorageUtils.removeKeychainData('token');
    if (keychainRemoveResult.success) {
      // Data was removed successfully
      navigation.navigate('Login');
    } else {
      // Data could not be removed, handle the error
      console.log(keychainRemoveResult.error);
    }
  };

  return (
    <>
      <View className="flex flex-row justify-between w-screen p-1 h-14 bg-custom-primary">
        <View className="flex flex-row space-x-1">
          <TouchableOpacity
            className="rounded-sm w-32 h-12 items-center justify-center"
            onPress={() => navigation.navigate('Dashboard')}>
            <Text className="text-white font-medium text-lg">
              <Icon name="cutlery" size={30} color="#fefefe" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-sm w-32 h-12 items-center justify-center"
            onPress={() => navigation.navigate('History')}>
            <Text className="text-white font-medium text-lg">
              {' '}
              <Icon name="history" size={30} color="#fefefe" />
            </Text>
          </TouchableOpacity>
        </View>
        <View className="">
          <TouchableOpacity
            className=" rounded-sm w-24 h-12 items-center justify-center mr-2"
            onPress={() => signOut()}>
            <Text className="font-medium text-lg">
              {' '}
              <Icon name="sign-out" size={30} color="#fefefe" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
