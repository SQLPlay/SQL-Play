import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import {useListTicketsApi} from '~/api/support-api';
import {Ticket} from '~/types/ticket';
import ExtendedFab from '~/component/Button/ExtendedFab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';

const TicketCard = ({ticketId, message}: Ticket) => {
  // Truncate the message to show only two lines

  return (
    <Pressable>
      <View className="mb-4 bg-white rounded-lg px-3 py-2.5 shadow">
        <Text
          className="text-gray-800 text-lg font-semibold"
          ellipsizeMode="tail"
          numberOfLines={1}>
          {message}
        </Text>
        <Text
          className="text-gray-800 my-1"
          // ellipsizeMode="head"
          numberOfLines={3}>
          {message}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-sm text-gray-600 ">Ticket #{ticketId}</Text>
          <Text className="text-sm text-right text-gray-400">12th March</Text>
        </View>
      </View>
    </Pressable>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTicket'>;

const SupportTicketsList = ({route, navigation}: Props) => {
  const {data: tickets, isLoading, error} = useListTicketsApi();

  return (
    <View className="flex-1 px-3 py-2">
      <ScrollView className="">
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          tickets?.map(ticket => (
            <TicketCard key={ticket.ticketId} {...ticket} />
          ))
        )}
      </ScrollView>
      <ExtendedFab
        onPress={() => navigation.navigate('SupportTicket')}
        label="New ticket"
        icon="add"
      />
    </View>
  );
};

export default SupportTicketsList;
