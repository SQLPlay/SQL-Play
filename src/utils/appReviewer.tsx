// @ts-ignore
import RnInAppReview from 'rn-in-app-review';
import {getAppData, setAppData} from './storage';
import {Alert} from 'react-native';
import Snackbar from 'react-native-snackbar';

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
  RnInAppReview.launchReviewFlow(async (isSuccessful: boolean) => {
    if (isSuccessful) {
      Snackbar.show({text: 'Thank You!'});
      await setAppData(userActionId, 'given');
    }
  });
};

const run = async () => {
  const getTimesOpened = (): Promise<number> =>
    getAppData(timesOpenedId).then(data => {
      if (typeof data === 'number') {
        return data;
      } else {
        return 0;
      }
    });
  //if data exist then compare it
  const timesOpened: number = (await getTimesOpened()) ?? 0;
  console.log(typeof timesOpened);

  await setAppData(timesOpenedId, timesOpened + 1);

  if (timesOpened > 5) {
    const userAction = await getAppData(userActionId);
    // if user has already given or denied the review dont show popup
    if (!userAction) {
      showReviewAlert();
    }
  }
};

setTimeout(run, 5000);
