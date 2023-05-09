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
  showCustModal,
  handleCustItemClose,
  customItemType,
  setCustomItemType,
  customItemCategory,
  setCustomItem,
  customItem,
  setCustomItemCategory,
  setCustomItemQuantity,
  customItemQuantity,
  setCustomItemPrice,
  setShowCustModal,
  addCustomItem,
  scrollToTop,
  customItemPrice,
}) {
  const quantityRef = useRef(null);
  const priceRef = useRef(null);
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
                  Food
                </Radio>
                <Radio value="Drink" my={1}>
                  Drink
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
            <Text className="my-2 text-black text-xl">Item</Text>
            <TextInput
              onChangeText={t => setCustomItem(t)}
              className="w-full border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              onSubmitEditing={() => quantityRef.current.focus()}
              defaultValue={customItem.toString()}
              placeholder="Add Details"
              placeholderTextColor="grey"
              returnKeyType="next"
            />
            <Text className="my-2 text-black text-xl">Quantity</Text>
            <TextInput
              ref={quantityRef}
              keyboardType="numeric"
              maxLength={2}
              onChangeText={t => setCustomItemQuantity(t)}
              className="border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              onSubmitEditing={() => priceRef.current.focus()}
              placeholder="1,2,3 etc..."
              defaultValue={customItemQuantity.toString()}
              placeholderTextColor="grey"
              returnKeyType="next"
            />
            <Text className="my-2 text-black text-xl">Price</Text>
            <TextInput
              ref={priceRef}
              keyboardType="numeric"
              className="border border-gray-300 p-3 rounded-md focus:border-custom-secondary"
              placeholder="Item Price"
              onChangeText={t => setCustomItemPrice(t)}
              onSubmitEditing={() => {
                setShowCustModal(false);
                addCustomItem();
                scrollToTop();
              }}
              defaultValue={customItemPrice.toString()}
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
              className="h-auto rounded  bg-custom-grey px-4 py-2">
              <Text className="text-white uppercase font-semibold">Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={customItemQuantity === 0 || customItem === ''}
              onPress={() => {
                setShowCustModal(false);
                addCustomItem();
                scrollToTop();
              }}
              className={`h-auto rounded  bg-custom-grey px-4 py-2 ${
                customItemQuantity === 0 || customItem === ''
                  ? 'bg-custom-primary/50'
                  : 'bg-custom-primary'
              }`}>
              <Text className="text-white uppercase font-semibold">
                Add to order
              </Text>
            </TouchableOpacity>
          </Stack>
        </ScrollView>
      </View>
    </Modal>
  );
}
