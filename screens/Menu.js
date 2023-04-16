import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState, useContext, useEffect, useRef} from 'react';
import GlobalContext from '../utils/GlobalContext.';
import Header from '../components/Header';
import StorageUtils from '../utils/StorageUtils';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Menu() {
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

  const {staff, orderType} = useContext(GlobalContext);

  const [menu, setMenu] = useState([]);

  const [itemNoteShow, setItemNoteShow] = useState(false);

  const [notedItem, setNotedItem] = useState();

  const [categories, setCategories] = useState([]);

  const [hasSubCat, setHasSubCat] = useState(initialHasSubCat);

  const [menuItems, setMenuItems] = useState(popular);

  const [selectedMenu, setSelectedMenu] = useState('');

  const [orders, setOrders] = useState([]);

  const [total, setTotal] = useState(0);

  const [show, setShow] = useState(false);

  const [showCustModal, setShowCustModal] = useState(false);

  const [savedNotes, setSavedNotes] = useState('');

  const [customItemType, setCustomItemType] = useState('Food');
  const [customItemCategory, setCustomItemCategory] = useState('STARTERS');
  const [customItem, setCustomItem] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState(1);
  const [customItemPrice, setCustomItemPrice] = useState(0);

  const [starterItems, setStarterItems] = useState(0);
  const [mainItems, setMainItems] = useState(0);
  const [sideDishes, setSideDishesItems] = useState(0);
  const [dessertItems, setDessertItems] = useState(0);
  const [beverageItems, setBeverageItems] = useState(0);
  const [alcoholItems, setAlcoholItems] = useState(0);
  const [sundriesItems, setSundriesItems] = useState(0);
  const [sundayItems, setSundayItems] = useState(0);

  const scrollViewRef = useRef();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCustItemClose = () => setShowCustModal(false);
  const handleCustItemShow = () => setShowCustModal(true);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
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
  };

  const findMenuItem = category => {
    scrollToTop();
    setSelectedMenu(category);
    const result = _.filter(menu, el => el.category == category);
    if (result != undefined) {
      setMenuItems(result[0].items);
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
    console.log('orders', orders);
  };

  const addItemNote = e => {
    e.preventDefault();
    const form = e.target;
    const customItem = {...notedItem, notes: form.itemNote.value};
    addToOrderWithNotes(customItem);
    setItemNoteShow(false);
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

  const removeOrderWithNotes = index => {
    const allorders = [...orders];
    allorders[index] && setTotal(pre => pre - allorders[index].price);
    if (allorders[index].quantity > 1) allorders[index].quantity -= 1;
    else allorders.splice(index, 1);
    setOrders(allorders);
  };

  const increaseQuantity = (item, index) => {
    const newOrders = [...orders];

    let prevPrice = total;

    if (item.category == 'Custom') {
      const price = newOrders[index].price / newOrders[index].quantity;

      newOrders[index].quantity++;

      newOrders[index].price += price;
      setTotal(prevPrice + price);
    } else {
      newOrders[index].quantity++;
      setTotal(prevPrice + newOrders[index].price);
    }

    setOrders(newOrders);
  };

  const removeItem = item => {
    const result = _.filter(
      orders,
      orderItem =>
        orderItem.name == item.name &&
        orderItem.category == item.category &&
        !orderItem.notes,
    );
    if (result.length > 0) {
      const prevOrders = [...orders];
      const newOrders = prevOrders.find(
        orderItem => orderItem.name == item.name && !orderItem.notes,
      );
      if (newOrders != undefined) {
        if (newOrders.quantity > 0) {
          let prevPrice = total;

          let price = 0;

          if (item.category == 'Custom') {
            price = newOrders.price / newOrders.quantity;
            newOrders.price = newOrders.price - price;
          }

          newOrders.quantity = newOrders.quantity - 1;

          if (newOrders.quantity == 0) {
            const removedItem = orders.filter(
              orderItem => orderItem.name != item.name,
            );

            const filteredOrders = [...removedItem];
            setOrders(filteredOrders);
          } else {
            setOrders(prevOrders);
          }

          if (item.category == 'Custom') {
            setTotal(prevPrice - price);
          } else {
            setTotal(prevPrice - item.price);
          }
        }
      }
    }
  };

  const addCustomItem = () => {
    const addItem = {
      name: customItem,
      price: customItemPrice,
      quantity: customItemQuantity,
      category: customItemType == 'Food' ? customItemCategory : 'ALCOHOL',
      // price:
      //   customItemType == "Food"
      //     ? customItemPrice * customItemQuantity
      //     : customItemPrice,
      // category: customItemType == "Food" ? "Custom" : "ALCOHOL",
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

  const placeOrder = () => {};

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({y: 0, animated: true});
  };

  return (
    <View className="bg-light h-full">
      <Header />
      <ScrollView ref={scrollViewRef}>
        <View className="flex m-6">
          <Text className="text-4xl font-semibold text-primary">Menu</Text>
          <View className="mt-4 flex flex-row w-full h-full space-x-2">
            {/* categories section start */}
            <View className="w-3/12 mt-1 h-full">
              {categories.map((category, index) => {
                return (
                  <TouchableOpacity
                    key={`${index}-${category.name}`}
                    className="my-2 h-14 bg-secondary rounded-lg justify-center"
                    onPress={() => {
                      findMenuItem(category.name);
                      setHasSubCat(initialHasSubCat);
                    }}>
                    <Text className="text-center text-clear mx-2 font-medium text-xl">
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                className="my-2 h-14 bg-amber rounded-sm justify-center"
                onPress={() => {
                  handleCustItemShow();
                  setCustomItemType('Food');
                  setCustomItemCategory('STARTERS');
                }}>
                <Text className="text-center text-primary m-2 font-medium text-xl">
                  Add Custom Item
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="my-2 h-14 bg-amber rounded-sm justify-center"
                onPress={handleShow}>
                <Text className="text-center text-primary m-2 font-medium text-xl">
                  Add Notes
                </Text>
              </TouchableOpacity>
            </View>
            {/* categories section end */}

            {/* items section start */}
            <View className="w-5/12 mt-3 p-4 h-full bg-clear rounded-lg">
              {menuItems.map((s, index) => {
                return (
                  <React.Fragment key={`${index}-${s.name}`}>
                    {s.hasSubCategory ? (
                      s.subCategories?.map((sub, innerIndex) => {
                        return (
                          <React.Fragment key={`${innerIndex}-${sub}`}>
                            <View className="w-full">
                              <TouchableOpacity
                                className="my-2 w-48 h-14 bg-secondary rounded-sm justify-center"
                                onPress={() =>
                                  selectedSubCategory(sub, s.subCategoryItems)
                                }>
                                <View className="w-full">
                                  <Text className="text-center text-clear mx-2 font-medium text-xl">
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
                            <Text className="text-primary text-xl">
                              {s.name}
                            </Text>
                          </View>
                          <View className="w-1/6">
                            <Text className="text-left text-primary text-xl">
                              {' £'} {s.price?.toFixed(2)}
                            </Text>
                          </View>
                          <View className="w-2/6 flex flex-row space-x-2 justify-center">
                            {s.category != 'DESSERTS' &&
                              s.category != 'BEVERAGES' &&
                              s.category != 'ALCOHOL' && (
                                <>
                                  <TouchableOpacity
                                    className="w-10 h-8 bg-primary flex justify-center rounded-md"
                                    onPress={() => {
                                      setNotedItem(s);
                                      setItemNoteShow(true);
                                    }}>
                                    <Text className="text-center text-xl text-clear">
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
                              className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                              onPress={e => addToOrder(s)}>
                              <Text className="text-center text-xl text-clear">
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
              <View className="w-full p-4 h-auto min-h-10 bg-clear rounded-lg">
                {orders.length > 0 ? (
                  <>
                    <View className="mb-4">
                      <Text className="text-primary font-medium text-xl">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(index)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(index)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(index)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(index)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                    <Text>{o.notes && `- ${o.notes}`}</Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={
                                          o.notes
                                            ? () => removeOrderWithNotes(index)
                                            : () => removeItem(o)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                                    <Text className="text-xl text-primary">
                                      {o.quantity} x {o.name}
                                    </Text>
                                  </View>
                                  <View className="flex flex-row space-x-1">
                                    <View>
                                      <TouchableOpacity
                                        className="w-10 h-8 bg-warningDark flex justify-center rounded-md"
                                        onPress={() => removeItem(o)}>
                                        <Text className="text-center text-xl text-clear">
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
                                        className="w-10 h-8 bg-secondary flex justify-center rounded-md"
                                        onPress={() =>
                                          increaseQuantity(o, index)
                                        }>
                                        <Text className="text-center text-xl text-clear">
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
                        <Text className="text-primary font-bold text-xl mb-6">
                          Total: £{total.toFixed(2)}
                        </Text>
                        <Button
                          title="Place order"
                          color="#ffc107"
                          onPress={() =>
                            Alert.alert('Button with adjusted color pressed')
                          }
                        />
                      </View>
                    </View>
                    <View className="mt-4 flex w-full h-full">
                      <Text>{savedNotes.length > 0 && 'Notes:'}</Text>
                      <Text>{savedNotes}</Text>
                    </View>
                  </>
                ) : (
                  <View className="w-full justify-center items-center flex">
                    <Text className="text-center text-primary text-lg">
                      Empty plate 🙁
                    </Text>
                  </View>
                )}
              </View>
            </View>
            {/* order section start */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
