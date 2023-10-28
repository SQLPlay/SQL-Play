import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import TopicCard from '~/component/TopicCard';
import {useGetLessonsList} from '~/api/lessons-api';
import {RootStackParamList} from '~/types/nav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {showErrorNotif} from '~/utils/notif';

type Props = NativeStackScreenProps<RootStackParamList, 'Learn'>;
const Learn = ({navigation}: Props) => {
  const {data, isLoading} = useGetLessonsList();
  return (
    <View className="mt-4">
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
                    ? showErrorNotif('Get SQL Play Pro')
                    : navigation.navigate('Lesson', item)
                }
                description={item.short_description}
              />
            );
          }}
        />
      )}
    </View>
  );
};

export default Learn;
