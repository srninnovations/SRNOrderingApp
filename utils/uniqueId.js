// import {randomBytes} from 'react-native-crypto';

// export default function uniqueID() {
//   return generateId();
// }

// function generateId() {
//   const timestamp = new Date().getTime();
//   const uuidComponent = uuidv1().split('-')[0];
//   const id = `${timestamp}${uuidComponent}`;
//   const numericId = parseInt(id).toString().substr(-6);
//   return parseInt(numericId);
// }

// function uuidv1() {
//   const chars = '0123456789abcdef'.split('');
//   const rnds = randomBytes(16); // generates 16 random bytes using React Native's crypto API

//   let uuid = [],
//     rnd = 0;
//   for (let i = 0; i < 36; i++) {
//     if (i === 8 || i === 13 || i === 18 || i === 23) {
//       uuid[i] = '-';
//     } else if (i === 14) {
//       uuid[i] = '4';
//     } else {
//       if (rnd <= 0x02) {
//         rnd = rnds.pop() | 0x80; // pop one byte from the rnds array and set the most significant bit to 1
//       }
//       uuid[i] = chars[rnd & 0x0f];
//       rnd >>= 4;
//     }
//   }
//   return uuid.join('');
// }
