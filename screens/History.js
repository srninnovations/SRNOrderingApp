import {Text, View} from 'react-native';
import React from 'react';
import Header from '../components/Header';

export default function History() {
  return (
    <>
      <Header />
      <View className="flex-1 justify-center items-center bg-[#fff]">
        <View className="mb-24">
          <Text className="text-2xl font-medium">History</Text>
        </View>
      </View>
    </>
  );
}
