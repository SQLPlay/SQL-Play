import React, {useState, FC, RefObject, memo} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  Pressable,
  Keyboard,
} from 'react-native';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  useDarkMode,
} from 'react-native-dynamic';

import Icon from 'react-native-vector-icons/MaterialIcons';
//@ts-ignore
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {
  vs2015,
  defaultStyle,
  //@ts-ignore
} from 'react-syntax-highlighter/dist/styles/hljs';

import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {ids} from '../../e2e/ids';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
interface LIProps extends CommandItem {
  index: number;
  setInputValue: (val: string) => void;
  bottomSheetRef: RefObject<BottomSheetModal>;
}
const ListItem: FC<LIProps> = props => {
  // console.log('props', props);

  const {title, description, syntax, index, setInputValue, bottomSheetRef} =
    props;

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const styles = useDynamicValue(dynamicStyles);

  const isDark = useDarkMode();

  const onItemPress = (index: number | null) => {
    setCurrentIndex(index === currentIndex ? null : index);
    Keyboard.dismiss();
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  };

  const onSyntaxPress = (syntax: string) => {
    setInputValue(syntax);
    bottomSheetRef.current?.close();
  };
  return (
    <Pressable testID={ids.commandListItem} onPress={() => onItemPress(index)}>
      <View style={styles.item}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Icon
            name="arrow-drop-down"
            color={'gray'}
            size={36}
            style={styles.dropDownIcon}
          />
        </View>

        <Text style={styles.description}>{description}</Text>
        {index === currentIndex && (
          <>
            {/* <Text style={styles.syntaxHeader}>Syntax</Text> */}
            {syntax.map((item, idx) => {
              return (
                <Pressable
                  key={idx}
                  style={styles.codeSyntaxContainer}
                  accessibilityLabel={item}
                  accessibilityHint="copy syntax to command input"
                  onPress={() => onSyntaxPress(item)}
                >
                  <SyntaxHighlighter
                    PreTag={View}
                    fontSize={14}
                    language="sql"
                    wrapLines={true}
                    style={isDark ? vs2015 : defaultStyle}
                    highlighter="hljs"
                  >
                    {syntax}
                  </SyntaxHighlighter>
                </Pressable>
              );
            })}
            {props?.example && (
              <Text style={styles.syntaxHeader}>Examples</Text>
            )}
            {props?.example &&
              props.example.map((eg, i) => (
                <Pressable
                  key={i}
                  accessibilityHint="copy example to the command input"
                  accessibilityLabel={eg}
                  style={styles.codeSyntaxContainer}
                  testID={ids.commandListExample}
                  onPress={() => onSyntaxPress(eg)}
                >
                  {/* <ScrollView */}
                  {/*   horizontal */}
                  {/*   directionalLockEnabled */}
                  {/*   automaticallyAdjustContentInsets={false} */}
                  {/*   disableScrollViewPanResponder */}
                  {/* > */}
                  <SyntaxHighlighter
                    fontSize={14}
                    language="sql"
                    wrapLines={true}
                    PreTag={View}
                    style={isDark ? vs2015 : defaultStyle}
                    highlighter="hljs"
                  >
                    {eg}
                  </SyntaxHighlighter>
                  {/* </ScrollView> */}
                </Pressable>
              ))}
          </>
        )}
      </View>
    </Pressable>
  );
};

const MemoizedLI = memo(ListItem);

interface CommandItem {
  id: string;
  title: string;
  description: string;
  syntax: string[];
  example?: string[];
}

interface Props {
  listData: CommandItem[];
  setInputValue: (val: string) => void;
  bottomSheetRef: RefObject<BottomSheetModal>;
}
const CommandList: FC<Props> = ({listData, setInputValue, bottomSheetRef}) => {
  return (
    <BottomSheetFlatList
      accessibilityHint="search examples and syntaxes"
      accessibilityLabel="Search Result"
      testID={ids.commandListSheet}
      data={listData}
      bounces={false}
      maxToRenderPerBatch={5}
      // scrollEventThrottle={30}
      contentContainerStyle={{paddingVertical: 5}}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      renderItem={({item, index}) => (
        <MemoizedLI
          {...item}
          index={index}
          setInputValue={setInputValue}
          bottomSheetRef={bottomSheetRef}
        />
      )}
      initialNumToRender={5}
      windowSize={30}
      keyExtractor={item => item.id}
    />
  );
};
export default CommandList;

const dynamicStyles = new DynamicStyleSheet({
  container: {
    padding: 5,
    height: '100%',
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
  },
  syntaxHeader: {
    marginTop: 5,
    color: new DynamicValue('black', '#ffffffe7'),
  },
  header: {
    position: 'relative',
  },
  dropDownIcon: {
    position: 'absolute',
    right: 5,
    top: -5,
  },
  title: {
    fontSize: 18,
    color: new DynamicValue('black', '#ffffffe7'),
  },
  description: {
    fontSize: 16,
    color: new DynamicValue('black', '#ffffffe7'),
  },

  codeSyntaxContainer: {
    marginTop: 5,
  },
});
