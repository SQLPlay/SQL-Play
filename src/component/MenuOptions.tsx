import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, Alert, Linking, Keyboard} from 'react-native';

import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';

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
  setPremiumModalOpen,
}) => {
  const [exportModal, setExportModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const showAllTables = (): void => {
    const query: string =
      "SELECT name FROM sqlite_master \nWHERE type='table';";
    setMenuOpen(false);
    setInputValue(query);
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

  const openPrivacy = (): void => {
    try {
      Linking.openURL('https://sqlplay.net/privacy');
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
        animationDuration={menuOpen ? 300 : 0}
        onRequestClose={() => setMenuOpen(false)}
        style={{maxWidth: 'auto'}}
        anchor={
          <Text
            accessibilityLabel="Menu Options"
            accessibilityHint="Shows additional options like export, list table & premium"
            onPress={() => {
              setMenuOpen(true);
              Keyboard.dismiss();
            }}
          />
        }>
        <MenuItem
          disabled={!isPremium}
          onPress={() => {
            setMenuOpen(false);
            setExportModal(true);
          }}>
          Export Data
        </MenuItem>
        <MenuItem onPress={showAllTables}>List all tables</MenuItem>
        <MenuItem onPress={showSupportedQuery}>Query Support</MenuItem>
        <MenuItem onPress={sendMailFeedback}>Send Feedback</MenuItem>
        <MenuItem onPress={openPrivacy}>Privacy Policy</MenuItem>
        <MenuDivider />
        <MenuItem onPress={openPremiumModal}>
          <Text />
          <Text> {!isPremium && 'Go '}Premium</Text>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
