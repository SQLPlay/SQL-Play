import {View, Text, TextInput, ScrollView} from 'react-native';
import React, {useState} from 'react';
import BaseTextInput from '~/component/Inputs/BaseTextInput';
import PrimaryButton from '~/component/Button/PrimaryButton';
import CheckBox from '@react-native-community/checkbox';
import colors from 'tailwindcss/colors';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import {RootStackParamList} from '~/types/nav';
import {useOpenTicketApi} from '~/api/support-api';
import {getDeviceInfo} from '~/utils/device-info';
import {parseTicketFormSchema} from '~/types/ticket-form-schema';
import {getLast20Commands} from '~/utils';
import {ValiError, flatten} from 'valibot';
import {showErrorNotif, showSuccessNotif} from '~/utils/notif';
import {capitalizeWord} from '~/utils/formatter';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTicket'>;

const SupportTicket = ({navigation}: Props) => {
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);
  const [isShareCommandsChecked, setIsShareCommandsChecked] = useState(true);
  const [inputVals, setInputVals] = useState({
    email: '',
    name: '',
    message: '',
  });

  const {mutate, isLoading} = useOpenTicketApi();

  const handleFormSubmit = async () => {
    try {
      const formVal = parseTicketFormSchema(inputVals);
      const deviceInfo = await getDeviceInfo();
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const reqData: Record<string, unknown> = {
        ...formVal,
        timeZone,
        deviceInfo,
        transactionId: await secureStore.getStringAsync('transactionId'),
        deviceToken: await messaging().getToken(),
      };

      if (isShareCommandsChecked) {
        reqData['commandHistory'] = await getLast20Commands();
      }

      const {message} = await mutate(reqData);
      showSuccessNotif('Support ticked opened!', 'You will get help ASAP');
      navigation.goBack();
    } catch (error) {
      if (error instanceof ValiError) {
        error.issues.forEach(issue => {
          issue.path?.forEach(({key, value}) => {
            let msg = issue.message;
            const captializedkey = capitalizeWord(key);
            if (value.trim() === '') {
              msg = `${captializedkey} is required`;
            }
            if (issue.validation === 'min_length') {
              msg = `${captializedkey} is too short.`;
            }
            if (issue.validation === 'max_length') {
              msg = `${captializedkey} is too long.`;
            }
            showErrorNotif(`Your ${key} has an error`, msg);
          });
        });
      }
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-2 bg-white"
        contentContainerStyle={{paddingBottom: 16}}>
        <BaseTextInput
          label="Your Email"
          autoComplete="email"
          testID="emailInput"
          placeholder="help@drowning.com"
          value={inputVals.email}
          onChangeText={txt => setInputVals({...inputVals, email: txt})}
        />
        <BaseTextInput
          label="Your Name"
          autoComplete="name"
          testID="name"
          placeholder="John Duck"
          value={inputVals.name}
          onChangeText={txt => setInputVals({...inputVals, name: txt})}
        />
        <BaseTextInput
          testID="message"
          label="Describe your problem"
          placeholder="My query is SELECT * from ducks. It is giving table doesn't exist error."
          numberOfLines={4}
          textAlignVertical="top"
          multiline={true}
          value={inputVals.message}
          onChangeText={txt => setInputVals({...inputVals, message: txt})}
        />
        <View className="flex-row items-center my-2">
          <CheckBox
            testID="checkbox"
            tintColors={{true: colors.blue[500]}}
            disabled={false}
            value={isShareCommandsChecked}
            onValueChange={isChecked => setIsShareCommandsChecked(isChecked)}
          />
          <Text className="text-sm font-medium leading-6 text-gray-800">
            Share last 20 commands{' '}
            <Text className="font-normal text-gray-600">
              to help you faster.
            </Text>
          </Text>
        </View>
        <PrimaryButton
          isLoading={isLoading}
          testID="submit"
          onPress={() =>
            hasPro ? handleFormSubmit() : navigation.navigate('Purchase')
          }
          title={hasPro ? 'Submit Ticket' : 'Get 24/7 Help with Pro'}
        />
      </ScrollView>
    </View>
  );
};

export default SupportTicket;
