import React from 'react';
import {View, Text, StyleSheet, Platform, Pressable} from 'react-native';
import MenuOptions from './MenuOptions';
import SearchBox from './SearchBox';
import ContextMenu from 'react-native-context-menu-view';
import BaseIcon from './Icons/BaseIcon';
import {MenuView} from '@react-native-menu/menu';
import Icon from 'react-native-vector-icons/Ionicons';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const RightHeader = () => {
  return (
    <View style={{flexDirection: 'row', gap: 8}}>
      <SearchBox setInputValue={() => null} />
      <MenuView
        title="Menu Title"
        onPressAction={({nativeEvent}) => {
          console.log(JSON.stringify(nativeEvent));
        }}
        actions={[
          {
            id: 'share',
            title: 'Export',
            subtitle: 'Export table in CSV',
            imageColor: 'green',
            image: Platform.select({
              ios: 'square.and.arrow.up',
              android: 'baseline_unarchive_24',
            }),
            state: 'on',
          },
          {
            id: 'destructive',
            title: 'Help',
            attributes: {
              destructive: true,
            },
            image: Platform.select({
              ios: 'trash',
              android: 'baseline_help_center_24',
            }),
          },
        ]}>
        <BaseIcon name="DotsThreeVertical" />
      </MenuView>
    </View>
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

export default RightHeader;
