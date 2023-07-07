import {Text, Button, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Header from '../components/Header';

export default function Manage({navigation}) {
  return (
    <View>
      <View className="bg-light h-full">
        <Header />

        <View className="flex-1 justify-center items-center w-screen">
          <Text className="text-black text-4xl font-bold mb-14">MANAGE</Text>

          <View className="flex flex-row justify-center flex-wrap border-1 border-black border-solid">
            <TouchableOpacity
              onPress={() => navigation.navigate('Customers')}
              className="flex my-2 rounded  w-96 mx-5 h-20 justify-center bg-custom-secondary">
              <Text className="text-center text-white text-2xl uppercase">
                Manage Customer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              //   onPress={() => navigation.navigate('ManageMenu')}
              className="flex my-2 rounded  w-96 mx-5 h-20 justify-center bg-custom-secondary">
              <Text className="text-center text-white text-2xl uppercase">
                Manage Menu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
