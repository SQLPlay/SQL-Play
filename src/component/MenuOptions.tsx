import React, {FC, useRef, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//@ts-ignore
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {SeachInputProp} from './AppBar';
import GoPremium from './GoPremium';

import ExportData from './ExportData';

const MenuOptions: FC<SeachInputProp> = ({
  setInputValue,
  isPremium,
  setIsPremium,
}) => {
  const menuRef = useRef<Menu>(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState<boolean>(false);
  const [exportModal, setExportModal] = useState<boolean>(false);

  const showAllTables = (): void => {
    const query: string = `SELECT name FROM sqlite_master \nWHERE type='table';`;
    menuRef.current.hide();
    setInputValue(query);
  };
  const showSupportedQuery = (): void => {
    menuRef.current.hide();
    Alert.alert(
      'Supported Queries',

      `This app is built on top of SQLite, so the most queries of SQL is supported

You can create, delete, modify and join the tables,

The select query works mostly same as SQL

There is no user roles and authentication here

All your queries are run for a single database, so all your tables are in a single datbase.

In future this app may allow you to create and select difference databases.
`,
      [{text: 'OK', style: 'cancel'}],
      {cancelable: true},
    );
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <GoPremium
        modalState={premiumModalOpen}
        setModalState={setPremiumModalOpen}
        isPremium={isPremium}
        setIsPremium={setIsPremium}
      />
      <ExportData modalState={exportModal} setModalState={setExportModal} />
      <Menu
        ref={menuRef}
        style={{maxWidth: 'auto'}}
        button={
          <Icon
            name="more-vert"
            onPress={() => menuRef.current.show()}
            size={25}
          />
        }>
        <MenuItem
          disabled={isPremium}
          onPress={() => {
            menuRef.current.hide();
            setExportModal(true);
          }}>
          Export Data
        </MenuItem>
        <MenuItem onPress={showAllTables}>List all tables</MenuItem>
        <MenuItem onPress={showSupportedQuery}>Supported query</MenuItem>
        <MenuDivider />
        <MenuItem
          onPress={() => {
            setPremiumModalOpen(true);
            menuRef.current.hide();
          }}>
          <MCIcon name="crown" size={16} />
          <Text> {!isPremium && 'Go '}Premium</Text>
        </MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
