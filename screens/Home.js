import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function Home() {
  return (
    <>
      <View className="flex flex-row">
        <View className="w-1/12 h-screen bg-secondary flex">
          <View className="items-center mb-4">
            <View className="flex flex-col justify-between w-36 h-full bg-primary">
              <View className="flex">
                <TouchableOpacity className="w-full h-20 justify-center">
                  <Text className="text-center text-clear">Dashboard</Text>
                </TouchableOpacity>
                <View className="border-b-2 border-b-secondary"></View>
                <TouchableOpacity className="w-full h-20 justify-center ">
                  <Text className="text-center text-clear">New Order</Text>
                </TouchableOpacity>
                <View className="border-b-2 border-b-secondary"></View>
                <TouchableOpacity className="w-full h-20 justify-center ">
                  <Text className="text-center text-clear">Orders</Text>
                </TouchableOpacity>
                <View className="border-b-2 border-b-secondary"></View>
              </View>
              <View className="flex">
                <View className="border-b-2 border-b-secondary"></View>
                <TouchableOpacity className="w-full h-20 justify-center">
                  <Text className="text-center text-warning font-bold">
                    Sign out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View className="w-11/12 h-screen bg-warning flex">
          <View className="flex w-full h-full items-center">
            <View className="w-full h-12 justify-center items-end bg-clear flex">
              <View className="w-full h-full flex-row bg-clear">
                <View className="w-1/2  flex items-center">
                  <View className="flex h-full justify-center">
                    {/* <Text className="text-center text-primary font-extrabold">
                      Connected to printer
                    </Text> */}
                  </View>
                </View>
                <View className="w-1/2  items-end">
                  <View className="flex flex-row h-full justify-center items-center mx-3">
                    <Text className="flex mx-4 text-center font-bold text-xl">
                      Murad
                    </Text>
                    <View className="flex w-10 h-10 rounded-full bg-warning justify-center items-center">
                      <Text className="text-center text-clear font-extrabold">
                        MU
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View className="w-full h-full bg-primary flex flex-row">
              <View className="w-9/12 h-full bg-[#808080] py-2 pl-2 pr-1">
                <View className="w-full h-full bg-clear">
                  <View className="flex flex-col space-x-1 space-y-1 my-1">
                    <View className="w-32 h-10  justify-center bg-warning ml-1">
                      <Text className="text-center text-clear">Starters</Text>
                    </View>
                    <View className="w-32 h-10  justify-center bg-warning">
                      <Text className="text-center text-clear">Drinks</Text>
                    </View>
                    <View className="w-32 h-10  justify-center bg-warning">
                      <Text className="text-center text-clear">Sides</Text>
                    </View>
                    <View className="w-32 h-10  justify-center bg-warning">
                      <Text className="text-center text-clear">Mains</Text>
                    </View>
                    <View className="w-32 h-10  justify-center bg-warning">
                      <Text className="text-center text-clear">Desserts</Text>
                    </View>
                    <View className="w-32 h-10  justify-center bg-warning">
                      <Text className="text-center text-clear">Alcohol</Text>
                    </View>
                  </View>
                  {/* <Text className="text-center">TEST</Text> */}
                </View>
              </View>
              <View className="w-3/12 h-full bg-[#808080] py-2 pl-1 pr-2">
                <View className="w-full h-full bg-clear flex items-center">
                  <View className="flex flex-col w-full h-full">
                    <View className="flex bg-primary h-14 justify-center">
                      <View className="w-full justify-center">
                        <Text className="mx-3 text-left text-clear">
                          Your Order
                        </Text>
                      </View>
                    </View>
                    <View className="flex bg-clear h-4/6 justify-center">
                      <View className="w-full h-full">
                        <View className="flex flex-row w-full h-full">
                          <View className="w-full flex-row">
                            <View className="flex w-6/12">
                              <Text className="m-2">Rice</Text>
                              <Text className="m-2">Nan</Text>
                              <Text className="m-2">Fries</Text>
                              <Text className="m-2">Drinks</Text>
                            </View>
                            <View className="flex w-4/12">
                              <Text className="m-2">£2.00</Text>
                              <Text className="m-2">£2.00</Text>
                              <Text className="m-2">£2.00</Text>
                              <Text className="m-2">£2.00</Text>
                            </View>
                            <View className="flex w-4/12">
                              <Text className="m-2">3</Text>
                              <Text className="m-2">1</Text>
                              <Text className="m-2">2</Text>
                              <Text className="m-2">1</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View className="flex bg-primary h-36 justify-center">
                      <View className="w-full justify-center">
                        <View className="flex flex-row w-full">
                          <View className="w-1/2">
                            <Text className="mx-3 text-left text-clear">
                              Items
                            </Text>
                            <Text className="mx-3 my-2 text-left text-clear">
                              Total
                            </Text>
                          </View>
                          <View className="w-1/2">
                            <Text className="mx-3 text-left text-clear">
                              6X
                            </Text>
                            <Text className="mx-3 my-2 text-left text-clear">
                              £30.00
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* </View> */}
                  </View>
                </View>
              </View>
            </View>
            {/* </View> */}
          </View>
        </View>
      </View>
      {/* <View className="flex flex-wrap  bg-[#808080]">
        <View className="flex flex-col justify-between w-36 h-full bg-primary">
          <View className="flex">
            <TouchableOpacity className="w-full h-20 justify-center ">
              <Text className="text-center text-clear">Dashboard</Text>
            </TouchableOpacity>
            <View className="border-b-2 border-b-secondary"></View>
            <TouchableOpacity className="w-full h-20 justify-center ">
              <Text className="text-center text-clear">New Order</Text>
            </TouchableOpacity>
            <View className="border-b-2 border-b-secondary"></View>
            <TouchableOpacity className="w-full h-20 justify-center ">
              <Text className="text-center text-clear">Orders</Text>
            </TouchableOpacity>
            <View className="border-b-2 border-b-secondary"></View>
          </View>
          <TouchableOpacity className="w-full h-20 justify-center border-t-2 border-t-secondary ">
            <Text className="text-center text-clear">Sign out</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full h-12 bg-warning flex">
          <View className="flex h-full justify-center items-end">
            <Text className="text-center">TEST</Text>
          </View>
        </View>
        <View className="h-14 w-screen bg-light justify-center">
          <View className="flex w-full flex-row h-full justify-center items-end">
            <Text className="flex mx-4 text-center font-bold text-xl">
              Murad
            </Text>
            <View className="flex w-10 h-10 rounded-full bg-warning justify-center items-center">
              <Text className="text-center text-clear font-extrabold">MU</Text>
            </View>
          </View>
        </View>
        <View className="flex flex-wrap h-96 w-full bg-[#808080]">
          <View className="m-2 mb-6 h-screen w-3/5 bg-clear"></View>
          <View className="my-2 mb-6 h-screen w-2/5 bg-secondary"></View>
        </View>
      </View> */}
    </>
  );
}
