import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from '~/types/nav';
import LessonsList from '~/screens/LessonsList';
import Lesson from '~/screens/Lesson';
import TabBar from '~/component/TabBar';
import OptionMenu from '~/component/RightHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CodeRunner from './CodeRunner';
import {preload, register} from 'react-native-bundle-splitter';
import {Text} from 'react-native';
import {useEffect} from 'react';

const Stack = createStackNavigator<RootStackParamList>();

const Tab = createMaterialTopTabNavigator();

const LazyLesson = register({
  loader: () => import('./Lesson'),
  placeholder: () => <Text>Wait up bro</Text>,
  group: 'lesson',
});

const LazyLessonsList = register({
  loader: () => import('./LessonsList'),
  placeholder: () => <Text>Lessons are on the way</Text>,
  group: 'lesson',
});

const LearnStackNav = () => {
  useEffect(() => {
    preload().group('lesson');
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Learn">
      <Stack.Screen options={{}} name="Learn" component={LazyLessonsList} />
      <Stack.Screen options={{}} name="Lesson" component={LazyLesson} />
    </Stack.Navigator>
  );
};

const TabNav = () => (
  <Tab.Navigator
    tabBar={props => <TabBar {...props} />}
    screenOptions={{lazy: true, swipeEnabled: false}}>
    <Tab.Screen name="SQL Play" component={CodeRunner} />
    <Tab.Screen
      options={{title: 'Learn'}}
      name="Learn Stack"
      component={LearnStackNav}
    />
  </Tab.Navigator>
);

export default TabNav;
