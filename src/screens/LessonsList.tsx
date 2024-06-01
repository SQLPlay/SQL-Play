import {View, Text, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import TopicCard from '~/component/TopicCard';
import {useGetLessonsList} from '~/api/lessons-api';
import {RootStackParamList} from '~/types/nav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
import {FlashList} from '@shopify/flash-list';
import {LessonItem} from '~/types/lesson-type';

type Props = NativeStackScreenProps<RootStackParamList, 'Learn'>;

type RenderItemProp = {
  item: LessonItem;
  index: number;
};

let hasLessonPageLoaded = false;

const LessonsList = ({navigation}: Props) => {
  const {data, isLoading} = useGetLessonsList();
  const {colors} = useTheme();
  const [hasPro, setHasPro] = useMMKVStorage('hasPro', secureStore, false);

  const onCardPress = useCallback(
    (item: LessonItem, isLocked: boolean) => {
      if (isLocked && !hasPro) {
        navigation.navigate('Purchase');
        return;
      }
      navigation.navigate('Lesson', item);
    },
    [hasPro],
  );

  const renderListItem = useCallback(({item, index}: RenderItemProp) => {
    const isLocked = index > 4;
    return (
      <TopicCard
        {...item}
        index={index}
        isLocked={isLocked}
        onPress={() => onCardPress(item, isLocked)}
        description={item.short_description}
      />
    );
  }, []);

  useEffect(() => {
    if (hasLessonPageLoaded) return;
    setTimeout(() => {
      import('./Lesson').then(() => {
        hasLessonPageLoaded = true;
      });
    }, 300);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      {isLoading || !data ? (
        <ActivityIndicator size="large" color={colors.text} />
      ) : (
        <FlashList
          data={data}
          contentContainerStyle={{
            paddingVertical: 4,
            paddingHorizontal: 8,
          }}
          testID="scroll-container"
          estimatedItemSize={129}
          renderItem={renderListItem}
        />
      )}
    </SafeAreaView>
  );
};

export default LessonsList;
