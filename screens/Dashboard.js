import {Text, Button, View, TouchableOpacity} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Header from '../components/Header';
import {retrieveKeychainData} from '../utils/StorageUtils';
import {useNavigation} from '@react-navigation/native';
import StorageUtils from '../utils/StorageUtils';

import GlobalContext from '../utils/GlobalContext.';

export default function Dashboard() {
  const navigation = useNavigation();

  const {staff, setStaff, setOrderType} = useContext(GlobalContext);

  const [staffList, setStaffList] = useState([]);
  const [orderTypesList, setOrderTypesList] = useState([]);

  useEffect(() => {
    getStaff();
  }, []);

  const getStaff = async () => {
    const staffs = await StorageUtils.getAsyncStorageData('staff');
    const orderTypes = await StorageUtils.getAsyncStorageData('orderTypes');

    setStaffList(staffs.value);
    setOrderTypesList(orderTypes.value);
  };

  const selectStaff = async person => {
    setStaff(person);
    await StorageUtils.saveAsyncStorageData('staff', person);
  };
  const selectOrderType = async orderType => {
    setOrderType(orderType);
    await StorageUtils.saveAsyncStorageData('orderType', orderType);
    navigation.navigate('Menu');
  };

  return (
    <>
      <View className="bg-light h-full">
        <Header />

        <View className="flex-1 justify-center items-center w-screen">
          {!staff && (
            <Text className="text-black text-4xl font-bold mb-14">STAFF</Text>
          )}

          {staff && (
            <>
              <TouchableOpacity
                className="mb-10 bg-custom-primary rounded"
                onPress={() => setStaff('')}>
                <Text className="text-white text-3xl font-semibold w-full p-3 text-center">
                  {staff}
                </Text>
              </TouchableOpacity>
              <View className="h-1 w-full opacity-30 mb-10 border-b-2 border-dotted"></View>
            </>
          )}
          {staff && (
            <View className="w-full mb-14">
              <Text className="text-black text-center text-4xl font-bold">
                ORDER TYPE
              </Text>
            </View>
          )}
          <View className="flex flex-row justify-center flex-wrap border-1 border-black border-solid">
            {staff == '' &&
              staffList &&
              staffList.map((person, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectStaff(person)}
                    className="flex my-2 rounded  w-96 mx-5 h-20 justify-center bg-custom-secondary">
                    <Text className="text-center text-white text-2xl">
                      {person}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            {staff &&
              orderTypesList &&
              orderTypesList.map((orderType, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => selectOrderType(orderType)}
                    className="flex my-2 rounded  w-96 mx-5 h-20 justify-center bg-custom-secondary">
                    <Text className="text-center text-white text-2xl">
                      {orderType}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    </>
  );
}
