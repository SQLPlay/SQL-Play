import {View, Text, ActivityIndicator, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TicketResponseMsg, useGetTicketResponsesApi} from '~/api/support-api';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';
import messaging from '@react-native-firebase/messaging';
import {showErrorNotif} from '~/utils/notif';
import SupportMessageInput from '~/component/Inputs/SpportMessageInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAvoidingView} from 'react-native-keyboard-controller';
import {$isKeyboardVisible} from '~/utils/keyboard-status';

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
  const [messages, setMessages] = useState<TicketResponseMsg[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const {ticketId} = route.params;

  const {
    data: ticketRes,
    isLoading,
    error,
  } = useGetTicketResponsesApi(ticketId);

  useEffect(() => {
    if (!error) return;
    showErrorNotif(error);
  }, [error]);

  useEffect(() => {
    if (!ticketRes?.messages) return;
    setMessages(ticketRes.messages);
  }, [ticketRes]);

  useEffect(() => {
    if (!messages) return;
    // scroll to end for new messages
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });

      console.log('scrolled to the end');
    }, 100);
  }, [messages]);

  $isKeyboardVisible.subscribe(isOpen => {
    if (isOpen) {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }
  });

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
    });

    return () => {
      removeListener();
    };
  }, []);

  const insets = useSafeAreaInsets();

  console.log(insets);
  return (
    <KeyboardAvoidingView
      style={{flex: 1, marginBottom: insets.bottom}}
      keyboardVerticalOffset={40 + insets.top}
      behavior="padding">
      {isLoading ? <ActivityIndicator size="large" /> : null}
      <FlatList
        className="px-3 py-2"
        style={{flex: 0.9}}
        ref={flatListRef}
        data={messages}
        renderItem={item => <TicketCard {...item.item} />}
        keyExtractor={i => i.message}
      />
      <SupportMessageInput ticketId={ticketId} setMessages={setMessages} />
    </KeyboardAvoidingView>
  );
};

export default SupportTicketDetails;
