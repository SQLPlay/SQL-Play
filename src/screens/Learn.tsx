import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native-gesture-handler';
import TopicCard from '~/component/TopicCard';
import {useGetLessonsList} from '~/api/lessons-api';

const Learn = () => {
  const {data, isLoading} = useGetLessonsList();
  console.log('data', data);
  return (
    <View className="mt-4">
      {isLoading || !data ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={data}
          contentContainerStyle={{rowGap: 8, marginHorizontal: 16}}
          keyExtractor={item => item.path}
          renderItem={({item}) => (
            <TopicCard
              onPress={() => null}
              {...item}
              description={item.short_description}
            />
          )}
        />
      )}
    </View>
  );
};

export default Learn;
