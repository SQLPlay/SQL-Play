import {getFocusedRouteNameFromRoute, useTheme} from '@react-navigation/native';

import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ids from '../../e2e/ids';
import {searchSheetRef} from './SearchSheet';
import OptionsMenu from './OptionsMenu';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

const TabBar = ({route, navigation, options}: NativeStackHeaderProps) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Main';
  const {colors, dark} = useTheme();
  const isRouteOnSqlPlay = routeName === 'Main' || routeName === 'CodeRunner';
  return (
    <View
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 18,
        backgroundColor: colors.background,
      }}>
      <OptionsMenu />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.card,
          paddingVertical: 2,
          paddingHorizontal: 2,
          borderRadius: 8,
          // gap: 16,
          position: 'relative',
          alignItems: 'center',
        }}>
        <Pressable
          accessibilityRole="button"
          disabled={isRouteOnSqlPlay}
          onPress={() => {
            navigation.navigate('CodeRunner');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
                backgroundColor: isRouteOnSqlPlay
                  ? dark
                    ? '#fefefe33'
                    : '#0c0c0c22'
                  : 'transparent',
              },
            ]}>
            SQL Play
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!isRouteOnSqlPlay}
          onPress={() => {
            navigation.navigate('Learn');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
                backgroundColor: !isRouteOnSqlPlay
                  ? dark
                    ? '#fefefe33'
                    : '#0c0c0c22'
                  : 'transparent',
              },
            ]}>
            Learn
          </Text>
        </Pressable>
      </View>
      <TouchableOpacity
        accessibilityLabel="Search"
        accessibilityHint="Search for commands"
        testID={ids.searchBtn}
        onPress={() => searchSheetRef.current?.present()}>
        <Icon name="search" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  tabText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    width: 90,
  },
});
