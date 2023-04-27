import {REACT_APP_PROD_MODE} from '@env';
import StorageUtils from './StorageUtils';

const apiUrl = REACT_APP_PROD_MODE;

const getStaff = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/staff', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      client: client,
    }),
  });

  const data = await response.json(); // Parse the response as JSON

  return data; // Return the parsed JSON response
};

const getOrderTypes = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/orderTypes', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      client: client,
    }),
  });

  const data = await response.json(); // Parse the response as JSON

  return data; // Return the parsed JSON response
};

const getTables = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/tables', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      client: client,
    }),
  });

  const data = await response.json(); // Parse the response as JSON

  return data; // Return the parsed JSON response
};

const getMenu = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/menu', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify({
      client: client,
    }),
  });

  const data = await response.json(); // Parse the response as JSON

  return data; // Return the parsed JSON response
};

const getOrders = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(apiUrl + '/orders?client=' + client, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
  });
  const data = await response.json();
  return data;
};

const deleteHistory = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(
    apiUrl +
      '/deleteOrder?client=' +
      client.client +
      '&client_id=' +
      client.client_id +
      '&order_id=' +
      client.order_id,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    },
  );

  return response.status;
};

export const updateHistory = async history => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/updateOrders', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(history),
  });

  return await response.json();
};

export default {
  getStaff,
  getOrderTypes,
  getTables,
  getMenu,
  getOrders,
  deleteHistory,
  updateHistory,
};
