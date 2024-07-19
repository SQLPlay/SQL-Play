import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {useListTicketsApi} from '~/api/support-api';
import {Ticket} from '~/types/ticket';
import ExtendedFab from '~/component/Button/ExtendedFab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';
import Icon from '@react-native-vector-icons/material-icons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';

const TicketCard = ({ticketId, createdAt, message}: Ticket) => {
  // Truncate the message to show only two lines

  const date = new Date(createdAt).toDateString();

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('SupportTicketDetails', {ticketId})}>
      <View className="border-b border-gray-300 px-6 py-4 flex-row justify-between items-center">
        <View className="flex-1 pr-4">
          <Text
            className="text-black dark:text-gray-50 text-lg"
            ellipsizeMode="tail"
            numberOfLines={1}>
            {message}
          </Text>
          <Text className="text-sm text-black dark:text-gray-100">{date}</Text>
        </View>
        <Icon name="chevron-right" color={isDark ? '#fff' : '#000'} size={24} />
      </View>
    </TouchableOpacity>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTicketsList'>;

const SupportTicketsList = ({route, navigation}: Props) => {
  const {
    data: tickets,
    isLoading,
    error,
    fetch: fetchTickets,
  } = useListTicketsApi();

  useEffect(() => {
    fetchTickets();
  }, []);

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchTickets();
  //   }, []),
  // );

  return (
    <View className="flex-1 py-2 relative bg-gray-50 dark:bg-gray-900">
      {!isLoading && tickets?.length === 0 ? (
        <View className="rounded border-2 border-dashed border-gray-300 bg-gray-50  px-4 py-12 items-center mt-4">
          <Icon name="task" size={34} />
          <Text className="text-black font-bold mt-4 mb-2">No tickets yet</Text>
          <Text className="text-center">
            We miss out on things in <Text className="font-bold">BETWEEN</Text>{' '}
            ... {'\n'}
            and wonder <Text className="font-bold">WHERE</Text> we are wrong!
            {'\n\n'}
            <Text className="font-bold">CREATE</Text> a ticket by hitting the
            button below 👇
          </Text>
        </View>
      ) : null}

      {isLoading && !tickets?.length ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlashList
          contentContainerStyle={{paddingBottom: 70}}
          data={tickets}
          estimatedItemSize={71.6}
          renderItem={({item}) => <TicketCard {...item} />}
        />
      )}
      <ExtendedFab
        onPress={() => navigation.navigate('NewSupportTicket')}
        label="Create Support Request"
        icon="add"
      />
    </View>
  );
};

export default SupportTicketsList;
