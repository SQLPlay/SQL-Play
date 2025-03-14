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

type Props = NativeStackScreenProps<RootStackParamList, 'NewSupportTicket'> & {
  fetchTickets?: () => void;
};

const SupportTicket = ({navigation}: Props) => {
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);
  const [isShareCommandsChecked, setIsShareCommandsChecked] = useState(true);
  const [inputVals, setInputVals] = useState({
    email: '',
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

      const {message, ticketId} = await mutate(reqData);

      showSuccessNotif('Support ticked opened!', 'Your help is on the way.');
      navigation.replace('SupportTicketDetails', {ticketId});
      // fetchTickets();
    } catch (error) {
      if (error instanceof ValiError) {
        error.issues.forEach(issue => {
          issue.path?.forEach(({key, value}) => {
            const fieldName = key as string;
            const fieldValue = value as string | undefined | null;
            let msg = issue.message;

            const captializedkey = capitalizeWord(fieldName);

            if (fieldValue?.trim() === '') {
              msg = `${captializedkey} is required`;
            }
            if (issue.context === 'min_length') {
              msg = `${captializedkey} is too short.`;
            }
            if (issue.context === 'max_length') {
              msg = `${captializedkey} is too long.`;
            }
            showErrorNotif(`Your ${key} field has an error`, msg);
          });
        });
      }

      if (error instanceof Error) {
        showErrorNotif(error.message);
      }
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1 px-2"
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
          testID="message"
          label="Describe your problem"
          placeholder="My query is SELECT * from ducks. It is giving table doesn't exist error."
          numberOfLines={4}
          textAlignVertical="top"
          multiline={true}
          value={inputVals.message}
          onChangeText={txt => setInputVals({...inputVals, message: txt})}
        />
        <View className="flex-row items-center my-4 gap-3">
          <CheckBox
            boxType="circle"
            // hideBox={true}
            testID="checkbox"
            tintColors={{true: colors.blue['500']}}
            onFillColor={colors.blue['100']}
            lineWidth={2}
            disabled={false}
            onAnimationType="fill"
            offAnimationType="fill"
            // animationDuration={300}
            value={isShareCommandsChecked}
            onValueChange={isChecked => setIsShareCommandsChecked(isChecked)}
          />
          <Text className="text-base font-medium leading-6 text-gray-800 dark:text-gray-200">
            Share last 20 commands{' '}
            <Text className="font-normal text-gray-600 dark:text-gray-200">
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
          title={hasPro ? 'Submit Request' : 'Get 24/7 Help with Pro'}
        />
      </ScrollView>
    </View>
  );
};

export default SupportTicket;
