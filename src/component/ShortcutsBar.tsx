import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import BaseIcon from './Icons/BaseIcon';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  $cameFromUndoRedo,
  $inputQuery,
  $inputSelection,
  $pressedUndoRedo,
  $queryEdits,
  $undoRedoPosition,
} from '~/store/input';
import {cutAllAndPasteToClipboard, pasteFromClipboard} from '~/utils/clipboard';
import {useStore} from '@nanostores/react';
import {$isKeyboardVisible} from '~/utils/keyboard-status';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
import {useNavigation} from '@react-navigation/native';
// import {format as formatSqlQuery} from 'sql-formatter';
export default function ShortcutsBar() {
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);
  const navigation = useNavigation();

  const undo = () => {
    const queryEdits = $queryEdits.get();
    $pressedUndoRedo.set(true);

    if (queryEdits.length + $undoRedoPosition.get() <= 0) {
      console.log('reached end');
      return;
    }

    $undoRedoPosition.set($undoRedoPosition.get() - 1);
    const query = queryEdits.at($undoRedoPosition.get());

    console.log('undoRedoPosition', $undoRedoPosition.get());
    if (!query) return;
    $inputQuery.set(query);
  };

  const redo = () => {
    const queryEdits = $queryEdits.get();
    $pressedUndoRedo.set(true);

    if ($undoRedoPosition.get() === -1) {
      console.log('reached start');
      return;
    }

    $undoRedoPosition.set($undoRedoPosition.get() + 1);
    const query = queryEdits.at($undoRedoPosition.get());

    console.log('undoRedoPosition', $undoRedoPosition.get());
    if (!query) return;
    $inputQuery.set(query);
  };

  const surroundWithChar = (left: string, right: string) => {
    const query = $inputQuery.get();
    const {start, end} = $inputSelection.get();
    const selection = query.slice(start, end);
    const before = query.slice(0, start) + left;
    const after = right + query.slice(end, query.length);
    const newText = before + selection + after;
    $inputQuery.set(newText);
  };

  const formatSQL = () => {
    // $inputQuery.set(query);
  };

  const isKeyboardVisible = useStore($isKeyboardVisible);
  if (!isKeyboardVisible) return null;

  return (
    <View style={styles.sideButtonContainer}>
      <TouchableOpacity
        disabled={!hasPro}
        style={styles.downArrow}
        accessibilityLabel="Add braces around the selected text"
        onPress={() => surroundWithChar('(', ')')}>
        <Text
          style={{
            fontSize: 18,
            color: '#fff',
            fontFamily: 'monospace',
            fontWeight: '800',
          }}>
          ()
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!hasPro}
        onPress={() => surroundWithChar('"', '"')}
        accessibilityLabel="Add quotes around the selected text">
        <Text style={{fontSize: 18, color: '#fff', fontWeight: '800'}}>
          “ ”
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!hasPro}
        onPress={undo}
        accessibilityLabel="Undo the last edit">
        <Icon name="arrow-undo-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={redo}
        disabled={!hasPro}
        accessibilityLabel="Redo the last operation">
        <Icon name="arrow-redo-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={cutAllAndPasteToClipboard}
        disabled={!hasPro}
        accessibilityLabel="Cut the entire command">
        <Icon name="cut-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={pasteFromClipboard}
        disabled={!hasPro}
        accessibilityLabel="Paste from clipboard">
        <Icon name="clipboard-outline" size={18} color="#fff" />
      </TouchableOpacity>

      {!hasPro ? (
        <TouchableOpacity
          onPress={() => navigation.navigate('Purchase')}
          style={{
            borderColor: '#fff',
            backgroundColor: 'rgba(255,255,255, 0.1)',
            borderWidth: 1,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
          accessibilityLabel="Add quotes around the selected text">
          <MIcon name="lock" size={13} color="#fff" />
          <Text
            style={{
              fontSize: 12,
              color: '#fff',
            }}>
            Unlock with Pro
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  downArrow: {
    // marginTop: -5,
  },
  deleteBtn: {
    // position: 'absolute',
    // bottom: 12,
    // right: 3,
  },
  sideButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 4,
    paddingLeft: 8,
    backgroundColor: '#292d32',
    // position: 'absolute',
    // gap: 3,
  },
});
