import React, {Suspense, lazy, useEffect} from 'react';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {RootStackParamList} from './types/nav';

import {
  ActivityIndicator,
  Platform,
  InteractionManager,
  Text,
  View,
} from 'react-native';
import HomePageSkeleton from './component/Skeletons/HomePageSkeleton';
import {
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  purchaseUpdatedListener,
} from 'react-native-iap';
import TabBar from './component/TabBar';
import {secureStore} from './store/mmkv';
import {showSuccessNotif} from './utils/notif';
import Purchase from './screens/Purchase';

const RootStack = createNativeStackNavigator<RootStackParamList>();


const LazyCodeRunner = lazy(() => import('./screens/CodeRunner'));
const LazyLesson = lazy(() => import('./screens/Lesson'));
const LazyLessonList = lazy(() => import('./screens/LessonsList'));

const LazySupportTicketList = lazy(
  () => import('./screens/SupportTickets/SupportTicketsList'),
);
const LazySupportTicketDetails = lazy(
  () => import('./screens/SupportTickets/SupportTicketDetails'),
);
const LazySupportTicketNew = lazy(
  () => import('./screens/SupportTickets/NewSupportTicket'),
);

const LazyExportPage = lazy(() => import('./screens/Export'));

const CodeRunner = () => (
  <Suspense fallback={<HomePageSkeleton />}>
    <LazyCodeRunner />
  </Suspense>
);

const Lesson = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazyLesson {...props} />
  </Suspense>
);

const LessonsList = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazyLessonList {...props} />
  </Suspense>
);
const NewSupportTicket = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazySupportTicketNew {...props} />
  </Suspense>
);

const SupportTicketsList = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazySupportTicketList {...props} />
  </Suspense>
);

const SupportTicketDetails = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazySupportTicketDetails {...props} />
  </Suspense>
);

const ExportPage = (props: any) => (
  <Suspense fallback={<ActivityIndicator />}>
    <LazyExportPage {...props} />
  </Suspense>
);

InteractionManager.runAfterInteractions(async () => {
  try {
    import('./utils/storage').then(module => module.initDb());
    await initConnection();
    if (Platform.OS === 'android') {
      await flushFailedPurchasesCachedAsPendingAndroid();
    }
    purchaseUpdatedListener(async purchase => {
      // TODO: Call backend server to validate the transaction
      await finishTransaction({purchase, isConsumable: false});
      await secureStore.setBoolAsync('hasPro', true);
      showSuccessNotif(
        'Wow! Did you just get SQL pro?',
        'You made my day. Enjoy the pro features.',
      );
    });
  } catch (error) {
    console.log(error);
  }
});

const MainStack = () => {
  return (
    <RootStack.Navigator
      initialRouteName="CodeRunner"
      screenOptions={{headerShown: false}}>
      <RootStack.Screen
        options={
          {
            // animation: 'slide_from_right',
            // animationTypeForReplace: 'pop',
          }
        }
        name="CodeRunner"
        component={CodeRunner}
      />
      <RootStack.Screen name="Learn" component={LessonsList} />
    </RootStack.Navigator>
  );
};
export default function RootStackNav() {
  return (
    <RootStack.Navigator screenOptions={{}} initialRouteName="Main">
      <RootStack.Screen
        name="Main"
        options={{
          title: 'Home',
          header: TabBar,
        }}
        component={MainStack}
      />

      <RootStack.Screen
        name="Lesson"
        component={Lesson}
        options={({route}) => ({
          title: route.params.title,
          headerBackTitleVisible: false,
        })}
      />

      <RootStack.Screen name="Export" component={ExportPage} />
      <RootStack.Screen
        name="SupportTicketsList"
        options={{title: 'Your support tickets'}}
        component={SupportTicketsList}
      />

      <RootStack.Screen
        name="SupportTicketDetails"
        options={{title: 'Ticket Details', headerBackTitle: 'Tickets'}}
        component={SupportTicketDetails}
      />
      <RootStack.Screen
        name="NewSupportTicket"
        options={{title: 'Create support ticket', headerBackTitle: 'Tickets'}}
        component={NewSupportTicket}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
          gestureEnabled: true,
          presentation: 'transparentModal',
          animation: 'fade_from_bottom',
        }}
        name="Purchase"
        component={Purchase}
      />

    </RootStack.Navigator>
  );
}
