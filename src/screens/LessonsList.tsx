import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import TopicCard from '~/component/TopicCard';
import {useGetLessonsList} from '~/api/lessons-api';
import {RootStackParamList} from '~/types/nav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';

type Props = NativeStackScreenProps<RootStackParamList, 'Learn'>;
const LessonsList = ({navigation}: Props) => {
  const {data, isLoading} = useGetLessonsList();
  const {colors} = useTheme();
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);

  return (
    <SafeAreaView className="mt-4">
      {isLoading || !data ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <FlatList
          data={data}
          contentContainerStyle={{
            rowGap: 8,
            marginHorizontal: 16,
            paddingBottom: 12,
          }}
          testID="scroll-container"
          keyExtractor={item => item.path}
          renderItem={({item, index}) => {
            const isLocked = index > 4;
            return (
              <TopicCard
                {...item}
                index={index}
                isLocked={isLocked}
                hasPro={hasPro}
                onPress={() =>
                  isLocked && !hasPro
                    ? navigation.navigate('Purchase')
                    : navigation.navigate('Lesson', item)
                }
                description={item.short_description}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default LessonsList;
