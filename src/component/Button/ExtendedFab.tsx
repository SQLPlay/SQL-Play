import {View, Text, Pressable, PressableProps} from 'react-native';
import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import colors from 'tailwindcss/colors';
type Props = PressableProps & {
  label: string;
  icon: string;
};

const ExtendedFab = ({label, icon, ...pressableProps}: Props) => {
  return (
    <Pressable className="bottom-4 w-full relative" {...pressableProps}>
      {({pressed}) => (
        <View
          style={{
            transform: [
              {scale: pressed ? 0.99 : 1},
              {translateY: pressed ? 2 : 0},
            ],
            opacity: pressed ? 0.7 : 1,
          }}
          className="p-4 shadow shadow-black rounded-2xl bg-blue-200 flex-row justify-center items-center">
          <MIcon name="add" size={24} color={colors.blue[950]} />
          <Text className="ml-2 font-semibold text-blue-950">{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default ExtendedFab;
