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
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkYellow} from '../data/colors.json';

import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  finishTransaction,
  Product,
} from 'react-native-iap';

import {itemSkus, restorePremium, savePremium} from '../utils/utils';

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
  const [purchaseProcessing, setPurchaseProcessing] = useState(false);
  const [localizedPrice, setlocalizedPrice] = useState('');

  const getItems = async (): Promise<void> => {
    try {
      const result: boolean = await RNIap.initConnection();
      console.log('connection initialised', result);
      /** If there is no skus return here */
      if (!itemSkus) {
        return;
      }
      const products: Product[] = await RNIap.getProducts(itemSkus);
      console.log('Products', products);
      setlocalizedPrice(products[0].localizedPrice);

      purchaseUpdate = purchaseUpdatedListener(async purchase => {
        const receipt: string = purchase.transactionReceipt;
        if (receipt) {
          try {
            await finishTransaction(purchase);
            Alert.alert(
              'Purchase complete',
              'Thanks for purchasing, Now you can enjoy the premium benefits ',
            );
            /** make it affect on all app  */
            savePremium();
            setIsPremium(true);
            setPurchaseProcessing(false);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
      });

      purchaseError = purchaseErrorListener(error => {
        console.log('purchaseErrorListener', error);
        setPurchaseProcessing(false);
        // Alert.alert('purchase error', JSON.stringify(error.message));
      });
      // const consumed = await RNIap.consumeAllItemsAndroid();
      // console.log('consumed all items?', consumed);
    } catch (err) {
      console.log(err.code, err.message);
      setPurchaseProcessing(false);
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
      setPurchaseProcessing(true);
      await RNIap.requestPurchase(itemSkus[0]);
      console.log('Purchase success');
    } catch (err) {
      console.log(err.code, err.message);
    }
  };

  const handleRestore = async (): Promise<void> => {
    try {
      setPurchaseProcessing(true);
      const success = await restorePremium();
      if (success) {
        Alert.alert(
          'Purchase complete',
          'Thanks for purchasing, Now you can enjoy the premium benefits ',
        );

        setIsPremium(true);
      } else {
        Alert.alert('Failed to restore your purchase');
      }
      setPurchaseProcessing(false);
    } catch (error) {
      setPurchaseProcessing(false);
      console.log(error);
      Alert.alert('Failed to restore your purchase', error);
    }
  };
  return (
    <Modal
      visible={modalState}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => setModalState(false)}
    >
      <ScrollView contentContainerStyle={{height: height}}>
        <SafeAreaView style={styles.container}>
          <View>
            <View style={styles.closeBtnContainer}>
              <Icon
                name="close"
                size={30}
                onPress={() => setModalState(false)}
              />
            </View>
            <View style={styles.header}>
              <Image
                style={styles.logo}
                accessibilityLabel="SQL Play premium logo"
                source={require('../images/sqlpro.png')}
              />
              <Text style={styles.title}>
                Go Premium to {'\n'}unlock all features
              </Text>
            </View>
            <Image
              style={styles.image}
              source={require('../images/autocomplete.png')}
              accessibilityLabel="Image of showing autocomplete"
              resizeMode="contain"
            />
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Ads Free</Text>
            </View>
            <View style={styles.featureTxtContainer}>
              <Icon name="check-decagram" color={darkYellow} size={24} />
              <Text style={styles.featureTxt}> Export Tables</Text>
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
          </View>
          <View>
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={buyPremium}
              disabled={isPremium}
            >
              {!purchaseProcessing ? (
                <Text style={styles.buyBtnTxt}>
                  {isPremium
                    ? 'Sweet! You have Premium'
                    : `Buy Now for ${localizedPrice}`}
                </Text>
              ) : (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color="#fcfcfc" />
                </View>
              )}
            </TouchableOpacity>
            {!isPremium && (
              <TouchableOpacity onPress={handleRestore}>
                <Text style={styles.restoreBtn}>Restore Purchase</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default GoPremium;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: 'pink',
    justifyContent: 'space-between',
  },
  closeBtnContainer: {
    alignItems: 'flex-end',
    padding: 5,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    padding: 2,
  },
  logo: {
    width: 150,
    height: 180,
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
    // position: 'absolute',
    // bottom: 20,
    marginVertical: 5,
    alignItems: 'center',
    width: width,
  },
  buyBtnTxt: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: darkYellow,
    padding: 8,
    maxWidth: 350,
    width: width - 20,
    borderRadius: 5,
  },
  restoreBtn: {
    textAlign: 'center',
    padding: 5,
    color: '#0984e3',
    fontSize: 16,
  },
  loaderContainer: {
    backgroundColor: darkYellow,
    padding: 12,
    maxWidth: 350,
    width: width - 20,
    borderRadius: 5,
  },
});
