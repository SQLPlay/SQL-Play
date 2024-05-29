import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import TopicCard from '~/component/TopicCard';
import {useGetLessonsList} from '~/api/lessons-api';
import {RootStackParamList} from '~/types/nav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {showErrorNotif} from '~/utils/notif';
import {SafeAreaView} from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Learn'>;
const LessonsList = ({navigation}: Props) => {
  const {data, isLoading} = useGetLessonsList();
  return (
    <SafeAreaView className="mt-4">
      {isLoading || !data ? (
        <ActivityIndicator size="large" color="#000" />
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
                onPress={() =>
                  isLocked
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
