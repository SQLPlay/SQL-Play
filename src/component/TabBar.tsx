import {getFocusedRouteNameFromRoute, useTheme} from '@react-navigation/native';

import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '@react-native-vector-icons/material-icons';
import ids from '../../e2e/ids';
import {searchSheetRef} from './SearchSheet';
import OptionsMenu from './OptionsMenu';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const TabBar = ({route, navigation, options}: NativeStackHeaderProps) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Main';
  const {colors, dark} = useTheme();
  const insets = useSafeAreaInsets();
  const isRouteOnSqlPlay = routeName === 'Main' || routeName === 'CodeRunner';
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <OptionsMenu />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.card,
          position: 'relative',
          alignItems: 'center',
          borderRadius: 8,
          padding: 4,
        }}>
        <Pressable
          accessibilityRole="button"
          disabled={isRouteOnSqlPlay}
          style={{
            borderRadius: 8,
            backgroundColor: isRouteOnSqlPlay
              ? dark
                ? '#fefefe33'
                : '#0c0c0c22'
              : 'transparent',
          }}
          onPress={() => {
            navigation.navigate('CodeRunner');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
              },
            ]}>
            SQL Play
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          disabled={!isRouteOnSqlPlay}
          style={{
            borderRadius: 8,
            backgroundColor: !isRouteOnSqlPlay
              ? dark
                ? '#fefefe33'
                : '#0c0c0c22'
              : 'transparent',
          }}
          onPress={() => {
            navigation.navigate('Learn');
          }}>
          <Text
            style={[
              styles.tabText,
              {
                color: colors.text,
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
        onPress={() => {
          if (Platform.OS === 'ios') {
            Keyboard.dismiss();
          }
          searchSheetRef.current?.present();
        }}>
        <Icon
          name="search"
          size={24}
          style={{padding: 12}}
          color={colors.text}
        />
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
    paddingVertical: 4,
    borderRadius: 12,
    width: 90,
  },
});
