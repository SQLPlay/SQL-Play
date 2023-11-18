import React from 'react';
import {StyleSheet, Platform, Pressable} from 'react-native';
import {MenuView} from '@react-native-menu/menu';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {createXlsx} from '~/utils/xlsx';
import {getAllTablesName} from '~/utils/db';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const OptionsMenu = () => {
  const navigation = useNavigation();
  return (
    <MenuView
      title="Menu Title"
      onPressAction={({nativeEvent}) => {
        console.log(JSON.stringify(nativeEvent));
        switch (nativeEvent.event) {
          case 'go_premium':
            navigation.navigate('Purchase');
            break;
          case 'export':
            navigation.navigate('Export');
            break;
          case 'support':
            navigation.navigate('TicketsList');
            break;
        }
      }}
      actions={[
        {
          id: 'go_premium',
          title: 'Go Premium',
        },
        {
          id: 'list_all_tables',
          title: 'List all tables',
        },
        {
          id: 'export',
          title: 'Export',
          subtitle: 'Export table in CSV',
          imageColor: '#000',
          image: Platform.select({
            ios: 'square.and.arrow.up',
            android: 'baseline_unarchive_24',
          }),
          state: 'on',
        },
        {
          id: 'support',
          title: 'Get Help',
          image: Platform.select({
            ios: 'trash',
            android: 'baseline_help_center_24',
          }),
        },
      ]}>
      <Icon testID="menu" name="menu" color="#000" size={24} />
    </MenuView>
  );
};

const styles = StyleSheet.create({
  appBar: {
    width: '100%',
    paddingHorizontal: 20,
    height: 45,
    backgroundColor: '#ffea00',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appBarTxt: {
    textAlign: 'center',
    fontSize: 22,
    color: '#2f3542',
    marginLeft: 15,
  },
  optionContainer: {
    flexDirection: 'row',
    width: 70,
    justifyContent: 'space-between',
  },
});

export default OptionsMenu;
