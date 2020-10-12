import React, {FC, useRef, useState} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

//@ts-ignore
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import {SeachInputProp} from './AppBar';
import GoPremium from './GoPremium';

const MenuOptions: FC<SeachInputProp> = ({setInputValue}) => {
  const menuRef = useRef<Menu>(null);

  const showAllTables = () => {
    const query: string = `SELECT name FROM sqlite_master \nWHERE type='table';`;
    menuRef.current.hide();
    setInputValue(query);
  };

  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
        <MenuItem onPress={() => null} disabled>
          Menu item 3
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={() => null}>Menu item 4</MenuItem>
      </Menu>
    </View>
  );
};

export default MenuOptions;
