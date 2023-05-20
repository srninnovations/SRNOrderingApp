import EscPosPrinter, {
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';
import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';

export const getPrinter = async () => {
  try {
    const printers = await EscPosPrinter.discover();
    const printer = printers[0];

    if (printer) {
      return {status: 'Connected', printer: printer};
    } else {
      return {status: 'Not connected', printer: null};
    }
  } catch (error) {
    return {status: 'Not connected', error: error};
  }
};

export const printReceiptsOnPlaceOrder = async (
  orders,
  totals,
  orderDetails,
) => {
  const sortReadyArr = orders.map(item => {
    const key = item.name;

    switch (true) {
      case /Pappadom/.test(key):
        item.sortOrder = 1;
        break;
      case /Chutneys/.test(key):
        item.sortOrder = 2;
        break;
      case /Rice/.test(key):
        item.sortOrder = 1;
        break;
      case /Nan/.test(key):
        item.sortOrder = 2;
        break;

      default:
        item.sortOrder = orders.length + 3;
    }
    return item;
  });
  const sortedOrders = sortReadyArr.sort((a, b) => a.sortOrder - b.sortOrder);
  try {
    await EscPosPrinter.init({
      target: 'TCP:192.168.1.125',
      seriesName: getPrinterSeriesByName('TM-m30'),
      // language: 'EPOS2_LANG_EN',
    });

    let printing = new EscPosPrinter.printing();
    const status = await printing.initialize();

    // print customer receipt - only if delivery/collection order
    if (
      orderDetails.orderType == 'Delivery' ||
      orderDetails.orderType == 'Collection'
    ) {
      printing = await printCustomerReceipt(
        printing,
        sortedOrders,
        totals,
        orderDetails,
      );
    }

    // print kitchen receipt
    printing = await printKitchenReceipt(printing, sortedOrders, orderDetails);

    printing.send();
    console.log('Success:', status);
  } catch (e) {
    console.log('Catch Error:', e);
  }
};

export const printNewKitckenReceipt = async (orders, orderDetails) => {
  const sortReadyArr = orders.map(item => {
    const key = item.name;

    switch (true) {
      case /Pappadom/.test(key):
        item.sortOrder = 1;
        break;
      case /Chutneys/.test(key):
        item.sortOrder = 2;
        break;
      case /Rice/.test(key):
        item.sortOrder = 1;
        break;
      case /Nan/.test(key):
        item.sortOrder = 2;
        break;

      default:
        item.sortOrder = orders.length + 3;
    }
    return item;
  });
  const sortedOrders = sortReadyArr.sort((a, b) => a.sortOrder - b.sortOrder);
  try {
    await EscPosPrinter.init({
      target: 'TCP:192.168.1.125',
      seriesName: getPrinterSeriesByName('TM-m30'),
      // language: 'EPOS2_LANG_EN',
    });

    const printing = new EscPosPrinter.printing();
    const status = await printing.initialize();

    printing.newline();
    printing.newline();
    printing.newline();
    printing.newline();

    // Print starter items
    printing.align('left');
    printing.size(2, 2);
    sortedOrders.forEach(o => {
      if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
        printing.line(o.quantity + ' ' + o.name);
        if (o.notes) {
          printing.line('- ' + o.notes).newline();
        } else {
          printing.newline();
        }
      }
    });

    printing.line('------------------------');
    printing.newline();

    sortedOrders.forEach(o => {
      if (
        o.category != 'STARTERS' &&
        o.category != 'SIGNATURE STARTERS' &&
        o.category != 'VEGETABLE SIDE DISHES' &&
        o.category != 'SUNDAY MENU' &&
        o.category != 'SUNDRIES' &&
        o.category != 'DESSERTS' &&
        o.category != 'BEVERAGES' &&
        o.category != 'ALCOHOL'
      ) {
        printing.line(o.quantity + ' ' + o.name);
        if (o.notes) {
          printing.line('- ' + o.notes).newline();
        } else {
          printing.newline();
        }
      }
    });

    // Print Sunday Menu items
    sortedOrders.forEach((o, index) => {
      if (o.category === 'SUNDAY MENU') {
        printing.line(o.quantity + ' ' + o.name);
        if (o.notes) {
          printing.line('- ' + o.notes).newline();
        } else {
          printing.newline();
        }
      }
    });

    // Print Vegetable Side Dishes items
    sortedOrders.forEach(o => {
      if (o.category == 'VEGETABLE SIDE DISHES') {
        printing.line(o.quantity + ' ' + o.name);
        if (o.notes) {
          printing.line('- ' + o.notes).newline();
        } else {
          printing.newline();
        }
      }
    });

    // Print Sundries items
    sortedOrders.forEach(o => {
      if (o.category == 'SUNDRIES') {
        printing.line(o.quantity + ' ' + o.name);
        if (o.notes) {
          printing.line('- ' + o.notes).newline();
        } else {
          printing.newline();
        }
      }
    });

    if (orderDetails.orderNotes) {
      printing.text('Notes: ' + orderDetails.orderNotes);
      printing.newline();
      printing.newline();
    }

    if (orderDetails.orderType == 'Delivery') {
      printing.newline().newline();
      printing.align('center');
      printing.size(2, 2);
      printing.line('DELIVERY');
      printing.newline().newline();
      printing.size(1, 1);
      printing.line(orderDetails.customerDetails.address1);
      printing.line(orderDetails.customerDetails.address2);
      printing.line(orderDetails.customerDetails.postcode);
      printing.line(orderDetails.customerDetails.contact);
      printing.line(orderDetails.customerDetails.deliveryNotes);
      printing.newline().newline();
      printing.cut();
    } else if (orderDetails.orderType == 'Collection') {
      printing.newline().newline();
      printing.align('center');
      printing.size(2, 2);
      printing.line('COLLECTION');
      printing.newline();
      printing.line(orderDetails.customerDetails.name);
      printing.newline();
      printing.size(1, 1);
      printing.line(orderDetails.customerDetails.contact);
      printing.newline().newline();
      printing.cut();
    } else if (orderDetails.orderType == 'Dine In') {
      printing.newline().newline();
      printing.align('center');
      printing.size(2, 2);
      printing.line('TABLE');
      printing.newline();
      printing.line(orderDetails.customerDetails.name.toString());
      printing.newline().newline();
      printing.cut();
    } else {
      printing.newline().newline();
      printing.cut();
    }

    printing.send();
    console.log('Success:', status);
  } catch (e) {
    console.log('Catch Error:', e);
  }
};

