import React, {FC, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  EmitterSubscription,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkYellow} from '../data/colors.json';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  Product,
} from 'react-native-iap';

//items of products
export const itemSkus: string[] | undefined = Platform.select({
  android: ['premium'],
});

let purchaseUpdate: EmitterSubscription, purchaseError: EmitterSubscription;

interface Props {
  modalState: boolean;
  setModalState: (val: boolean) => void;
  setIsPremium: (isPrem: boolean) => void;
  isPremium: boolean;
}
const {width, height} = Dimensions.get('window');

/** Ui component here */
const GoPremium: FC<Props> = ({
  modalState,
  setModalState,
  setIsPremium,
  isPremium,
}) => {
  const getItems = async (): Promise<void> => {
    try {
      const result: boolean = await RNIap.initConnection();
      console.log('connection initialised', result);
      /** If there is no skus return here */
      if (!itemSkus) {
        return;
      }
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log('Products', products[0].title);

      purchaseUpdate = purchaseUpdatedListener(async (purchase) => {
        const receipt: string = purchase.transactionReceipt;
        if (receipt) {
          try {
            const ackResult: string | void = await finishTransaction(purchase);
            Alert.alert(
              'Purchase complete',
              'Thanks for purchasing, Now you can enjoy the premium benefits ',
            );
            /** make it affect on all app  */
            setIsPremium(true);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
      });

      purchaseError = purchaseErrorListener((error) => {
        console.log('purchaseErrorListener', error);
        Alert.alert('purchase error', JSON.stringify(error.message));
      });
      // const consumed = await RNIap.consumeAllItemsAndroid();
      // console.log('consumed all items?', consumed);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  useEffect(() => {
    getItems();
    () => {
      //remove the listerners on component unmount
      return () => {
        if (purchaseUpdate) {
          purchaseUpdate.remove();
        }
        if (purchaseError) {
          purchaseError.remove();
        }
        RNIap.endConnection();
      };
    };
  }, []);

  const buyPremium = async (): Promise<void> => {
    try {
      if (!itemSkus) {
        return;
      }
      await RNIap.requestPurchase(itemSkus[0]);
      console.log('Purchase success');
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };
  return (
    <Modal
      visible={modalState}
      animationType="slide"
      onRequestClose={() => setModalState(false)}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.logo} source={require('../images/sqlpro.png')} />
          <Text style={styles.title}>
            Go Premium to {'\n'}unlock all features
          </Text>
        </View>
        <Image
          style={styles.image}
          source={require('../images/autocomplete.png')}
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
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={buyPremium}
          disabled={isPremium}>
          <Text style={styles.buyBtnTxt}>
            {isPremium ? 'Sweet! You have Premium' : 'Buy Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default GoPremium;

const styles = StyleSheet.create({
  container: {
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
    margin: 10,
  },
  featureTxt: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',
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
  buyBtn: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    width: width,
  },
  buyBtnTxt: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: darkYellow,
    padding: 8,
    width: 370,
    borderRadius: 5,
  },
});
