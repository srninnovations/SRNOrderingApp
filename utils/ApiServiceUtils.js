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
  const response = await fetch(apiUrl + '/allorders?client=' + client, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
  });
  const data = await response.json();
  return data;
};

const getSpecificOrder = async orderBody => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(apiUrl + '/orders', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(orderBody),
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
const deleteAllHistory = async client => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(
    apiUrl +
      '/deleteAllOrders?client=' +
      client.client +
      '&client_id=' +
      client.client_id,
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
export const getTableOrder = async (client, table_num) => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(
    `${apiUrl}/tableOrder?table_num=${table_num}&client=${client}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    },
  );
  // console.log('response', response);
  return await response.json();
};
export const updateActiveTables = async body => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/activeTables', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(body),
  });

  return await response.json();
};

export const getCustomers = async body => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/customers', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
  });

  return await response.json();
};

export const addCustomer = async body => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/customer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(body),
  });

  if (response.status == 200) {
    return true;
  }

  return false;
};
export const editCustomer = async body => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);

  const response = await fetch(apiUrl + '/editcustomer', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'auth-token': token,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (data.addresses) return data.addresses;
  else return data;
};

export const deleteCustomer = async (client, address) => {
  const tokenString = await StorageUtils.getKeychainData('token');
  const token = JSON.parse(tokenString.value);
  const response = await fetch(
    `${apiUrl}/customer?client=${client}&address=${address}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token,
      },
    },
  );
  const data = await response.json();
  if (
    data.Attributes &&
    data.Attributes.addresses &&
    data.Attributes.addresses.length > 0
  )
    return data.Attributes.addresses;
  else return data;
};

export default {
  getStaff,
  getOrderTypes,
  getTables,
  getMenu,
  getOrders,
  getSpecificOrder,
  deleteHistory,
  updateHistory,
  deleteAllHistory,
  getTableOrder,
  updateActiveTables,
  getCustomers,
  addCustomer,
  editCustomer,
  deleteCustomer,
};
