import React, {FC, useState} from 'react';
import {Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkYellow} from '../data/colors.json';

interface Props {
  modalState: boolean;
  setModalState: (val: boolean) => void;
}
const {width, height} = Dimensions.get('window');
const GoPremium: FC<Props> = ({modalState, setModalState}) => {
  return (
    <Modal
      visible={modalState}
      animationType="slide"
      onRequestClose={() => setModalState(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={{uri: 'https://i.imgur.com/O0ltOif.png'}}
          />
          <Text style={styles.title}>
            Go Premium to {'\n'}unlock all features
          </Text>
        </View>
        <Image
          style={styles.image}
          source={{uri: 'https://i.imgur.com/3SfnapZ.jpg'}}
          resizeMode="contain"
        />
        <View style={styles.featureTxtContainer}>
          <Icon name="check-decagram" color={darkYellow} size={24} />
          <Text style={styles.featureTxt}> Ads Free</Text>
        </View>
        <View style={styles.featureTxtContainer}>
          <Icon name="check-decagram" color={darkYellow} size={24} />
          <Text style={styles.featureTxt}> Query History</Text>
        </View>
        <View style={styles.featureTxtContainer}>
          <Icon name="check-decagram" color={darkYellow} size={24} />
          <Text style={styles.featureTxt}> Autocomplete</Text>
        </View>
        <View style={styles.featureTxtContainer}>
          <Icon name="check-decagram" color={darkYellow} size={24} />
          <Text style={styles.featureTxt}> Swipe Gestures</Text>
        </View>
        <TouchableOpacity style={styles.buyBtn}>
          <Text style={styles.buyBtnTxt}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GoPremium;

const styles = StyleSheet.create({
  container:{
    height: height,
    // backgroundColor: "pink"
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    padding: 2,
  },
  logo: {
    width: 150,
    height: 200,
    marginHorizontal: 'auto',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    margin: 10
  },
  featureTxt: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign:"center"
  
  },
  featureTxtContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  image: {
    width: width,
    height: width / 2.7,
  },
  buyBtn:{
      position: "absolute",
      bottom: 30,
      alignItems: "center",
      width: width
  },
  buyBtnTxt:{
    fontSize: 20,
    textAlign:"center",
    backgroundColor: darkYellow,
    padding: 8,
    width: 370,
    borderRadius: 5
  }
});
