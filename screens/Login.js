import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';

import {REACT_APP_PROD_MODE} from '@env';
import ApiServiceUtils from '../utils/ApiServiceUtils';

import StorageUtils from '../utils/StorageUtils';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const apiUrl = REACT_APP_PROD_MODE;

  useEffect(() => {
    setLoading(true);
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    // Get data from Keychain
    const keychainGetResult = await StorageUtils.getKeychainData('token');
    if (keychainGetResult.success) {
      const client = await StorageUtils.getAsyncStorageData('client');
      const clientId = await StorageUtils.getAsyncStorageData('clientId');
      await setDetails(client.value);
      //   console.log('client', client.value);
      //   console.log('clientId', clientId.value);
      // Data was retrieved successfull.valuey
      setLoading(false);
      navigation.navigate('Dashboard');
    } else {
      // Data could not be retrieved, handle the error
      setLoading(false);
      navigation.navigate('Login');
    }
  };

  const setDetails = async client => {
    const staff = await ApiServiceUtils.getStaff(client);
    const orderTypes = await ApiServiceUtils.getOrderTypes(client);
    const tables = await ApiServiceUtils.getTables(client);
    const menu = await ApiServiceUtils.getMenu(client);

    await StorageUtils.saveAsyncStorageData('staff', staff);
    await StorageUtils.saveAsyncStorageData('orderTypes', orderTypes);
    await StorageUtils.saveAsyncStorageData('tables', tables);
    await StorageUtils.saveAsyncStorageData('menu', menu.category);
    await StorageUtils.saveAsyncStorageData('categories', menu.categories);
    // await StorageUtils.saveAsyncStorageData('customers', menu.customers);
  };

  const loginValidate = async () => {
    if (email && password) {
      setLoading(true);
      fetch(apiUrl + '/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      })
        .then(response => response.json())
        .then(async data => {
          const keychainSaveResult = await StorageUtils.saveKeychainData(
            'token',
            data.token,
          );
          if (keychainSaveResult.success) {
            await StorageUtils.saveAsyncStorageData('client', data.client);
            await StorageUtils.saveAsyncStorageData('clientId', data.clientId);
            await setDetails(data.client);
            navigation.navigate('Dashboard');
            // Data was saved successfully
          } else {
            // Data could not be saved, handle the error
            console.log(keychainSaveResult.error);
          }
        })
        .catch(error => {
          setError('Error: ' + error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Please enter username and password.');
    }
  };

  return (
    <>
      <View className="flex-1 justify-center items-center bg-light">
        {!loading && (
          <>
            <View className="mb-24">
              <Text className="text-2xl font-medium text-black">
                Please sign in to continue
              </Text>
            </View>
            <SafeAreaView>
              <View className="bg-white w-60 h-12 mb-4 items-center align-middle rounded-full">
                <TextInput
                  className="text-center w-full h-full text-black"
                  placeholder="Email."
                  placeholderTextColor="black"
                  autoCapitalize="none"
                  onChangeText={email => setEmail(email)}
                />
              </View>
              <View className="bg-white w-60 h-12 mb-2 items-center align-middle  rounded-full">
                <TextInput
                  placeholder="Password."
                  placeholderTextColor="black"
                  className="text-center w-full h-full text-black"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={password => setPassword(password)}
                  onSubmitEditing={loginValidate} // Trigger handleLogin when the user presses the enter button
                />
              </View>
            </SafeAreaView>
            <TouchableOpacity className="mt-5">
              <Text className="text-custom-grey">Forgot Password?</Text>
            </TouchableOpacity>
            <View className="mt-10">
              <Text className="text-warningDark">{error}</Text>
            </View>
            <TouchableOpacity
              className="bg-custom-secondary rounded-full w-80 h-12 items-center justify-center mt-32"
              onPress={() => {
                setError('');
                loginValidate();
              }}>
              <Text className="text-white font-medium text-lg">LOGIN</Text>
            </TouchableOpacity>
          </>
        )}

        {loading && (
          <>
            <View className="w-80 h-12 items-center justify-center">
              <ActivityIndicator size={40} color="#3498db" />
              <Text className="font-semibold text-lg">Logging in...</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
}
