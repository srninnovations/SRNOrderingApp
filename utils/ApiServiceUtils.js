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

export default {getStaff, getOrderTypes, getTables, getMenu};
