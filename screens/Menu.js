import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {StyledComponent} from 'nativewind';
import Modal from 'react-native-modal';
import React, {useState, useContext, useEffect, useRef, useMemo} from 'react';
import GlobalContext from '../utils/GlobalContext.';
import Header from '../components/Header';
import StorageUtils from '../utils/StorageUtils';
import _ from 'lodash';
// import {useNavigation} from '@react-navigation/native';

import {getPrinter, printReceipt} from '../utils/PrinterService';

import Icon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AddNotesModal from '../components/AddNotesModal';
import {OrderPlacedComfirmation} from '../components/OrderPlacedConfirmation';
import {Radio, Spinner, Stack, TextArea, useToast} from 'native-base';
import uniqueID from '../utils/uniqueId';
import ApiServiceUtils from '../utils/ApiServiceUtils';

export default function Menu({route, navigation}) {
  const params = route.params;
  const initialHasSubCat = {
    isSubCategory: false,
    subCategories: [],
    category: '',
  };

  const popular = [
    {
      name: 'Pappadom',
      price: 1.0,
      category: 'STARTERS',
    },
    {
      name: 'Chutneys',
      price: 0.75,
      category: 'STARTERS',
    },
  ];

  const toast = useToast();

  const context = useContext(GlobalContext);

  const [menu, setMenu] = useState([]);

  const [itemNoteShow, setItemNoteShow] = useState(false);

  const [loading, setLoading] = useState(true);

  const [notedItem, setNotedItem] = useState();

  const [categories, setCategories] = useState([]);

  const [hasSubCat, setHasSubCat] = useState(initialHasSubCat);

  const [menuItems, setMenuItems] = useState(popular);

  const [selectedMenu, setSelectedMenu] = useState('');

  const [orders, setOrders] = useState([]);

  const [total, setTotal] = useState(0);

  const [subTotal, setSubTotal] = useState(0);

  const [totalsByCategory, setTotalsByCategory] = useState();

  const [show, setShow] = useState(false);

  const [showCustModal, setShowCustModal] = useState(false);

  const [savedNotes, setSavedNotes] = useState('');

  const [customItemType, setCustomItemType] = useState('Food');
  const [customItemCategory, setCustomItemCategory] = useState('STARTERS');
  const [customItem, setCustomItem] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState(1);
  const [customItemPrice, setCustomItemPrice] = useState('0.00');

  const [customerState, setCustomerState] = useState(null);

  const [itemNoteText, setItemNoteText] = useState('');

  const [starterItems, setStarterItems] = useState(0);
  const [mainItems, setMainItems] = useState(0);
  const [sideDishes, setSideDishesItems] = useState(0);
  const [dessertItems, setDessertItems] = useState(0);
  const [beverageItems, setBeverageItems] = useState(0);
  const [alcoholItems, setAlcoholItems] = useState(0);
  const [sundriesItems, setSundriesItems] = useState(0);
  const [sundayItems, setSundayItems] = useState(0);

  const [table, setTable] = useState('');
  const [people, setPeople] = useState('');

  const scrollViewRef = useRef();

  const [menuItemsByCategory, setMenuItemsByCategory] = useState(() => {
    const initialMenuItemsByCategory = {};
    menu.forEach(item => {
      initialMenuItemsByCategory[item.category] = item.items;
    });
    return initialMenuItemsByCategory;
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCustItemClose = () => {
    setCustomItem('');
    setCustomItemQuantity(0);
    setCustomItemPrice(0.0);
    setShowCustModal(false);
  };
  const handleCustItemShow = () => setShowCustModal(true);

  const styles = StyleSheet.create({
    elevation: {
      shadowColor: '#666',
      elevation: 5,
    },
  });

  useEffect(() => {
    let subTotal = 0;

    let totalsByCategory = {};
    for (let item of orders) {
      if (item.category == 'Custom') {
        const price = item.price / item.quantity;
        subTotal = subTotal + price * item.quantity;
      } else {
        subTotal = subTotal + item.price * item.quantity;
        if (totalsByCategory[item.category]) {
          // if the category already exists in the object, add the item's price times quantity to the existing total
          totalsByCategory[item.category] += item.price * item.quantity;
        } else {
          // if the category doesn't exist in the object yet, initialize the total to the item's price times quantity
          totalsByCategory[item.category] = item.price * item.quantity;
        }
      }
    }

    setTotalsByCategory(totalsByCategory);

    const starters = orders.filter(
      order =>
        order.category == 'STARTERS' || order.category == 'SIGNATURE STARTERS',
    );
    setStarterItems(starters.length);

    const mains = orders.filter(
      order =>
        order.category != 'STARTERS' &&
        order.category != 'SIGNATURE STARTERS' &&
        order.category != 'VEGETABLE SIDE DISHES' &&
        order.category != 'SUNDAY MENU' &&
        order.category != 'SUNDRIES' &&
        order.category != 'DESSERTS' &&
        order.category != 'BEVERAGES' &&
        order.category != 'ALCOHOL',
    );
    setMainItems(mains.length);

    const sideDishes = orders.filter(
      order => order.category == 'VEGETABLE SIDE DISHES',
    );
    setSideDishesItems(sideDishes.length);

    const sundries = orders.filter(order => order.category == 'SUNDRIES');
    setSundriesItems(sundries.length);

    const desserts = orders.filter(order => order.category == 'DESSERTS');
    setDessertItems(desserts.length);

    const beverages = orders.filter(order => order.category == 'BEVERAGES');
    setBeverageItems(beverages.length);

    const alcohol = orders.filter(order => order.category == 'ALCOHOL');
    setAlcoholItems(alcohol.length);

    const sundayItems = orders.filter(o => o.category == 'SUNDAY MENU');
    setSundayItems(sundayItems.length);

    setSubTotal(subTotal);
  }, [orders]);

  useEffect(() => {
    getDetails();
    // params && params.order_id && console.log(params.order_id);
    params && params.order_id ? getOrder() : context.setOrderId(uniqueID());
  }, [params]);

  // When the menu updates, recalculate the memoized menuItemsByCategory
  useMemo(() => {
    const newMenuItemsByCategory = {};
    menu.forEach(item => {
      newMenuItemsByCategory[item.category] = item.items;
    });
    setMenuItemsByCategory(newMenuItemsByCategory);
  }, [menu]);

  const getOrder = async () => {
    setLoading(true);
    const customerStateResult = await StorageUtils.getAsyncStorageData(
      'customerState',
    );
    setCustomerState(customerStateResult.value);
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');
    const order = await ApiServiceUtils.getSpecificOrder({
      client_id: clientId.value,
      order_id: params.order_id,
    });
    setOrders(order.items);
    context.setOrderId(order.order_id);
    order.notes && setSavedNotes(order.notes);
    Object.keys(order.customer).forEach(info => {
      context.dispatch({
        type: 'UPDATE_CUSTOMER',
        field: info,
        payload: order.customer[info],
      });
    });
    order.deliveryNotes && context.setDeliveryNotes(order.deliveryNotes);
    order.discount && context.setDiscount(order.discount);
    order.orderType && context.setOrderType(order.orderType);
    order.people && context.setPeople(order.people);
    setTotal(order.total);
    setLoading(false);
  };
  const getDetails = async () => {
    const customerStateResult = await StorageUtils.getAsyncStorageData(
      'customerState',
    );
    setCustomerState(customerStateResult.value);

    setLoading(true);
    const peopleResult = await StorageUtils.getAsyncStorageData('people');
    if (peopleResult) {
      const peopleObject = peopleResult.value;

      setPeople(peopleObject);
    }
    const tableResult = await StorageUtils.getAsyncStorageData('table');
    if (tableResult) {
      const tableObject = tableResult.value;
      setTable(tableObject);
    }

    const menuResult = await StorageUtils.getAsyncStorageData('menu');
    if (menuResult) {
      const menuObject = menuResult.value;
      const categories = Object.keys(menuObject);
      setMenu([]);
      for (let category of categories) {
        const categoryObj = {
          category: category,
          items: menuObject[category],
        };
        setMenu(oldArray => [...oldArray, categoryObj]);
      }
    }

    const categoriesResult = await StorageUtils.getAsyncStorageData(
      'categories',
    );
    if (categoriesResult) {
      const categoryObj = categoriesResult.value;
      const sortedCategories = categoryObj.sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    }
    setLoading(false);
  };

  const findMenuItem = category => {
    scrollToTop();
    setSelectedMenu(category);
    const result = menuItemsByCategory[category];
    if (result) {
      setMenuItems(result);
    }
  };

  const selectedSubCategory = (category, subCategory) => {
    subCategory.forEach(element => {
      if (element[category]) {
        setMenuItems(element[category]);
        const newHasSubCat = {
          isSubCategory: true,
          subCategories: subCategory,
          category,
        };
        setHasSubCat(newHasSubCat);
      }
    });
  };

  const addToOrder = item => {
    const result = _.filter(orders, el => el.name == item.name && !el.notes);
    if (result.length > 0) {
      const prevOrders = [...orders];
      const newOrders = prevOrders.find(a => a.name == item.name && !a.notes);
      if (newOrders != undefined) {
        newOrders.quantity = newOrders.quantity + 1;
        setOrders(prevOrders);
      }
    } else {
      const addItem = {
        name: item.name,
        price: item.price,
        quantity: 1,
        category: item.category,
      };
      setOrders(oldState => [...oldState, addItem]);
    }

    let prevPrice = total;

    setTotal(prevPrice + item.price);
  };
  const addItemNote = () => {
    const customItem = {...notedItem, notes: itemNoteText};
    addToOrderWithNotes(customItem);
    setItemNoteShow(false);
    setItemNoteText('');
  };

  const addToOrderWithNotes = item => {
    const addItem = {
      name: item.name,
      price: item.price,
      quantity: 1,
      category: item.category,
      notes: item.notes,
    };
    setOrders(oldState => [...oldState, addItem]);

    let prevPrice = total;

    setTotal(prevPrice + item.price);
  };

  const removeOrderWithNotes = o => {
    const allorders = [...orders];
    const index = allorders.indexOf(o);
    index !== -1 && setTotal(pre => pre - allorders[index]?.price);
    if (allorders[index].quantity > 1) allorders[index].quantity -= 1;
    else allorders.splice(index, 1);
    setOrders(allorders);
  };

  const increaseQuantity = (item, index) => {
    let prevPrice = total;

    if (item.category === 'Custom') {
      const price = orders[index].price / orders[index].quantity;

      orders[index].quantity++;
      orders[index].price += price;
      setTotal(prevPrice + price);
    } else {
      orders[index].quantity++;
      setTotal(prevPrice + orders[index].price);
    }

    setOrders([...orders]);
  };

  const removeItem = item => {
    let itemIndex = -1;
    let totalDecrease = 0;

    for (let i = 0; i < orders.length; i++) {
      const orderItem = orders[i];
      if (
        orderItem.name === item.name &&
        orderItem.category === item.category &&
        !orderItem.notes
      ) {
        itemIndex = i;
        if (item.category === 'Custom') {
          const price = orderItem.price / orderItem.quantity;
          orderItem.price -= price;
          totalDecrease = price;
        } else {
          totalDecrease = item.price;
        }
        orderItem.quantity -= 1;
        break;
      }
    }

    if (itemIndex !== -1) {
      if (orders[itemIndex].quantity === 0) {
        orders.splice(itemIndex, 1);
        setOrders([...orders]);
      } else {
        setOrders([...orders]);
      }
      setTotal(prevTotal => prevTotal - totalDecrease);
    }
  };

  const addCustomItem = () => {
    const addItem = {
      name: customItem,
      price: Number(parseFloat(customItemPrice).toFixed(2)),
      quantity: customItemQuantity,
      category: customItemType == 'Food' ? customItemCategory : 'ALCOHOL',
    };
    setOrders(oldState => [...oldState, addItem]);

    let prevPrice = total;

    const price = Number(addItem.price) * Number(addItem.quantity);
    // const price =
    //   customItemType == "Food"
    //     ? Number(addItem.price)
    //     : Number(addItem.price) * Number(addItem.quantity);
    setTotal(prevPrice + price);
  };

  const updateInDB = async () => {
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    const client = await StorageUtils.getAsyncStorageData('client');
    const params = {
      history: {
        staff: context.staff,
        customer: context.customerState,
        people: context.people,
        items: orders,
        orderDate: Date.now(),
        orderType: context.orderType,
        subTotal,
        notes: context.notes,
        deliveryNotes: context.deliveryNotes,
        drinks: totalsByCategory['ALCOHOL'] ? totalsByCategory['ALCOHOL'] : 0,
        hotDrinks: totalsByCategory['BEVERAGES']
          ? totalsByCategory['BEVERAGES']
          : 0,
        desserts: totalsByCategory['DESSERTS']
          ? totalsByCategory['DESSERTS']
          : 0,
        discount: context.discount,
        total,
      },
      client: {
        order_id: context.orderId,
        client_id: clientId.value,
      },
    };

    // const res = await ApiServiceUtils.updateHistory(params);
    // if (res.acknowledged) {
    //   toast.show({
    //     id: 'order-added',
    //     title: 'Order added successfully',
    //   });
    // }
    await ApiServiceUtils.updateHistory(params);

    const body = {
      table: context.customerState.name,
      updateTable: true,
      client: {
        client: client.value,
        client_id: clientId.value,
      },
    };

    await ApiServiceUtils.updateActiveTables(body);
    context.setOrderId(0);
  };

  const placeOrder = async () => {
    // await printReceipt(orders);
    await updateInDB();
    setOrderPlaced(true);
  };

  const editOrder = () => {
    console.log('Edit order');
  };

  const newOrder = () => {
    StorageUtils.removeAsyncStorageData('customerState');
    StorageUtils.removeAsyncStorageData('table');
    StorageUtils.removeAsyncStorageData('orderType');
    navigation.navigate('Dashboard');
  };

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };
  if (loading)
    return (
      <View className="h-screen w-full flex-1 justify-center items-center">
        <Spinner size="lg" />
      </View>
    );
  return (
    <View className="bg-light h-full">
      <Header />
      <ScrollView ref={scrollViewRef}>
        <OrderPlacedComfirmation
          newOrder={newOrder}
          show={orderPlaced}
          edit={() => {
            setOrderPlaced(false), editOrder();
          }}
        />
        <View className="flex m-6">
          <View className="flex flex-row w-full">
            <View className="w-8/12">
              <Text className="text-4xl font-semibold text-gray-800">Menu</Text>
            </View>
            <View className="flex w-4/12 justify-center items-center">
              {orderType == 'Dine In' && (
                <Text className="text-xl font-semibold text-gray-700">
                  {`Dine In - Table ${table} (${people} people)`}
                </Text>
              )}

              {orderType == 'Collection' && (
                <Text className="text-xl font-semibold text-gray-700">
                  Collection order - {customerState && customerState.name}
                </Text>
              )}

              {orderType == 'Delivery' && (
                <Text className="text-xl font-semibold text-gray-700">
                  Delivery order - {customerState && customerState.address1}
                </Text>
              )}
            </View>
          </View>
          <View className="mt-4 flex flex-row w-full h-full space-x-2">
            {/* categories section start */}
            <View className="w-3/12 mt-1 h-full">
              {categories.map((category, index) => {
                return (
                  <TouchableOpacity
                    key={`${index}-${category.name}`}
                    className="my-2 h-14 bg-custom-secondary rounded-lg justify-center"
                    onPress={() => {
                      findMenuItem(category.name);
                      setHasSubCat(initialHasSubCat);
                    }}>
                    <Text className="text-center text-white mx-2 font-medium text-xl">
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                className="my-2 h-14 bg-custom-amber rounded-sm justify-center"
                onPress={() => {
                  handleCustItemShow();
                  setCustomItemType('Food');
                  setCustomItemCategory('STARTERS');
                }}>
                <Text className="text-center text-black m-2 font-medium text-xl">
                  Add Custom Item
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="my-2 h-14 bg-custom-amber rounded-sm justify-center"
                onPress={handleShow}>
                <Text className="text-center text-black m-2 font-medium text-xl">
                  Add Notes
                </Text>
              </TouchableOpacity>
            </View>
            {/* categories section end */}

            {/* items section start */}
            <View
              className="w-5/12 mt-3 p-4 h-full bg-white rounded-lg"
              style={[styles.elevation]}>
              {menuItems.map((s, index) => {
                return (
                  <React.Fragment key={`${index}-${s.name}`}>
                    {s.hasSubCategory ? (
                      s.subCategories?.map((sub, innerIndex) => {
                        return (
                          <React.Fragment key={`${innerIndex}-${sub}`}>
                            <View className="w-full">
                              <TouchableOpacity
                                className="my-2 w-48 h-14 bg-custom-secondary rounded-sm justify-center"
                                onPress={() =>
                                  selectedSubCategory(sub, s.subCategoryItems)
                                }>
                                <View className="w-full">
                                  <Text className="text-center text-white mx-2 font-medium text-xl">
                                    {sub}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <React.Fragment key={`${index}-${s.name}`}>
                        <View className="my-4 flex flex-row w-full ">
                          <View className="w-3/6">
                            <Text className="text-black text-xl">{s.name}</Text>
                          </View>
                          <View className="w-1/6">
                            <Text className="text-left text-black text-xl">
                              {' £'} {s.price?.toFixed(2)}
                            </Text>
                          </View>
                          <View className="w-2/6 flex flex-row space-x-2 justify-center">
                            {s.category != 'DESSERTS' &&
                              s.category != 'BEVERAGES' &&
                              s.category != 'ALCOHOL' && (
                                <>
                                  <TouchableOpacity
                                    className="w-10 h-8 bg-custom-primary flex justify-center rounded-md"
                                    onPress={() => {
                                      setNotedItem(s);
                                      setItemNoteShow(true);
                                    }}>
                                    <Text className="text-center text-xl text-white">
                                      <Icon
                                        name="sticky-note"
                                        size={16}
                                        color="#fefefe"
                                      />
                                    </Text>
                                  </TouchableOpacity>
                                </>
                              )}
                            <TouchableOpacity
                              className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                              onPress={e => addToOrder(s)}>
                              <Text className="text-center text-xl text-white">
                                <Icon name="plus" size={16} color="#fefefe" />
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              })}
            </View>
            {/* items section end */}

            {/* order section start */}
            <View className="w-4/12 mt-3">
              <View
                className="w-full p-4 h-auto min-h-10 bg-white rounded-lg"
                style={[styles.elevation]}>
                {orders.length > 0 ? (
                  <>
                    <View className="mb-4">
                      <Text className="text-black font-medium text-xl">
                        Order:
                      </Text>
                    </View>
                    <View>
                      {orders.map((o, index) => {
                        if (
                          o.category == 'STARTERS' ||
                          o.category == 'SIGNATURE STARTERS'
                        )
                          return (
                            <View
                              key={`${index}-${o.name}`}
                              className="w-full h-10 mt-2 my-1 font-semibold">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(o)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (
                          o.category != 'STARTERS' &&
                          o.category != 'SUNDAY MENU' &&
                          o.category != 'SIGNATURE STARTERS' &&
                          o.category != 'VEGETABLE SIDE DISHES' &&
                          o.category != 'SUNDRIES' &&
                          o.category != 'DESSERTS' &&
                          o.category != 'BEVERAGES' &&
                          o.category != 'ALCOHOL'
                        )
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(o)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category === 'SUNDAY MENU')
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(o)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category == 'VEGETABLE SIDE DISHES')
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(o)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category == 'SUNDRIES')
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(o)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category == 'DESSERTS')
                          return (
                            <View key={`${index}-${o.name}`} className="my-2">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category == 'BEVERAGES')
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                      {orders.map((o, index) => {
                        if (o.category == 'ALCOHOL')
                          return (
                            <View key={`${index}-${o.name}`} className="my-1">
                              {
                                <View className="flex flex-row w-full">
                                  <View className="flex w-2/3">
                                    <Text className="text-xl text-black">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-danger flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="minus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-custom-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-white">
                                          <Icon
                                            name="plus"
                                            size={16}
                                            color="#fefefe"
                                          />
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              }
                            </View>
                          );
                      })}
                    </View>
                    <View className="mt-4 flex w-full h-full">
                      <View className="flex w-full h-full">
                        <Text className="text-black font-bold text-xl mb-6">
                          Total: £{total.toFixed(2)}
                        </Text>
                        {savedNotes.length > 0 && (
                          <Text className="text-black font-bold text-xl mb-6">
                            Notes:{' '}
                            <Text className="font-normal">{savedNotes}</Text>
                          </Text>
                        )}
                        <TouchableOpacity
                          className="bg-custom-amber py-2 px-4 rounded my-4"
                          onPress={placeOrder}>
                          <Text className="text-black text-center font-bold text-lg">
                            PLACE ORDER
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                ) : (
                  <View className="w-full justify-center items-center flex">
                    <Text className="text-center text-black text-lg">
                      Empty plate 🙁
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* order section start */}
          </View>
        </View>
        <View>
          <Modal
            isVisible={itemNoteShow}
            animationType="fade"
            className="flex-1 justify-center items-center"
            onBackButtonPress={() => {
              setItemNoteShow(false);
              setItemNoteText('');
            }}>
            <View>
              <StyledComponent
                component={View}
                tw="bg-white w-[500px] max-w-[80%] rounded-lg shadow-lg">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  padding={4}>
                  <StyledComponent
                    component={Text}
                    tw="text-2xl font-medium text-black">
                    Add notes for {notedItem && notedItem.name}
                  </StyledComponent>
                  <TouchableOpacity
                    onPress={() => {
                      setItemNoteShow(false);
                      setItemNoteText('');
                    }}>
                    <FeatherIcon name="x" size={35} color="#555" />
                  </TouchableOpacity>
                </Stack>
                <SafeAreaView>
                  <StyledComponent
                    component={TextInput}
                    tw="border-[0.8px] border-custom-border-color m-4 pl-4 rounded"
                    onChangeText={text => setItemNoteText(text)}
                    placeholder="Hot, medium etc..."
                    placeholderTextColor={'grey'}
                    onSubmitEditing={addItemNote}
                  />
                </SafeAreaView>
                <Stack
                  space={4}
                  justifyContent="flex-end"
                  direction="row"
                  padding={4}>
                  <StyledComponent
                    component={Button}
                    tw="w-1/2 rounded capitalize"
                    title="Close"
                    color="grey"
                    onPress={() => {
                      setItemNoteShow(false);
                      setItemNoteText('');
                    }}
                  />
                  <StyledComponent
                    component={Button}
                    tw="w-1/2 rounded capitalize m-2"
                    title="Add to order"
                    onPress={addItemNote}
                  />
                </Stack>
              </StyledComponent>
            </View>
          </Modal>
        </View>
        <View>
          <Modal
            isVisible={showCustModal}
            animationType="fade"
            className="flex-1 justify-center items-center"
            onBackButtonPress={handleCustItemClose}>
            <StyledComponent
              component={View}
              tw="bg-white min-w-[500px] max-w-[80%] rounded-lg shadow-lg">
              <ScrollView>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottomWidth={1}
                  borderBottomColor="rgb(206, 212, 218)"
                  padding={4}>
                  <StyledComponent
                    component={Text}
                    tw="text-2xl font-medium text-black">
                    Add custom item - {customItemType}
                  </StyledComponent>
                  <TouchableOpacity onPress={handleCustItemClose}>
                    <FeatherIcon name="x" size={40} color="#555" />
                  </TouchableOpacity>
                </Stack>
                <StyledComponent component={View} tw="p-4">
                  <StyledComponent
                    text-xl
                    tw="my-2 text-custom-dark text-xl"
                    component={Text}>
                    Type
                  </StyledComponent>
                  <Radio.Group
                    name="FoodType"
                    accessibilityLabel="Select type"
                    value={customItemType}
                    onChange={nextValue => {
                      setCustomItemType(nextValue);
                    }}>
                    <Stack direction="row" alignItems="center" space={4}>
                      <Radio value="Food" my={1}>
                        Food
                      </Radio>
                      <Radio value="Drink" my={1}>
                        Drink
                      </Radio>
                    </Stack>
                  </Radio.Group>
                  {customItemType == 'Food' && (
                    <>
                      <StyledComponent
                        text-xl
                        tw="my-2 text-custom-dark text-xl"
                        component={Text}>
                        Category
                      </StyledComponent>
                      <Radio.Group
                        name="FoodCategory"
                        accessibilityLabel="Select category"
                        value={customItemCategory}
                        onChange={nextValue => {
                          setCustomItemCategory(nextValue);
                        }}>
                        <Stack direction="row" alignItems="center" space={4}>
                          <Radio value="STARTERS" my={1}>
                            Starter
                          </Radio>
                          <Radio value="ENGLISH DISHES" my={1}>
                            Main
                          </Radio>
                          <Radio value="SUNDRIES" my={1}>
                            Sundry
                          </Radio>
                        </Stack>
                      </Radio.Group>
                    </>
                  )}
                  <StyledComponent
                    text-xl
                    tw="my-2 text-black text-xl"
                    component={Text}>
                    Item
                  </StyledComponent>
                  <StyledComponent
                    component={TextInput}
                    multiline={true}
                    numberOfLines={2}
                    onChangeText={t => setCustomItem(t)}
                    tw="border border-gray-300 p-3 rounded-md w-full"
                    defaultValue={customItem.toString()}
                    placeholder="Add Details"
                    placeholderTextColor="grey"
                  />
                  <StyledComponent
                    text-xl
                    tw="my-2 text-black text-xl"
                    component={Text}>
                    Quantity
                  </StyledComponent>
                  <StyledComponent
                    component={TextInput}
                    keyboardType="numeric"
                    maxLength={2}
                    onChangeText={t => setCustomItemQuantity(t)}
                    tw="border border-gray-300 p-3 rounded-md"
                    placeholder="1,2,3 etc..."
                    defaultValue={customItemQuantity.toString()}
                    placeholderTextColor="grey"
                  />
                  <StyledComponent
                    text-xl
                    tw="my-2 text-black text-xl"
                    component={Text}>
                    Price
                  </StyledComponent>
                  <StyledComponent
                    component={TextInput}
                    keyboardType="numeric"
                    tw="border border-gray-300 p-3 rounded-md"
                    placeholder="Item Price"
                    defaultValue={customItemPrice.toString()}
                    onChangeText={t => setCustomItemPrice(t)}
                    placeholderTextColor="grey"
                  />
                </StyledComponent>
                <Stack
                  marginY={4}
                  marginRight={4}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  space={4}>
                  <StyledComponent
                    component={Button}
                    tw="w-1/2 rounded capitalize"
                    title="Close"
                    color="grey"
                    onPress={handleCustItemClose}
                  />
                  <StyledComponent
                    disabled={customItemQuantity == 0 || customItem == ''}
                    onPress={() => {
                      setShowCustModal(false);
                      addCustomItem();
                      scrollToTop();
                    }}
                    component={Button}
                    tw="rounded capitalize"
                    title="Add to order"
                  />
                </Stack>
              </ScrollView>
            </StyledComponent>

            {/* </StyledComponent> */}
          </Modal>
        </View>
        <AddNotesModal
          show={show}
          handleClose={handleClose}
          notes={savedNotes}
          setSavedNotes={setSavedNotes}
        />
      </ScrollView>
    </View>
  );
}
