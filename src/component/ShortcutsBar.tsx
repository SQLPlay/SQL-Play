import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BaseIcon from './Icons/BaseIcon';
import Icon from '@react-native-vector-icons/ionicons';
import MIcon from '@react-native-vector-icons/material-icons';
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
import {useReanimatedKeyboardAnimation} from 'react-native-keyboard-controller';
import Animated, {
  SlideInDown,
  SlideOutDown,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {KeyboardEvents} from 'react-native-keyboard-controller';
// import {format as formatSqlQuery} from 'sql-formatter';
export default function ShortcutsBar() {
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);
  const navigation = useNavigation();

  const undo = () => {
    const queryEdits = $queryEdits.get();
    $pressedUndoRedo.set(true);

    // reached end
    if (queryEdits.length + $undoRedoPosition.get() <= 0) {
      return;
    }

    $undoRedoPosition.set($undoRedoPosition.get() - 1);
    const query = queryEdits.at($undoRedoPosition.get());

    if (!query) return;
    $inputQuery.set(query);
  };

  const redo = () => {
    const queryEdits = $queryEdits.get();
    $pressedUndoRedo.set(true);

    // reached start
    if ($undoRedoPosition.get() === -1) {
      return;
    }

    $undoRedoPosition.set($undoRedoPosition.get() + 1);
    const query = queryEdits.at($undoRedoPosition.get());

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

  const kbdHeight = useSharedValue(30);

  useEffect(() => {
    const show = KeyboardEvents.addListener('keyboardWillShow', e => {
      kbdHeight.value = withTiming(-e.height, {duration: e.duration});
    });

    const hide = KeyboardEvents.addListener('keyboardWillHide', e => {
      kbdHeight.value = withTiming(30, {duration: e.duration});
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Animated.View
      style={[styles.container, {transform: [{translateY: kbdHeight}]}]}>
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
            fontWeight: '600',
          }}>
          ()
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        disabled={!hasPro}
        onPress={() => surroundWithChar('"', '"')}
        accessibilityLabel="Add quotes around the selected text">
        <Text style={{fontSize: 18, color: '#fff', fontWeight: '600'}}>
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
        <Icon name="arrow-redo" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={cutAllAndPasteToClipboard}
        disabled={!hasPro}
        accessibilityLabel="Cut the entire command">
        <Icon name="cut" size={20} color="#fff" />
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
    </Animated.View>
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
  container: {
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
