import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  FC,
  RefObject,
} from 'react';
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
import RBSheet from 'react-native-raw-bottom-sheet';

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
  refRBSheet: RefObject<RBSheet>;
}
const ListItem: FC<LIProps> = (props) => {
  // console.log('props', props);

  const {title, description, syntax, index, setInputValue, refRBSheet} = props;

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

  const onSyntaxPress = (syntax: string) => {
    setInputValue(syntax);
    if (refRBSheet.current !== null) {
      refRBSheet.current.close();
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => onItemPress(index)}>
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
          onPress={() => onSyntaxPress(syntax)}>
          <View>
            {index === currentIndex && (
              <SyntaxHighlighter
                fontSize={14}
                language="sql"
                wrapLines={true}
                style={isDark ? vs2015 : defaultStyle}
                highlighter="hljs">
                {syntax}
              </SyntaxHighlighter>
            )}
          </View>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
};

interface Props {
  listData: {
    id: string;
    title: string;
    description: string;
    syntax: string;
    index?: number;
  }[];
  setInputValue: (val: string) => void;
  refRBSheet: RefObject<RBSheet>;
}
const CommandList: FC<Props> = ({listData, setInputValue, refRBSheet}) => {
  interface renderItemProp {}
  return (
    <FlatList
      data={listData}
      bounces={false}
      maxToRenderPerBatch={3}
      renderItem={({item, index}) => (
        <ListItem
          {...item}
          index={index}
          setInputValue={setInputValue}
          refRBSheet={refRBSheet}
        />
      )}
      initialNumToRender={2}
      windowSize={5}
      keyExtractor={(item) => item.id}
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
