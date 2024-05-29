import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs';
import {useTheme} from '@react-navigation/native';
import {Animated, View, TouchableOpacity, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ids from '../../e2e/ids';
import {searchSheetRef} from './SearchSheet';
import OptionsMenu from './OptionsMenu';

const TabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) => {
  const {colors} = useTheme();
  const inputRange = state.routes.map((_, i) => i);
  const translateX = position.interpolate({
    inputRange,
    outputRange: [0, 101],
  });
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
          paddingVertical: 6,
          borderRadius: 8,
          position: 'relative',
          alignItems: 'center',
        }}>
        <Animated.View
          style={{
            position: 'absolute',
            borderRadius: 8,
            marginHorizontal: 3.5,
            height: 26,
            width: 92,
            transform: [{translateX}],
            backgroundColor: colors.background,
          }}
        />
        {state.routes.map((route, index) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              key={label.toString()}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                maxWidth: 100,
              }}>
              <Animated.Text
                style={{
                  color: colors.text,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                {label.toString()}
              </Animated.Text>
            </Pressable>
          );
        })}
      </View>
      <TouchableOpacity
        accessibilityLabel="Search"
        accessibilityHint="Search for commands"
        testID={ids.searchBtn}
        onPress={() => searchSheetRef.current?.present()}>
        <Icon name="search" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default TabBar;
