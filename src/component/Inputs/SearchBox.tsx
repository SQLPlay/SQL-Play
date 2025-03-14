import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import Icon from '@react-native-vector-icons/material-icons';
import {useTheme} from '@react-navigation/native';
import {useStore} from '@nanostores/react';

import {$searchText, $searchedCommandsResult} from '~/store';
import commandsJson from '../../data/commands.json';
import ids from '../../../e2e/ids';
import filter from '~/utils/fil';
import colors from 'tailwindcss/colors';

type Props = {};

const SearchBox = ({}: Props) => {
  const {colors} = useTheme();
  const searchText = useStore($searchText);

  const filterData = (val: string) => {
    const filteredData = filter(item => {
      const query = val.toLowerCase();
      const keywords = `${item.title}  ${item.tag}  ${item.description}`;
      const index = keywords.toLowerCase().indexOf(query);

      return index !== -1;
    }, commandsJson);

    $searchedCommandsResult.set(filteredData);
  };

  return (
    <View style={{backgroundColor: '#fcfcfc', flex: 1, paddingBottom: 12}}>
      <View style={styles.inputContainer}>
        <Icon
          name="search"
          accessibilityLabel="clear command"
          accessibilityHint="clears searched command"
          size={24}
          color={colors.text}
          testID={ids.commandSearchClearBtn}
        />
        <TextInput
          style={styles.searchInput}
          blurOnSubmit={false}
          testID={ids.commandSearchInput}
          placeholderTextColor="gray"
          accessibilityLabel="command search"
          accessibilityHint="Search for SQL commands"
          value={searchText}
          onChangeText={(val: string) => {
            $searchText.set(val);
            filterData(val);
          }}
          placeholder="Search Query"
        />
        {searchText.length ? (
          <Icon
            name="close"
            accessibilityLabel="clear command"
            accessibilityHint="clears searched command"
            size={24}
            color={colors.text}
            testID={ids.commandSearchClearBtn}
            onPress={() => {
              $searchText.set('');
              $searchedCommandsResult.set(commandsJson);
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
    backgroundColor: colors.gray[100],
    borderRadius: 50,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    marginTop: 6,
  },
  searchInput: {
    height: 42,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 16,
    color: 'black',
    flex: 1,
    // textAlign: 'center',
  },
});
