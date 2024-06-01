import {View, Text, Pressable} from 'react-native';
import React, {useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LessonItem} from '~/types/lesson-type';
import colors from 'tailwindcss/colors';
import {useTheme} from '@react-navigation/native';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
type Props = LessonItem & {
  onPress: () => void;
  isLocked: boolean;
  index: number;
};

const TopicCard = ({
  reading_time,
  index,
  title,
  description,
  isLocked,
  onPress,
}: Props) => {
  const {colors: themeColors, dark} = useTheme();

  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);

  const lockedColor = useCallback(
    () => (dark ? colors.gray['100'] : colors.gray['600']),
    [dark],
  );
  const unlockedColor = useCallback(
    () => (dark ? colors.green['100'] : colors.green['700']),
    [dark],
  );

  const chipColor = useCallback(
    () => (isLocked && !hasPro ? lockedColor() : unlockedColor()),
    [isLocked, dark, hasPro],
  );

  return (
    <Pressable testID={`topic_card_${index}`} onPress={onPress}>
      {({pressed}) => (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            transform: [
              {scale: pressed ? 0.99 : 1},
              {translateY: pressed ? 2 : 0},
            ],
            opacity: pressed ? 0.7 : 1,
            backgroundColor: themeColors.card,
          }}
          className="p-4 mb-4 rounded-xl">
          <Text
            style={{color: themeColors.text}}
            className="mb-1 text-lg font-semibold">
            {title}
          </Text>
          <Text style={{color: themeColors.text}} numberOfLines={3}>
            {description}
          </Text>
          <View className="flex-row justify-between mt-4">
            <View
              className="flex-row items-center px-2.5 py-0.5  rounded-2xl"
              style={{
                backgroundColor:
                  isLocked && !hasPro
                    ? 'rgba(127, 140, 141, 0.3)'
                    : 'rgba(39, 174, 96, 0.3)',
              }}>
              <Icon
                name={isLocked && !hasPro ? 'lock' : 'lock-open'}
                size={15}
                color={chipColor()}
              />
              <Text
                style={{color: chipColor()}}
                testID={`lock_label_${index}`}
                className="ml-1">
                {isLocked ? (hasPro ? 'Unlocked' : 'Pro unlocks this') : 'Free'}
              </Text>
            </View>
            <Text
              style={{color: themeColors.text}}
              className="text-sm text-right">
              {Math.ceil(reading_time)} min to learn
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default TopicCard;
