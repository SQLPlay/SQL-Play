import {atom} from 'nanostores';
import {Keyboard} from 'react-native';
export const $isKeyboardVisible = atom(false);

export const setupKeyboardListener = () => {
  Keyboard.addListener('keyboardDidShow', () => {
    $isKeyboardVisible.set(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    $isKeyboardVisible.set(false);
  });
};
