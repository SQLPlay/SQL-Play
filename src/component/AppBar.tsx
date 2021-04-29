import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MenuOptions from './MenuOptions';
import SearchBox from './SearchBox';

export interface Props {
  setInputValue: (query: string) => void;
  isPremium: boolean;
  setIsPremium: (isPrem: boolean) => void;
  setPremiumModalOpen: (isOpen: boolean) => void;
  premiumModalOpen: boolean;
}

const AppBar: React.FC<Props> = ({
  setInputValue,
  isPremium,
  setIsPremium,
  setPremiumModalOpen,
  premiumModalOpen,
}) => {
  return (
    <View style={styles.appBar}>
      <Text style={styles.appBarTxt}>SQL Play</Text>
      <View style={styles.optionContainer}>
        <SearchBox setInputValue={setInputValue} />
        <MenuOptions
          isPremium={isPremium}
          setInputValue={setInputValue}
          setIsPremium={setIsPremium}
          setPremiumModalOpen={setPremiumModalOpen}
          premiumModalOpen={premiumModalOpen}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appBar: {
    width: '100%',
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

export default AppBar;
