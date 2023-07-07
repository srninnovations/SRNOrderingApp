import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import Selection from '../screens/Selection';
import History from '../screens/History';
import Home from '../screens/Home';
import Menu from '../screens/Menu';
import Customer from '../screens/Customer';
import Sales from '../screens/Sales';
import Manage from '../screens/Manage';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Login">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Selection" component={Selection} />
      <Stack.Screen name="Menu" component={Menu} />
      <Stack.Screen name="Manage" component={Manage} />
      <Stack.Screen name="Customers" component={Customer} />
      <Stack.Screen name="Sales" component={Sales} />
    </Stack.Navigator>
  );
}
