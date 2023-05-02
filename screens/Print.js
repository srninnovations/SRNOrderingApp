// import {Text, View, TouchableOpacity} from 'react-native';
// import React, {useEffect, useMemo, useState} from 'react';
// import Header from '../components/Header';
// import {getPrinter, printReceipt} from '../utils/PrinterService';

// export default function Print() {
//   const [printer, setPrinter] = useState('Available');
//   useEffect(() => {
//     findPrinter();
//   }, []);
//   const findPrinter = async () => {
//     const response = await getPrinter();
//     console.log('response', response.printer);
//     setPrinter(response.printer);
//   };
//   const cachedPrinter = useMemo(() => printer, [printer]);
//   return (
//     <View className="bg-light h-full">
//       <Header />
//       <View className="flex justify-center h-auto w-full mt-6 items-center align-middle">
//         <Text
//           className={`text-lg w-[350px] h-auto p-6 mx-auto text-white font-normal uppercase text-center  rounded-lg ${
//             (printer && printer.status == 'Not connected') || !printer
//               ? 'bg-custom-amber'
//               : 'bg-custom-secondary'
//           }`}>
//           {(printer && printer.status == 'Not connected') || !printer ? (
//             <>
//               <Text className="text-white font-bold">
//                 Printer not connected
//               </Text>
//             </>
//           ) : (
//             'Connected Printer'
//           )}
//         </Text>
//       </View>
//       <View className="flex mt-24 justify-center items-center w-screen">
//         <TouchableOpacity
//           className="mb-10 bg-custom-secondary rounded p-6"
//           onPress={() => printReceipt()}>
//           <Text className="text-white text-3xl font-semibold w-full text-center">
//             Print Receipt
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }
