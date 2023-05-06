import EscPosPrinter, {
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';

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
        orders,
        totals,
        orderDetails,
      );
    }

    // print kitchen receipt
    printing = await printKitchenReceipt(printing, orders, orderDetails);

    printing.send();
    console.log('Success:', status);
  } catch (e) {
    console.log('Catch Error:', e);
  }
};

export const printNewKitckenReceipt = async (orders, orderDetails) => {
  try {
    await EscPosPrinter.init({
      target: 'TCP:192.168.1.125',
      seriesName: getPrinterSeriesByName('TM-m30'),
      // language: 'EPOS2_LANG_EN',
    });

    const printing = new EscPosPrinter.printing();
    const status = await printing.initialize();

    // Print order items
    printing.align('left');
    printing.size(2, 2);
    orders.forEach(o => {
      if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
        printing.line(o.quantity + ' ' + o.name).newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

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
        printing.line(o.quantity + ' ' + o.name).newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Sunday Menu items
    orders.forEach((o, index) => {
      if (o.category === 'SUNDAY MENU') {
        printing.line(o.quantity + ' ' + o.name).newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Vegetable Side Dishes items
    orders.forEach(o => {
      if (o.category == 'VEGETABLE SIDE DISHES') {
        printing.line(o.quantity + ' ' + o.name).newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Sundries items
    orders.forEach(o => {
      if (o.category == 'SUNDRIES') {
        printing.line(o.quantity + ' ' + o.name).newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

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
  console.log('HERE');
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
      .line('CHILLI N SPICE')
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
      .line('-------------------------------------')
      .newline()
      .align('center')
      .size(1, 1);
    // Print order items
    orders.forEach(o => {
      if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

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
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Sunday Menu items
    orders.forEach((o, index) => {
      if (o.category === 'SUNDAY MENU') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Vegetable Side Dishes items
    orders.forEach(o => {
      if (o.category == 'VEGETABLE SIDE DISHES') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Sundries items
    orders.forEach(o => {
      if (o.category == 'SUNDRIES') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Desserts items
    orders.forEach(o => {
      if (o.category == 'DESSERTS') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    // Print Beverages items
    orders.forEach(o => {
      if (o.category == 'BEVERAGES') {
        printing
          .textLine(32, {
            left: o.quantity + ' x ' + o.name,
            right: '£' + o.price.toFixed(2),
          })
          .newline();
        if (o.notes && o.notes.length > 0) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
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
        right: '£' + totals.drinks.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Desserts',
        right: '£' + totals.desserts.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Hot drinks',
        right: '£' + totals.hotDrinks.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Subtotal',
        right: '£' + totals.subTotal.toFixed(2),
      })
      .newline()
      .textLine(20, {
        left: 'Discount',
        right: '£' + totals.discount.toFixed(2),
      })
      .newline()
      .newline()
      .textLine(20, {
        left: 'Total',
        right: '£' + totals.total.toFixed(2),
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
  // Print order items
  printing.align('left');
  printing.size(2, 2);
  orders.forEach(o => {
    if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
      printing.line(o.quantity + ' ' + o.name).newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

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
      printing.line(o.quantity + ' ' + o.name).newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Sunday Menu items
  orders.forEach((o, index) => {
    if (o.category === 'SUNDAY MENU') {
      printing.line(o.quantity + ' ' + o.name).newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Vegetable Side Dishes items
  orders.forEach(o => {
    if (o.category == 'VEGETABLE SIDE DISHES') {
      printing.line(o.quantity + ' ' + o.name).newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Sundries items
  orders.forEach(o => {
    if (o.category == 'SUNDRIES') {
      printing.line(o.quantity + ' ' + o.name).newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

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
    .line('CHILLI N SPICE')
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
    .line('-------------------------------------')
    .newline()
    .align('center')
    .size(1, 1);
  // Print order items
  orders.forEach(o => {
    if (o.category == 'STARTERS' || o.category == 'SIGNATURE STARTERS') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

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
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Sunday Menu items
  orders.forEach((o, index) => {
    if (o.category === 'SUNDAY MENU') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Vegetable Side Dishes items
  orders.forEach(o => {
    if (o.category == 'VEGETABLE SIDE DISHES') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Sundries items
  orders.forEach(o => {
    if (o.category == 'SUNDRIES') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Desserts items
  orders.forEach(o => {
    if (o.category == 'DESSERTS') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
    }
  });

  // Print Beverages items
  orders.forEach(o => {
    if (o.category == 'BEVERAGES') {
      printing
        .textLine(32, {
          left: o.quantity + ' x ' + o.name,
          right: '£' + o.price.toFixed(2),
        })
        .newline();
      if (o.notes && o.notes.length > 0) {
        printing.textLine(32, {left: '- ' + o.notes}).newline();
      }
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
      right: '£' + totals.drinks.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Desserts',
      right: '£' + totals.desserts.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Hot drinks',
      right: '£' + totals.hotDrinks.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Subtotal',
      right: '£' + totals.subTotal.toFixed(2),
    })
    .newline()
    .textLine(20, {
      left: 'Discount',
      right: '£' + totals.discount.toFixed(2),
    })
    .newline()
    .newline()
    .textLine(20, {
      left: 'Total',
      right: '£' + totals.total.toFixed(2),
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
