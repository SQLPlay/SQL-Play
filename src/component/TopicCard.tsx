import {View, Text, Pressable} from 'react-native';
import React, {useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LessonItem} from '~/types/lesson-type';
import colors from 'tailwindcss/colors';
import {useTheme} from '@react-navigation/native';
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

  const lockedColor = useCallback(
    () => (dark ? colors.gray['200'] : colors.gray['600']),
    [dark],
  );
  const unlockedColor = useCallback(
    () => (dark ? colors.green['200'] : colors.green['700']),
    [dark],
  );
  const chipColor = useCallback(
    () => (isLocked ? lockedColor() : unlockedColor()),
    [isLocked],
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
          className="p-4 border-b-4  rounded-xl">
          <Text
            style={{color: themeColors.text}}
            className="mb-1 text-lg font-semibold">
            {title}
          </Text>
          <Text className="" numberOfLines={3}>
            {description}
          </Text>
          <View className="flex-row justify-between mt-2">
            <View
              className="flex-row items-center px-2.5 py-0.5  rounded-2xl"
              style={{
                backgroundColor: isLocked
                  ? 'rgba(127, 140, 141, 0.3)'
                  : 'rgba(39, 174, 96, 0.3)',
              }}>
              <Icon
                name={isLocked ? 'lock' : 'lock-open'}
                size={15}
                color={chipColor()}
              />
              <Text
                style={{color: chipColor()}}
                testID={`lock_label_${index}`}
                className="ml-1">
                {isLocked ? 'Pro unlocks this' : 'Free'}
              </Text>
            </View>
            <Text className="text-xs text-right">
              {Math.ceil(reading_time)} min to learn
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default TopicCard;
