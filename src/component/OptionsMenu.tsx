import React, {useCallback} from 'react';
import {StyleSheet, Platform, Pressable, useColorScheme} from 'react-native';
import {MenuAction, MenuView} from '@react-native-menu/menu';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {createXlsx} from '~/utils/xlsx';
import {getAllTablesName} from '~/utils/db';
import {$inputQuery} from '~/store/input';
import {runQuery} from '~/utils/run-query';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const listAllTablesCmd = `SELECT name FROM sqlite_schema
WHERE type = 'table' AND name NOT LIKE 'sqlite_%'`;

const OptionsMenu = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();

  const isDark = scheme === 'dark';
  const imageColor = isDark ? '#fff' : '#000';

  const handlePressAction = useCallback((event: string) => {
    switch (event) {
      case 'go_premium':
        navigation.navigate('Purchase');
        break;
      case 'export':
        navigation.navigate('Export');
        break;
      case 'list_all_tables':
        $inputQuery.set(listAllTablesCmd);
        runQuery();
        break;
      case 'support':
        navigation.navigate('SupportTicketsList');
        break;
    }
  }, []);

  const menuActions: MenuAction[] = [
    {
      id: 'go_premium',
      title: 'Go Premium',
      imageColor,
      image: Platform.select({
        ios: 'square.and.arrow.up',
        android: 'baseline_auto_awesome_24',
      }),
    },
    {
      id: 'list_all_tables',
      title: 'List all tables',
      imageColor,
      image: Platform.select({
        ios: 'square.and.arrow.up',
        android: 'baseline_dataset_24',
      }),
    },
    {
      id: 'export',
      title: 'Export',
      subtitle: 'Export table in CSV',
      imageColor,
      image: Platform.select({
        ios: 'square.and.arrow.up',
        android: 'baseline_unarchive_24',
      }),
    },
    {
      id: 'support',
      title: 'Get Help',
      imageColor,
      image: Platform.select({
        ios: 'trash',
        android: 'baseline_3p_24',
      }),
    },
  ];

  return (
    <MenuView
      title="Menu Title"
      onPressAction={({nativeEvent}) => handlePressAction(nativeEvent.event)}
      actions={menuActions}>
      <Icon
        testID="menu"
        name="menu"
        color={scheme === 'dark' ? '#fff' : '#000'}
        size={24}
      />
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