export const printNewCustomerReceipt = async (orders, totals, orderDetails) => {
  try {
    await EscPosPrinter.init({
      target: 'TCP:192.168.1.125',
      seriesName: getPrinterSeriesByName('TM-m30'),
      // language: 'EPOS2_LANG_EN',
    });

    const printing = new EscPosPrinter.printing();
    const status = await printing.initialize();

    printing
      .align('center')
      .size(3, 3)
      .line("CHILLI 'N' SPICE")
      .smooth(true)
      .newline()
      .size(1, 1)
      .text('35 Main St, Swannington')
      .newline()
      .text('Leicestershire LE67 8QJ')
      .newline()
      .text('Tel: 01530 83 22 11')
      .newline()
      .text('www.chillinspicerestaurant.co.uk')
      .newline()
      .newline()
      .textLine(32, {
        left: 'Order: ' + orderDetails.orderId.toString(),
        right: convertMillisToDate(orderDetails.orderDate).toString(),
      })
      .newline()
      .newline()
      .line('-------------------------------------')
      .newline()
      .align('center')
      .size(1, 1);
    // Print starter items
    orders.forEach(o => {
      if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    // Print main items
    orders.forEach(o => {
      if (
        o.category != 'STARTERS' &&
        o.category != 'SIGNATURE STARTERS' &&
        o.category != 'VEGETABLE SIDE DISHES' &&
        o.category != 'SUNDAY MENU' &&
        o.category != 'SUNDRIES' &&
        o.category != 'DESSERTS' &&
        o.category != 'BEVERAGES' &&
        o.category != 'ALCOHOL'
      ) {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    // Print Sunday Menu items
    orders.forEach((o, index) => {
      if (o.category === 'SUNDAY MENU') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '', //show no price no sunday menu items
          })
          .newline();
      }
    });

    // Print Vegetable Side Dishes items
    orders.forEach(o => {
      if (o.category == 'VEGETABLE SIDE DISHES') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    // Print Sundries items
    orders.forEach(o => {
      if (o.category == 'SUNDRIES') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    // Print Desserts items
    orders.forEach(o => {
      if (o.category == 'DESSERTS') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    // Print Beverages items
    orders.forEach(o => {
      if (o.category == 'BEVERAGES') {
        printing
          .textLine(32, {
            left: o.quantity + ' ' + o.name.substring(0, 23),
            right: '\u00A3' + (o.price * o.quantity).toFixed(2),
          })
          .newline();
      }
    });

    printing
      .newline()
      .line('-------------------------------------')
      .newline()
      .size(1, 1)
      .textLine(20, {
        left: 'Drinks',
        right: '\u00A3' + totals.drinks.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Desserts',
        right: '\u00A3' + totals.desserts.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Hot drinks',
        right: '\u00A3' + totals.hotDrinks.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Subtotal',
        right: '\u00A3' + totals.subTotal.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Discount',
        right: '\u00A3' + totals.discount.toFixed(2),
      })
      .newline()
      .newline()
      .textLine(20, {
        left: 'Total',
        right: '\u00A3' + totals.total.toFixed(2),
      });

    // customer details
    if (orderDetails.orderType == 'Delivery') {
      printing.newline();
      printing.newline();
      printing.newline();
      printing.align('center');
      printing.size(1, 1);
      printing.line('DELIVERY');
      printing.line(orderDetails.customerDetails.address1);
      printing.line(orderDetails.customerDetails.address2);
      printing.line(orderDetails.customerDetails.postcode);
      printing.line(orderDetails.customerDetails.contact);
      printing.line(orderDetails.customerDetails.deliveryNotes);
    }

    if (orderDetails.orderType == 'Collection') {
      printing.newline();
      printing.newline();
      printing.newline();
      printing.align('center');
      printing.size(1, 1);
      printing.line('COLLECTION');
      printing.line(orderDetails.customerDetails.name);
      printing.line(orderDetails.customerDetails.contact);
    }

    if (orderDetails.orderType == 'Dine In') {
      printing.newline();
      printing.newline();
      printing.newline();
      printing.align('center');
      printing.size(1, 1);
      printing.line('TABLE');
      printing.line(orderDetails.customerDetails.name.toString());
    }

    printing.newline().newline().cut();

    printing.send();
    console.log('Success:', status);
  } catch (e) {
    console.log('Catch Error:', e);
  }
};

const printKitchenReceipt = async (printing, orders, orderDetails) => {
  const sortReadyArr = orders.map(item => {
    const key = item.name;

    switch (true) {
      case /Pappadom/.test(key):
        item.sortOrder = 1;
        break;
      case /Chutneys/.test(key):
        item.sortOrder = 2;
        break;
      case /Rice/.test(key):
        item.sortOrder = 1;
        break;
      case /Nan/.test(key):
        item.sortOrder = 2;
        break;

      default:
        item.sortOrder = orders.length + 3;
    }
    return item;
  });
  const sortedOrders = sortReadyArr.sort((a, b) => a.sortOrder - b.sortOrder);
  // Print order items
  printing.newline();
  printing.newline();
  printing.newline();
  printing.newline();
  printing.align('left');
  printing.size(2, 2);

  // Print starter items
  sortedOrders.forEach(o => {
    if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
      printing.line(o.quantity + ' ' + o.name);
      if (o.notes) {
        printing.line('- ' + o.notes).newline();
      } else {
        printing.newline();
      }
    }
  });

  printing.line('------------------------');
  printing.newline();

  // Print main items
  sortedOrders.forEach(o => {
    if (
      o.category != 'STARTERS' &&
      o.category != 'SIGNATURE STARTERS' &&
      o.category != 'VEGETABLE SIDE DISHES' &&
      o.category != 'SUNDAY MENU' &&
      o.category != 'SUNDRIES' &&
      o.category != 'DESSERTS' &&
      o.category != 'BEVERAGES' &&
      o.category != 'ALCOHOL'
    ) {
      printing.line(o.quantity + ' ' + o.name);
      if (o.notes) {
        printing.line('- ' + o.notes).newline();
      } else {
        printing.newline();
      }
    }
  });

  // Print Sunday Menu items
  sortedOrders.forEach((o, index) => {
    if (o.category === 'SUNDAY MENU') {
      printing.line(o.quantity + ' ' + o.name);
      if (o.notes) {
        printing.line('- ' + o.notes).newline();
      } else {
        printing.newline();
      }
    }
  });

  // Print Vegetable Side Dishes items
  sortedOrders.forEach(o => {
    if (o.category == 'VEGETABLE SIDE DISHES') {
      printing.line(o.quantity + ' ' + o.name);
      if (o.notes) {
        printing.line('- ' + o.notes).newline();
      } else {
        printing.newline();
      }
    }
  });

  // Print Sundries items
  sortedOrders.forEach(o => {
    if (o.category == 'SUNDRIES') {
      printing.line(o.quantity + ' ' + o.name);
      if (o.notes) {
        printing.line('- ' + o.notes).newline();
      } else {
        printing.newline();
      }
    }
  });

  if (orderDetails.orderNotes) {
    printing.text('Notes: ' + orderDetails.orderNotes);
    printing.newline();
    printing.newline();
  }

  if (orderDetails.orderType == 'Delivery') {
    printing.newline().newline();
    printing.align('center');
    printing.size(2, 2);
    printing.line('DELIVERY');
    printing.newline().newline();
    printing.size(1, 1);
    printing.line(orderDetails.customerDetails.address1);
    printing.line(orderDetails.customerDetails.address2);
    printing.line(orderDetails.customerDetails.postcode);
    printing.line(orderDetails.customerDetails.contact);
    printing.line(orderDetails.customerDetails.deliveryNotes);
    printing.newline().newline();
    printing.cut();
  } else if (orderDetails.orderType == 'Collection') {
    printing.newline().newline();
    printing.align('center');
    printing.size(2, 2);
    printing.line('COLLECTION');
    printing.newline();
    printing.line(orderDetails.customerDetails.name);
    printing.newline();
    printing.size(1, 1);
    printing.line(orderDetails.customerDetails.contact);
    printing.newline().newline();
    printing.cut();
  } else if (orderDetails.orderType == 'Dine In') {
    printing.newline().newline();
    printing.align('center');
    printing.size(2, 2);
    printing.line('TABLE');
    printing.newline();
    printing.line(orderDetails.customerDetails.name.toString());
    printing.newline().newline();
    printing.cut();
  } else {
    printing.newline().newline();
    printing.cut();
  }

  return printing;
};

const printCustomerReceipt = async (printing, orders, totals, orderDetails) => {
  printing
    .align('center')
    .size(3, 3)
    .line("CHILLI 'N' SPICE")
    .smooth(true)
    .newline()
    .size(1, 1)
    .text('35 Main St, Swannington')
    .newline()
    .text('Leicestershire LE67 8QJ')
    .newline()
    .text('Tel: 01530 83 22 11')
    .newline()
    .text('www.chillinspicerestaurant.co.uk')
    .newline()
    .newline()
    .textLine(32, {
      left: 'Order: ' + orderDetails.orderId.toString(),
      right: convertMillisToDate(orderDetails.orderDate).toString(),
    })
    .newline()
    .newline()
    .line('-------------------------------------')
    .newline()
    .align('center')
    .size(1, 1);

  // Print starter items
  orders.forEach(o => {
    if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  // Print main items
  orders.forEach(o => {
    if (
      o.category != 'STARTERS' &&
      o.category != 'SIGNATURE STARTERS' &&
      o.category != 'VEGETABLE SIDE DISHES' &&
      o.category != 'SUNDAY MENU' &&
      o.category != 'SUNDRIES' &&
      o.category != 'DESSERTS' &&
      o.category != 'BEVERAGES' &&
      o.category != 'ALCOHOL'
    ) {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  // Print Sunday Menu items
  orders.forEach((o, index) => {
    if (o.category === 'SUNDAY MENU') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '', //show no price for sunday menu items
        })
        .newline();
    }
  });

  // Print Vegetable Side Dishes items
  orders.forEach(o => {
    if (o.category == 'VEGETABLE SIDE DISHES') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  // Print Sundries items
  orders.forEach(o => {
    if (o.category == 'SUNDRIES') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  // Print Desserts items
  orders.forEach(o => {
    if (o.category == 'DESSERTS') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  // Print Beverages items
  orders.forEach(o => {
    if (o.category == 'BEVERAGES') {
      printing
        .textLine(32, {
          left: o.quantity + ' ' + o.name.substring(0, 23),
          right: '\u00A3' + (o.price * o.quantity).toFixed(2),
        })
        .newline();
    }
  });

  printing
    .newline()
    .newline()
    .line('-------------------------------------')
    .newline()
    .size(1, 1)
    .textLine(20, {
      left: 'Drinks',
      right: '\u00A3' + totals.drinks.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Desserts',
      right: '\u00A3' + totals.desserts.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Hot drinks',
      right: '\u00A3' + totals.hotDrinks.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Subtotal',
      right: '\u00A3' + totals.subTotal.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Discount',
      right: '\u00A3' + totals.discount.toFixed(2),
    })
    .newline()
    .newline()
    .textLine(20, {
      left: 'Total',
      right: '\u00A3' + totals.total.toFixed(2),
    });

  // customer details
  if (orderDetails.orderType == 'Delivery') {
    printing.newline();
    printing.newline();
    printing.newline();
    printing.align('center');
    printing.size(1, 1);
    printing.line('DELIVERY');
    printing.line(orderDetails.customerDetails.address1);
    printing.line(orderDetails.customerDetails.address2);
    printing.line(orderDetails.customerDetails.postcode);
    printing.line(orderDetails.customerDetails.contact);
    printing.line(orderDetails.customerDetails.deliveryNotes);
  }

  if (orderDetails.orderType == 'Collection') {
    printing.newline();
    printing.newline();
    printing.newline();
    printing.align('center');
    printing.size(1, 1);
    printing.line('COLLECTION');
    printing.line(orderDetails.customerDetails.name);
    printing.line(orderDetails.customerDetails.contact);
  }

  if (orderDetails.orderType == 'Dine In') {
    printing.newline();
    printing.newline();
    printing.newline();
    printing.align('center');
    printing.size(1, 1);
    printing.line('TABLE');
    printing.line(orderDetails.customerDetails.name);
  }

  printing.newline().newline().cut();

  return printing;
};

// retry printing if something fails - implement later
const printReceipt = async retryCount => {
  try {
    // Put the entire printing process here
  } catch (e) {
    console.log('Catch Error:', e);
    if (retryCount < 3) {
      console.log(`Retrying... Attempt: ${retryCount + 1}`);
      // setTimeout(() => printReceipt(retryCount + 1), 3000);
    } else {
      console.log('Max retry attempts reached. Giving up.');
    }
  }
};

const convertMillisToDate = millis => {
  const date = new Date(millis);
  const deviceTimeZone = RNLocalize.getTimeZone();
  //if top return doesn't work then try the bottom one
  return moment(date).tz(deviceTimeZone).format('DD/MM/YYYY HH:mm');
};
