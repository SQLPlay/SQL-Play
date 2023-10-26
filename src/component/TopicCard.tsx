import {View, Text, Pressable} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  description: string;
  reading_time: string;
  onPress: () => void;
};

const TopicCard = ({reading_time, title, description, onPress}: Props) => {
  return (
    <Pressable onPress={onPress}>
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
          <Text className="text-xs mt-1.5 text-right">
            {Math.ceil(reading_time)} min to learn
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export default TopicCard;
