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
    <Pressable className="bottom-4 w-full px-4 absolute" {...pressableProps}>
      {({pressed}) => (
        <View
          style={{
            transform: [
              {scale: pressed ? 0.99 : 1},
              {translateY: pressed ? 2 : 0},
            ],
            opacity: pressed ? 0.7 : 1,
          }}
          className="p-4 shadow shadow-black rounded-2xl bg-[#007AFF] flex-row justify-center items-center">
          <MIcon name="add" size={24} color={colors.white} />
          <Text className="ml-2 font-semibold text-white">{label}</Text>
        </View>
      )}
    </Pressable>
  );
};

export default ExtendedFab;
