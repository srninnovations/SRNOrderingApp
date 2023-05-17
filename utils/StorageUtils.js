import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveKeychainData = async (key, value) => {
  try {
    const stringKey = JSON.stringify(key);
    const stringValue = JSON.stringify(value);
    await Keychain.setGenericPassword(stringKey, stringValue, {service: key});
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

const getKeychainData = async key => {
  try {
    const credentials = await Keychain.getGenericPassword({service: key});
    if (credentials) {
      return {success: true, value: credentials.password};
    } else {
      return {success: false};
    }
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

const removeKeychainData = async key => {
  try {
    await Keychain.resetGenericPassword({service: key});
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

const saveAsyncStorageData = async (key, value) => {
  try {
    const stringKey = JSON.stringify(key);
    const stringValue = JSON.stringify(value);

    await AsyncStorage.setItem(stringKey, stringValue);
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

const getAsyncStorageData = async key => {
  try {
    const stringKey = JSON.stringify(key);

    const result = await AsyncStorage.getItem(stringKey);
    if (result !== null) {
      const value = JSON.parse(result);
      return {success: true, value};
    } else {
      return {success: false};
    }
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

const removeAsyncStorageData = async key => {
  try {
    const stringKey = JSON.stringify(key);

    await AsyncStorage.removeItem(stringKey);
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};
const removeAllData = async () => {
  try {
    await AsyncStorage.clear();
    await removeKeychainData('token');
    return {success: true};
  } catch (error) {
    console.log(error);
    return {success: false, error};
  }
};

export default {
  saveKeychainData,
  getKeychainData,
  removeKeychainData,
  saveAsyncStorageData,
  getAsyncStorageData,
  removeAsyncStorageData,
  removeAllData,
};
