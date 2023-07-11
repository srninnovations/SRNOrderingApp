import {View, ScrollView} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import StorageUtils from '../utils/StorageUtils';
import Header from '../components/Header';
import ApiServiceUtils from '../utils/ApiServiceUtils';

import {Spinner, Text, HStack, VStack, useToast} from 'native-base';
import GlobalContext from '../utils/GlobalContext.';
import CustomToast from '../components/CustomToast';

export default function Sales({navigation}) {
  const toast = useToast();

  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [totalsByOrderType, setTotalsByOrderType] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    getHistoryData();
  }, []);

  const getHistoryData = async () => {
    setLoading(true);
    const clientId = await StorageUtils.getAsyncStorageData('clientId');
    if (clientId.value) {
      const orders = await ApiServiceUtils.getOrders(clientId.value);
      if (orders) {
        // const total
        const totalsByOrderType = orders.reduce((totals, order) => {
          const {orderType, total} = order;

          if (!totals[orderType]) {
            totals[orderType] = 0;
          }

          totals[orderType] += total;

          totals[orderType] = parseFloat(totals[orderType].toFixed(2));

          return totals;
        }, {});

        const totalSum = orders.reduce(
          (accumulator, order) => accumulator + order.total,
          0,
        );

        setTotalsByOrderType(totalsByOrderType);
        setTotal(totalSum.toFixed(2));
      }
    } else
      toast.show({
        render: () => (
          <CustomToast title="Unexpected error occurred while getting history, please log out and try again. If the issue persists please contact us." />
        ),
      });
    setLoading(false);
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="lg" />
      </View>
    );

  return (
    <>
      <Header />
      <View className="px-20 min-h-screen">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-3xl font-medium uppercase text-center text-custom-dark py-5 border-b border-custom-border-color w-full">
            Sales
          </Text>
          <HStack
            justifyContent="space-between"
            space={10}
            className="p-3 mt-5">
            {Object.keys(totalsByOrderType).map(orderType => (
              <VStack
                flex={1}
                key={orderType}
                space={1}
                my={2}
                className="rounded-xl bg-white w-44 h-32">
                <View className="m-4">
                  <Text className="text-center text-2xl">{orderType}</Text>

                  <Text className="text-center font-bold text-3xl my-3">
                    £{totalsByOrderType[orderType].toFixed(2)}
                  </Text>
                </View>
              </VStack>
            ))}
          </HStack>
          <HStack justifyContent="center" className="p-3 mt-5">
            <VStack
              key="total"
              flex={1}
              space={1}
              my={2}
              className="rounded-xl bg-white h-32">
              <View className="m-4">
                <Text className="text-center text-2xl">Total</Text>
                <Text className="text-center font-bold text-3xl my-3">
                  £{total}
                </Text>
              </View>
            </VStack>
          </HStack>

          {/* <HStack
            justifyContent="space-between"
            space={10}
            className="px-3 mt-5">
            <View>
              {Object.keys(totals).map((orderType, index) => (
                <VStack
                  key={orderType + index}
                  space={1}
                  my={2}
                  className="rounded-xl bg-white w-44 h-32">
                  <View>
                    <Text className="text-center m-2">{orderType}</Text>

                    <Text className="text-center font-bold text-3xl my-3">
                      £{totals[orderType]}
                    </Text>
                  </View>
                </VStack>
              ))}
            </View>
          </HStack> */}
        </ScrollView>
      </View>
    </>
  );
}
