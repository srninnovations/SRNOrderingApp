export default function OrderListSorter(item, orderListLength) {
  let sortOrder = 0;
  const key = item.name;

  switch (true) {
    case /Pappadom/.test(key):
      sortOrder = 1;
      break;
    case /Chutneys/.test(key):
      sortOrder = 2;
      break;
    case item.category !== 'SUNDAY MENU' && /Rice/.test(key):
      sortOrder = 1;
      break;
    case item.category !== 'SUNDAY MENU' && /Nan/.test(key):
      sortOrder = 2;
      break;
    case item.category === 'SUNDAY MENU' && /Starter/.test(key):
      sortOrder = 2;
      break;
    case item.category === 'SUNDAY MENU' && /Main/.test(key):
      sortOrder = 3;
      break;
    case item.category === 'SUNDAY MENU' && /Rice/.test(key):
      sortOrder = 4;
      break;
    case item.category === 'SUNDAY MENU' && /Nan/.test(key):
      sortOrder = 5;
      break;
    default:
      sortOrder = orderListLength + 3;
  }
  return {
    name: item.name,
    price: item.price,
    quantity: item.quantity ? item.quantity : 1,
    notes: item.notes ? item.notes : '',
    category: item.category,
    sortOrder: sortOrder,
  };
}
