import {View, Text} from 'react-native';
import React from 'react';

export default function CustomToast({title}) {
  return (
    <View>
      <View className="max-w-lg bg-gray-600 text-sm text-white rounded-md shadow-lg dark:bg-gray-700 mb-3 ml-3">
        <Text className="flex p-4 text-white text-lg">{title}</Text>
      </View>
    </View>
  );
}
