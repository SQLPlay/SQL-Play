import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  TicketResponseMsg,
  useAddResponseInTicket,
  useGetTicketResponsesApi,
  useListTicketsApi,
} from '~/api/support-api';
import {Ticket} from '~/types/ticket';
import ExtendedFab from '~/component/Button/ExtendedFab';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';
import Icon from '@react-native-vector-icons/ionicons';
import BaseTextInput from '~/component/Inputs/BaseTextInput';
import messaging from '@react-native-firebase/messaging';
import colors from 'tailwindcss/colors';
import {showErrorNotif} from '~/utils/notif';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';

const TicketCard = ({responder, message}: TicketResponseMsg) => {
  const isMsgFromSupport = responder === 'support';
  return (
    <View
      style={{
        marginRight: isMsgFromSupport ? 50 : 0,
        marginLeft: !isMsgFromSupport ? 50 : 0,
      }}
      className="mb-4 bg-white dark:bg-gray-900 rounded-lg px-3 py-2.5 shadow">
      <Text selectable={true} className="text-gray-800 dark:text-gray-100 my-1">
        {message}
      </Text>
    </View>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTicketDetails'>;

const SupportTicketDetails = ({route, navigation}: Props) => {
  const {ticketId} = route.params;
  const {
    data: ticketRes,
    isLoading,
    error,
  } = useGetTicketResponsesApi(ticketId);

  const [messages, setMessages] = useState<TicketResponseMsg[]>([]);

  useEffect(() => {
    if (!ticketRes?.messages) return;
    setMessages(ticketRes.messages);
  }, [ticketRes]);

  const {isLoading: isSendingRespone, mutate: addResponse} =
    useAddResponseInTicket(ticketId);

  const [msg, setMsg] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const removeListener = messaging().onMessage(e => {
      if (
        e.data?.event_type !== 'new_ticket_response' ||
        e.data?.ticketId !== ticketId ||
        !e.notification?.body
      ) {
        return;
      }
      const msgBody = e.notification.body;
      // add new message to the array
      // @ts-ignore
      setMessages(prv => [...prv, {message: msgBody, responder: 'support'}]);
      // scroll to end for new messages
      scrollViewRef.current?.scrollToEnd();
    });

    return () => {
      removeListener();
    };
  }, []);

  const insets = useSafeAreaInsets();

  const sendMsg = async () => {
    try {
      if (msg.trim() === '') return;
      if (msg.trim().length < 10) {
        showErrorNotif('Your message is too short.', 'Please write some more.');
        return;
      }
      await addResponse(msg.trim());
      setMessages([...messages, {message: msg, responder: 'user'}]);
      scrollViewRef.current?.scrollToEnd();
      setMsg('');
    } catch (error) {
      //@ts-ignore
      showErrorNotif('Failed to post your message.', error?.message);
    }
  };
  const MessageInputBox = () => {
    return (
      <View
        className="flex-row bg-white dark:bg-gray-900 items-center gap-2 py-3 px-4"
        styles={{flex: 0.1}}>
        <TextInput
          className="flex-1  px-2"
          multiline
          placeholder="Your message in details"
          value={msg}
          onChangeText={txt => setMsg(txt)}
        />
        <TouchableOpacity
          className="py-3"
          disabled={isSendingRespone}
          onPress={sendMsg}>
          {isSendingRespone ? (
            <ActivityIndicator color={colors.blue['500']} />
          ) : (
            <Icon
              size={24}
              name="send"
              color={
                msg.trim().length >= 10
                  ? colors.blue['500']
                  : colors.gray['300']
              }
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1, marginBottom: insets.bottom}}
      keyboardVerticalOffset={100}
      behavior="padding">
      {isLoading ? <ActivityIndicator size="large" /> : null}
      <FlatList
        className="px-3 py-2"
        style={{flex: 0.9}}
        ref={scrollViewRef}
        data={messages}
        renderItem={item => <TicketCard {...item.item} />}
        keyExtractor={i => i.message}
      />
      <MessageInputBox />
    </KeyboardAvoidingView>
  );
};

export default SupportTicketDetails;
