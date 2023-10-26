import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import BaseIcon from './Icons/BaseIcon';
import Icon from 'react-native-vector-icons/Ionicons';
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
import {format as formatSqlQuery} from 'sql-formatter';
export default function ShortcutsBar() {
  const onUpArrowPress = async (): Promise<void> => {
    /** show premium alert when user is not premium */
    /**
    if (!isPremium) {
      showPremiumAlert();
      return;
    }
    const lastCommand = await getLastUserCommand(historyOffset.current + 1);
    // console.log(historyOffset.current + 1, lastCommand);

    // only set if command is there
    if (lastCommand) {
      setInputValue(lastCommand);
      historyOffset.current++;
    }
    **/
  };
  const onDownArrowPress = async (): Promise<void> => {
    /** show premium alert when user is not premium */
    /**
    if (!isPremium) {
      showPremiumAlert();
      return;
    }

    if (historyOffset.current === 0) {
      return;
    } // do nothing if offset it 0

    const lastCommand = await getLastUserCommand(historyOffset.current - 1);
    // console.log(historyOffset.current - 1, lastCommand);
    // only set if command is there
    if (lastCommand) {
      setInputValue(lastCommand);
      historyOffset.current--;
    }
    **/
  };

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
      {/**
      <TouchableOpacity
        accessibilityLabel="Up Button"
        accessibilityHint="gets the previous command from history"
        onPress={onUpArrowPress}>
        <Icon name="chevron-up" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.downArrow}
        accessibilityLabel="Down Button"
        accessibilityHint="gets the next command from history"
        onPress={onDownArrowPress}>
        <Icon name="chevron-down" size={28} color="#fff" />
      </TouchableOpacity>
      **/}
      <TouchableOpacity
        style={styles.downArrow}
        accessibilityLabel="Down Button"
        accessibilityHint="gets the next command from history"
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
        onPress={() => surroundWithChar('"', '"')}
        accessibilityLabel="Clear command button"
        accessibilityHint="clear the command input">
        <Text style={{fontSize: 18, color: '#fff', fontWeight: '800'}}>
          “ ”
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={undo}
        accessibilityLabel="Clear command button"
        accessibilityHint="clear the command input">
        <Icon name="arrow-undo-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={redo}
        accessibilityLabel="Clear command button"
        accessibilityHint="clear the command input">
        <Icon name="arrow-redo-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={cutAllAndPasteToClipboard}
        accessibilityLabel="Clear command button"
        accessibilityHint="clear the command input">
        <Icon name="cut-outline" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={pasteFromClipboard}
        accessibilityLabel="Clear command button"
        accessibilityHint="clear the command input">
        <Icon name="clipboard-outline" size={18} color="#fff" />
      </TouchableOpacity>
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
