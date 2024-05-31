import {View, Text, useColorScheme} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const HomePageSkeleton = ({onMounted}: {onMounted: () => void}) => {
  const opacity = useSharedValue(1);
  const scheme = useColorScheme();

  const isDark = scheme === 'dark';
  const backgroundColor = isDark ? '#fefefe44' : '#d4d4d4';
  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.1, {duration: 865}), -1, true);
    setTimeout(onMounted, 30);
    return () => {
      opacity.value = 1;
    };
  }, []);

  return (
    <View
      style={{flex: 1, padding: 4, backgroundColor: isDark ? '#000' : '#fff'}}>
      <View style={{flexDirection: 'row'}}>
        <Animated.View
          style={{
            backgroundColor,
            borderRadius: 5,
            width: 33,
            height: 33,
            opacity,
          }}
        />
        <Animated.View
          style={{
            backgroundColor,
            borderRadius: 5,
            marginHorizontal: 'auto',
            marginBottom: 6,
            width: 200,
            height: 33.5,
            opacity,
          }}
        />

        <Animated.View
          style={{
            backgroundColor,
            borderRadius: 5,
            width: 33,
            height: 33,
            opacity,
          }}
        />
      </View>
      <Animated.View
        style={{
          backgroundColor,
          borderRadius: 5,
          width: '100%',
          height: 119,
          opacity,
        }}
      />
      <Animated.View
        style={{
          backgroundColor,
          borderRadius: 50,
          position: 'absolute',
          bottom: 10,
          right: 10,
          width: 44,
          height: 44,
          opacity,
        }}
      />
    </View>
  );
};

export default HomePageSkeleton;
