import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, Alert, Linking, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import GoPremium from './GoPremium';

import ExportData from './ExportData';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const MenuOptions: FC<Props> = ({
  setInputValue,
  isPremium,
  setIsPremium,
  setPremiumModalOpen,
  premiumModalOpen,
}) => {
  const [exportModal, setExportModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    console.log('model', premiumModalOpen);
  }, [premiumModalOpen]);

  const showAllTables = (): void => {
    const query: string =
      "SELECT name FROM sqlite_master \nWHERE type='table';";
    setMenuOpen(false);
    setInputValue(query);
  };
  const showSupportedQuery = (): void => {
    setMenuOpen(false);
    Alert.alert(
      'Supported Queries',

      `
This app has been built on top of SQLite, so most of the SQL queries are supported.

You can create, delete, modify and join the tables.

The select query works mostly the same as SQL.

There are no user roles or authentication here.

All your queries are run for a single database, so all your tables are in a single database.

In future, this app may allow you to create and select different databases.
      `,
      [{text: 'OK', style: 'cancel'}],
      {cancelable: true},
    );
  };

  const sendMailFeedback = (): void => {
    try {
      Linking.openURL(
        'mailto:hi@creativeshi.com?subject=SQL%20Playground%20Feedback',
      );
    } catch (e) {
      console.error(e);
    }
  };

  const openPremiumModal = async () => {
    setMenuOpen(false);
    setPremiumModalOpen(true);
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <ExportData modalState={exportModal} setModalState={setExportModal} />
      <Menu
        visible={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
        style={{maxWidth: 'auto'}}
        anchor={
          <Icon
            name="more-vert"
            onPress={() => {
              setMenuOpen(true);
              Keyboard.dismiss();
            }}
            size={25}
          />
        }
      >
        <MenuItem
          disabled={!isPremium}
          onPress={() => {
            setMenuOpen(false);
            setExportModal(true);
          }}
        >
          Export Data
        </MenuItem>
        <MenuItem onPress={showAllTables}>List all tables</MenuItem>
        <MenuItem onPress={showSupportedQuery}>Query Support</MenuItem>
        <MenuItem onPress={sendMailFeedback}>Send Feedback</MenuItem>
        <MenuDivider />
        <MenuItem onPress={openPremiumModal}>
          <MCIcon name="crown" size={16} />
          <Text> {!isPremium && 'Go '}Premium</Text>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
