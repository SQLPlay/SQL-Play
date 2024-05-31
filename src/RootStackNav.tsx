import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types/nav';

import Export from './screens/Export';
import NewSupportTicket from './screens/SupportTickets/NewSupportTicket';
import SupportTicketsList from './screens/SupportTickets/SupportTicketsList';
import SupportTicketDetails from './screens/SupportTickets/SupportTicketDetails';

import SupportedQuery from '~/screens/Lesson';
import Purchase from '~/screens/Purchase';
import TabNav from '~/screens/TabNav';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNav() {
  return (
    <RootStack.Navigator screenOptions={{}} initialRouteName="Main">
      <RootStack.Screen
        name="Main"
        options={{headerShown: false}}
        component={TabNav}
      />
      <RootStack.Screen
        options={{title: 'SQL Compatibility'}}
        name="SupportedQuery"
        component={SupportedQuery}
      />
      <RootStack.Screen name="Export" component={Export} />
      <RootStack.Screen
        name="SupportTicketsList"
        options={{title: 'Your support tickets'}}
        component={SupportTicketsList}
      />

      <RootStack.Screen
        name="SupportTicketDetails"
        options={{title: 'Ticket Details'}}
        component={SupportTicketDetails}
      />
      <RootStack.Screen
        name="NewSupportTicket"
        options={{title: 'Create support ticket'}}
        component={NewSupportTicket}
      />
      <RootStack.Group
        screenOptions={{
          presentation: 'transparentModal',
          headerShown: false,
          gestureEnabled: true,
        }}>
        <RootStack.Screen name="Purchase" component={Purchase} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}
