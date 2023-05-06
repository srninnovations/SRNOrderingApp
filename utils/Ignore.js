import {LogBox} from 'react-native';

export default function Ignore() {
  LogBox.ignoreLogs([
    'We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320',
    'new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  ]);
  return;
}
