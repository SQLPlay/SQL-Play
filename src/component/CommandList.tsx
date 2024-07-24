import React, {useState, FC, RefObject, memo, Ref, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  Pressable,
  Keyboard,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';

//@ts-ignore
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {
  vs2015,
  defaultStyle,
  //@ts-ignore
} from 'react-syntax-highlighter/dist/esm/highlight';

import {ids} from '../../e2e/ids';
import {$inputQuery} from '~/store/input';
import {searchSheetRef} from './SearchSheet';

import Icon from '@react-native-vector-icons/ionicons';
import colors from 'tailwindcss/colors';
import {useStore} from '@nanostores/react';
import {$searchedCommandsResult} from '~/store';
import SearchBox from '~/component/Inputs/SearchBox';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
interface LIProps extends CommandItem {
  index: number;
}
const ListItem: FC<LIProps> = props => {
  const {title, description, syntax, index} = props;

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const isDark = false;

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
    $inputQuery.set(syntax);
    searchSheetRef.current?.dismiss();
  };

  const isExpanded = index === currentIndex;

  return (
    <Pressable testID={ids.commandListItem} onPress={() => onItemPress(index)}>
      <View style={styles.item}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} />
        </View>
        {isExpanded ? (
          <View style={{marginTop: 8}}>
            {syntax.map((item, idx) => {
              return (
                <Pressable
                  key={idx}
                  style={styles.codeSyntaxContainer}
                  accessibilityLabel={item}
                  accessibilityHint="copy syntax to command input"
                  onPress={() => onSyntaxPress(item)}>
                  <SyntaxHighlighter
                    PreTag={View}
                    fontSize={14}
                    language="sql"
                    wrapLines={true}
                    style={isDark ? vs2015 : defaultStyle}
                    highlighter="hljs">
                    {syntax}
                  </SyntaxHighlighter>
                </Pressable>
              );
            })}
            {props?.example && (
              <Text style={styles.syntaxHeader}>Examples:</Text>
            )}
            {props?.example &&
              props.example.map((eg, i) => (
                <Pressable
                  key={i}
                  accessibilityHint="copy example to the command input"
                  accessibilityLabel={eg}
                  style={styles.codeSyntaxContainer}
                  testID={ids.commandListExample}
                  onPress={() => onSyntaxPress(eg)}>
                  <SyntaxHighlighter
                    fontSize={14}
                    language="sql"
                    wrapLines={true}
                    PreTag={View}
                    style={isDark ? vs2015 : defaultStyle}
                    highlighter="hljs">
                    {eg}
                  </SyntaxHighlighter>
                </Pressable>
              ))}
          </View>
        ) : null}
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
  flatListRef: Ref<any>;
}

const CommandList = ({flatListRef}: Props) => {
  const searchedCommandsResult = useStore($searchedCommandsResult);

  return (
    <FlatList
      ref={flatListRef}
      nestedScrollEnabled={true}
      accessibilityHint="search examples and syntaxes"
      accessibilityLabel="Search Result"
      testID={ids.commandListSheet}
      data={searchedCommandsResult}
      ListHeaderComponent={<SearchBox />}
      bounces={false}
      stickyHeaderIndices={[0]}
      // estimatedItemSize={40}
      // scrollEventThrottle={30}
      contentContainerStyle={{paddingVertical: 15}}
      style={{flex: 1}}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      renderItem={({item, index}) => <MemoizedLI {...item} index={index} />}
      keyExtractor={item => item.id}
    />
  );
};
export default CommandList;

const styles = StyleSheet.create({
  container: {
    // padding: 5,
    flex: 1,
    // height: '100%',
  },
  item: {
    // flex: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray['200'],
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    // marginBottom: 8,
  },
  syntaxHeader: {
    marginTop: 8,
    color: 'black',
  },
  header: {
    flex: 1,
    gap: 4,
  },
  dropDownIcon: {
    position: 'absolute',
    right: 5,
    top: -5,
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  description: {
    fontSize: 16,
    color: 'black',
  },

  codeSyntaxContainer: {
    marginTop: 5,
  },
});
