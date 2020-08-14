import RnInAppReview from 'rn-in-app-review';
import {getAppData, setAppData} from './storage';
import {Alert, ToastAndroid} from 'react-native';

const timesOpenedId = 'noOfTimesOpened';
const userActionId = 'userActionOnReview';

const showReviewAlert = () => {
  Alert.alert(
    'Enjoying the App ?',
    'Give a review for SQL Playground',
    [
      {
        text: 'No Thanks',
        onPress: async () => await setAppData(userActionId, 'denied'),
        style: 'cancel',
      },
      {
        text: 'Rate 5 🌟',
        onPress: () => launchReview(),
      },
    ],
    {cancelable: true},
  );
};

const launchReview = () => {
  RnInAppReview.launchReviewFlow(async (isSuccessful) => {
    if (isSuccessful) {
      ToastAndroid.showWithGravity(
        'Thank You!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      await setAppData(userActionId, 'given');
    }
  });
};

const run = async () => {
  //if data exist then compare it
  const timesOpened = await getAppData(timesOpenedId);
  if (timesOpened) {
    await setAppData(timesOpenedId, +timesOpened + 1);
    console.log('times opened', +timesOpened + 1);
    if (timesOpened > 5) {
      const userAction = await getAppData(userActionId);
      // if user has already given or denied the review dont show popup
      if (!userAction) {
        showReviewAlert();
      }
    }
  } else {
    await setAppData(timesOpenedId, 5);
    console.log('not found data');
  }
};

setTimeout(run, 5000);
