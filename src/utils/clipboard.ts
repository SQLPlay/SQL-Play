import Clipboard from '@react-native-clipboard/clipboard';
import {$inputQuery, $inputSelection} from '~/store/input';

export const pasteFromClipboard = async () => {
  const txt = await Clipboard.getString();
  const query = $inputQuery.get();
  const position = $inputSelection.get().end;
  const before = query.slice(0, position);
  const after = query.slice(position, query.length);

  const newText = before + txt + after;
  $inputQuery.set(newText);
};

export const cutAllAndPasteToClipboard = () => {
  const query = $inputQuery.get();
  Clipboard.setString(query);
  $inputQuery.set('');
};
