import React, {FC, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
//@ts-ignore
import Share from 'react-native-share'

import RNFS from 'react-native-fs'

//@ts-ignore
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {SeachInputProp} from './AppBar';
import GoPremium from './GoPremium';
import { requestExternalWritePermission } from '../utils/utils';

const MenuOptions: FC<SeachInputProp> = ({setInputValue}) => {
  const menuRef = useRef<Menu>(null);

  const showAllTables = () => {
    const query: string = `SELECT name FROM sqlite_master \nWHERE type='table';`;
    menuRef.current.hide();
    setInputValue(query);
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const exportCSV = async () => {
    const isGranted:boolean = await requestExternalWritePermission()
    if (!isGranted) {
      return
    }
    var path = RNFS.DownloadDirectoryPath + '/sqlplay.txt';
    console.log(path);
    
    try {
      await RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8');

    const shareResponse = await Share.open({url: `file://${path}`, title: "Data Exported", message: "Please save it or share it"});
    } catch (error) {
       console.log(error.message);
    }
  
  }
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <GoPremium modalState={modalOpen} setModalState={setModalOpen} />
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
        <MenuItem onPress={showAllTables}>List all tables</MenuItem>
        <MenuItem onPress={() => setModalOpen(true)}>
          <MCIcon name="crown" size={16} />
          <Text> Go premium</Text>
        </MenuItem>
        <MenuItem onPress={() => null}>Supported query</MenuItem>
        <MenuItem onPress={() => exportCSV()} >
          Export Data
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => null}>Menu item 4</MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
