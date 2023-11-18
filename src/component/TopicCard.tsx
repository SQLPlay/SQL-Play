import {View, Text, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {LessonItem} from '~/types/lesson-type';
import colors from 'tailwindcss/colors';
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
          }}
          className="p-4 border-b-4 border-b-gray-300 shadow-black shadow-lg bg-white rounded-xl">
          <Text className="text-black mb-1 text-lg font-semibold">{title}</Text>
          <Text className="" numberOfLines={3}>
            {description}
          </Text>
          <View className="flex-row justify-between mt-2">
            <View
              className="flex-row items-center px-2.5 py-0.5  rounded-2xl"
              style={{
                backgroundColor: isLocked
                  ? colors.gray['100']
                  : colors.green['50'],
              }}>
              <Icon
                name={isLocked ? 'lock' : 'lock-open'}
                size={15}
                color={isLocked ? colors.gray['600'] : colors.green['700']}
              />
              <Text
                style={{
                  color: isLocked ? colors.gray['600'] : colors.green['700'],
                }}
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
