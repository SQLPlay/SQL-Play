import {createStackNavigator} from '@react-navigation/stack';

import {RootStackParamList} from '~/types/nav';
import LessonsList from '~/screens/LessonsList';
import Lesson from '~/screens/Lesson';

const Stack = createStackNavigator<RootStackParamList>();

const LearnStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Learn">
      <Stack.Screen options={{}} name="Learn" component={LessonsList} />
      <Stack.Screen options={{}} name="Lesson" component={Lesson} />
    </Stack.Navigator>
  );
};

export default LearnStackNav;
