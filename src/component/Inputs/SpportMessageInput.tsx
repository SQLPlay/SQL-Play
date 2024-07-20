import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Dispatch, Ref, RefObject, SetStateAction, useState} from 'react';
import {TicketResponseMsg, useAddResponseInTicket} from '~/api/support-api';
import {showErrorNotif} from '~/utils/notif';
import Icon from '@react-native-vector-icons/ionicons';
import colors from 'tailwindcss/colors';

type Props = {
  ticketId: string;
  setMessages: Dispatch<SetStateAction<TicketResponseMsg[]>>;
};

const SpportMessageInput = ({ticketId, setMessages}: Props) => {
  const {isLoading: isSendingRespone, mutate: addResponse} =
    useAddResponseInTicket(ticketId);

  const [msg, setMsg] = useState('');
  const sendMsg = async () => {
    try {
      if (msg.trim() === '') return;
      if (msg.trim().length < 10) {
        showErrorNotif('Your message is too short.', 'Please write some more.');
        return;
      }
      await addResponse(msg.trim());
      setMessages(msgs => [...msgs, {message: msg, responder: 'user'}]);
      setMsg('');
    } catch (error) {
      //@ts-ignore
      showErrorNotif('Failed to post your message.', error?.message);
    }
  };
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
              msg.trim().length >= 10 ? colors.blue['500'] : colors.gray['300']
            }
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SpportMessageInput;

const styles = StyleSheet.create({});
