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
import Icon from '@react-native-vector-icons/ionicons';
import ids from '../../e2e/ids';
import {searchSheetRef} from './SearchSheet';
import OptionsMenu from './OptionsMenu';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useState} from 'react';
import SearchBox from './Inputs/SearchBox';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import {useStore} from '@nanostores/react';
import {$isSearchOpen} from '~/store';

const TabBar = ({route, navigation, options}: NativeStackHeaderProps) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Main';
  const {colors, dark} = useTheme();
  const insets = useSafeAreaInsets();
  const isRouteOnSqlPlay = routeName === 'Main' || routeName === 'CodeRunner';
  const isSearchOpen = useStore($isSearchOpen);
  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: colors.background,
        paddingHorizontal: 16,
        paddingBottom: 8,
      }}>
      {isSearchOpen ? (
        <SearchBox />
      ) : (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut.duration(200)}
          style={{
            height: 56,
            gap: 16,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
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
              $isSearchOpen.set(true);
              searchSheetRef.current?.present();
            }}>
            <Icon name="search-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>
      )}
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
    paddingVertical: 8,
    borderRadius: 12,
    width: 90,
  },
});
