import React, {useState, useCallback, FC, RefObject, memo} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
  Pressable,
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
//@ts-ignore
import {vs2015, defaultStyle} from 'react-syntax-highlighter/styles/hljs';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
interface LIProps {
  title: string;
  description: string;
  syntax: string;
  index: number;
  id: string;
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
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  };

  const onSyntaxPress = () => {
    setInputValue(syntax);
    bottomSheetRef.current?.close();
  };
  return (
    <Pressable onPress={() => onItemPress(index)}>
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
        <TouchableHighlight
          style={styles.codeSyntaxContainer}
          onPress={() => onSyntaxPress(syntax)}
        >
          <View>
            {index === currentIndex && (
              <SyntaxHighlighter
                fontSize={14}
                language="sql"
                wrapLines={true}
                style={isDark ? vs2015 : defaultStyle}
                highlighter="hljs"
              >
                {syntax}
              </SyntaxHighlighter>
            )}
          </View>
        </TouchableHighlight>
      </View>
    </Pressable>
  );
};

const MemoizedLI = memo(ListItem);

interface Props {
  listData: {
    id: string;
    title: string;
    description: string;
    syntax: string;
    index?: number;
  }[];
  setInputValue: (val: string) => void;
  bottomSheetRef: RefObject<BottomSheetModal>;
}
const CommandList: FC<Props> = ({listData, setInputValue, bottomSheetRef}) => {
  return (
    <BottomSheetFlatList
      testID="commandList"
      data={listData}
      bounces={false}
      maxToRenderPerBatch={5}
      // scrollEventThrottle={30}
      contentContainerStyle={{paddingVertical: 5}}
      keyboardShouldPersistTaps="handled"
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
    marginTop: 10,
  },
});
