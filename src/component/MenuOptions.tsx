import React, {FC, useRef} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

//@ts-ignore
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
const MenuOptions: FC = () => {
  const menuRef = useRef<Menu>(null);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Menu
        ref={menuRef}
        style={{maxWidth: "auto"}}
        button={
          <Icon
            name="more-vert"
            onPress={() => menuRef.current.show()}
            size={25}
          />
        }>
        <MenuItem onPress={() => null}>List all tables</MenuItem>
        <MenuItem onPress={() => null}>Go premium</MenuItem>
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
