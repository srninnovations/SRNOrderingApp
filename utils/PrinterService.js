import EscPosPrinter, {
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';

export const getPrinter = async () => {
  try {
    const printers = await EscPosPrinter.discover();
    const printer = printers[0];
    console.log('printer', printers);
    if (printer) {
      return {status: 'Connected', printer: printer};
    } else {
      return {status: 'Not connected', printer: null};
    }
  } catch (error) {
    console.log('Error', error);
    return {status: 'Not connected', error: error};
  }
};

export const printReceipt = async orders => {
  try {
    await EscPosPrinter.init({
      target: 'TCP:192.168.1.125',
      seriesName: getPrinterSeriesByName('TM-m30'),
      // language: 'EPOS2_LANG_EN',
    });

    const printing = new EscPosPrinter.printing();
    const status = await printing
      .initialize()
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
        if (o.notes) {
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
        if (o.notes) {
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
        if (o.notes) {
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
        if (o.notes) {
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
        if (o.notes) {
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
        if (o.notes) {
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
        if (o.notes) {
          printing.textLine(32, {left: '- ' + o.notes}).newline();
        }
      }
    });

    //   .size(1, 2)
    //   .align('center')
    //   .text('Drinks £7.00')
    printing.newline().newline().newline().newline().cut().send();
    console.log('Success:', status);
  } catch (e) {
    console.log('Catch Error:', e);
  }
};
