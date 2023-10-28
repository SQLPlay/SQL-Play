/* eslint-disable curly */
import React, {Dispatch, SetStateAction, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {useIAP, withIAPContext} from 'react-native-iap';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import sqlplay_crown from '../images/sqlpro.png';
import FeatureListItem from '~/component/FeatureListItem';
import PrimaryButton from '~/component/Button/PrimaryButton';
import SecondaryButton from '~/component/Button/SecondaryButton';
import {showErrorNotif, showSuccessNotif} from '~/utils/notif';
import {secureStore} from '~/store/mmkv';
import {productId} from '~/utils/const';
import colors from 'tailwindcss/colors';

// import { Container } from './styles';

const featureList = [
  'Unlock all the exciting Pingu sounds',
  'Star your favourites for quick access',
  'Play multiple sounds simultaneously',
  'Support the Pingu App developer',
];

interface PurchaseProps {}

const Purchase = ({}: PurchaseProps) => {
  const {connected, products, availablePurchases, getAvailablePurchases} =
    useIAP();

  const [hasPro, setHasPro] = useMMKVStorage('hasPro', secureStore, false);
  // console.log(connected, products);

  console.log(products);
  useEffect(() => {
    availablePurchases.forEach(purchase => {
      console.log(purchase);
      if (purchase.productId !== productId) return;
      setHasPro(true);
      showSuccessNotif('Yay! Your Pingu Pro has been restored');
    });
  }, [availablePurchases, setHasPro]);

  const restorePurchase = async () => {
    try {
      await getAvailablePurchases();
    } catch (error) {
      let msg = error as string;
      if (error instanceof Error) {
        msg = error.message;
        console.log(error?.message);
      }
      showErrorNotif('Failed to restore your purchase', msg);
    }
  };

  // get product ID once app is connected to store

  const btnBuyTxt = `Buy Now For ${
    products?.at(0)
      ? products.at(0)?.oneTimePurchaseOfferDetails?.formattedPrice ?? ''
      : ''
  }`;

  const btnBoughtTxt = 'Sweet! You have Pingu Pro';

  return (
    <ScrollView
      style={{backgroundColor: 'rgba(0,0,0,0.1)'}}
      contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => null} style={styles.closeBtn}>
          <Text>X</Text>
        </TouchableOpacity>
        <View style={styles.header} />
        <Text style={styles.headerText}>
          Get Pingu Pro to unlock Exclusive Features
        </Text>
        <Image style={styles.img} resizeMode="contain" source={sqlplay_crown} />

        <View style={styles.featureContainer}>
          {featureList.map((text, idx) => (
            <FeatureListItem key={idx} text={text} />
          ))}
        </View>
        <View style={styles.btnContainer}>
          <PrimaryButton
            isLoading={false}
            disabled={!connected || hasPro}
            title={hasPro ? btnBoughtTxt : btnBuyTxt}
            onPress={() => null}
          />
          {!hasPro ? (
            <SecondaryButton
              onPress={restorePurchase}
              title="Restore purchase"
            />
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
};

export default withIAPContext(Purchase);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxHeight: 500,
    maxWidth: 335,
    width: '95%',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'space-around',
    position: 'relative',
    flex: 1,
  },
  header: {
    position: 'absolute',
    backgroundColor: colors.amber[400],
    height: 1500,
    width: 1500,
    top: -1350,
    left: '50%',
    transform: [{translateX: -750}],
    borderRadius: 750,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    zIndex: 2,
    padding: 10,
    top: 0,
    right: 0,
  },
  featureContainer: {
    alignItems: 'flex-start',
    marginHorizontal: 14,
    marginBottom: 24,
  },
  img: {
    width: 150,
    height: 150,
    marginVertical: 16,
  },
});
