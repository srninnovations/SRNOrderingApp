import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import React, {useRef} from 'react';
import {Radio, Stack} from 'native-base';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function CustomItemModal({
  scrollToTop,
  showCustModal,
  handleCustItemClose,
  addCustomItem,
  customItemType,
  customItemCategory,
  customItem,
  customItemQuantity,
  customItemPrice,
  setCustomItemType,
  setCustomItem,
  setCustomItemCategory,
  setCustomItemQuantity,
  setCustomItemPrice,
  setShowCustModal,
}) {
  const quantityRef = useRef(null);
  const priceRef = useRef(null);

  const addToOrder = () => {
    setShowCustModal(false);
    addCustomItem();
    scrollToTop();
  };

  return (
    <Modal
      isVisible={showCustModal}
      animationType="fade"
      className="flex-1 justify-center items-center"
      onBackButtonPress={handleCustItemClose}>
      <View className="bg-white min-w-[500px] max-w-[80%] rounded-lg shadow-lg">
        <ScrollView>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            borderBottomWidth={1}
            borderBottomColor="rgb(206, 212, 218)"
            padding={4}>
            <Text className="text-2xl font-medium text-black">
              Add custom item - {customItemType}
            </Text>
            <TouchableOpacity onPress={handleCustItemClose}>
              <FeatherIcon name="x" size={40} color="#555" />
            </TouchableOpacity>
          </Stack>
          <View className="p-4">
            <Text className="my-2 text-custom-dark text-xl">Type</Text>
            <Radio.Group
              name="FoodType"
              accessibilityLabel="Select type"
              value={customItemType}
              onChange={nextValue => {
                setCustomItemType(nextValue);
              }}>
              <Stack direction="row" alignItems="center" space={4}>
                <Radio value="Food" my={1}>
                  <Text className="text-black text-xl">Food</Text>
                </Radio>
                <Radio value="Drink" my={1}>
                  <Text className="text-black text-xl">Drink</Text>
                </Radio>
              </Stack>
            </Radio.Group>
            {customItemType === 'Food' && (
              <>
                <Text className="my-2 text-custom-dark text-xl">Category</Text>
                <Radio.Group
                  name="FoodCategory"
                  accessibilityLabel="Select category"
                  value={customItemCategory}
                  onChange={nextValue => {
                    setCustomItemCategory(nextValue);
                  }}>
                  <Stack direction="row" alignItems="center" space={4}>
                    <Radio value="STARTERS" my={1}>
                      <Text className="text-black text-xl">Starter</Text>
                    </Radio>
                    <Radio value="ENGLISH DISHES" my={1}>
                      <Text className="text-black text-xl">Main</Text>
                    </Radio>
                    <Radio value="SUNDRIES" my={1}>
                      <Text className="text-black text-xl">Sundry</Text>
                    </Radio>
                  </Stack>
                </Radio.Group>
              </>
            )}
            <Text className="my-2 mt-3 text-black text-xl">Item</Text>
            <TextInput
              size="lg"
              onChangeText={t => setCustomItem(t)}
              className="text-xl w-full border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              onSubmitEditing={() => quantityRef.current.focus()}
              defaultValue={customItem.toString()}
              placeholder="Enter name"
              placeholderTextColor="grey"
              returnKeyType="next"
            />
            <Text className="my-2 text-black text-xl">Quantity</Text>
            <TextInput
              ref={quantityRef}
              keyboardType="numeric"
              maxLength={2}
              onChangeText={t => setCustomItemQuantity(t)}
              className="text-xl border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              onSubmitEditing={() => priceRef.current.focus()}
              placeholder="Enter quantity"
              defaultValue={customItemQuantity.toString()}
              placeholderTextColor="grey"
              returnKeyType="next"
            />
            <Text className="my-2 text-black text-xl">Price</Text>
            <TextInput
              ref={priceRef}
              keyboardType="numeric"
              className="text-xl border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              placeholder="Enter price"
              onChangeText={t => setCustomItemPrice(t)}
              onSubmitEditing={() => {
                if (
                  customItemQuantity != 0 &&
                  customItem != '' &&
                  customItemPrice &&
                  customItemCategory != ''
                ) {
                  addToOrder();
                }
              }}
              value={customItemPrice.toString()}
              // defaultValue={customItemPrice.toString()}
              placeholderTextColor="grey"
            />
          </View>
          <Stack
            marginY={4}
            marginRight={4}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            space={4}>
            <TouchableOpacity
              onPress={handleCustItemClose}
              className="flex justify-center rounded  bg-custom-grey px-4 py-2">
              <Text className="text-white text-center text-xl uppercase">
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                customItemQuantity == 0 ||
                customItem == '' ||
                !customItemPrice ||
                customItemCategory == ''
              }
              onPress={() => {
                addToOrder();
              }}
              className={`flex rounded justify-center px-4 py-2 ${
                customItemQuantity == 0 ||
                customItem == '' ||
                !customItemPrice ||
                customItemCategory == ''
                  ? 'bg-custom-primary/50'
                  : 'bg-custom-primary'
              }`}>
              <Text className="text-white text-center text-xl uppercase">
                Add to order
              </Text>
            </TouchableOpacity>
          </Stack>
        </ScrollView>
      </View>
    </Modal>
  );
}
