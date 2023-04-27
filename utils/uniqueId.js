import {customAlphabet} from 'nanoid/non-secure';

export default function uniqueID() {
  const nanoid = customAlphabet('1234567890', 6);

  const orderId = nanoid(); // e.g., '7938456901'
  return Number(orderId);
}
