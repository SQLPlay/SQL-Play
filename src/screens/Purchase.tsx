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
import {initConnection, useIAP, withIAPContext} from 'react-native-iap';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import MIcon from '@react-native-vector-icons/material-icons';
import sqlplay_crown from '../images/sqlpro.png';
import FeatureListItem from '~/component/FeatureListItem';
import PrimaryButton from '~/component/Button/PrimaryButton';
import SecondaryButton from '~/component/Button/SecondaryButton';
import {showErrorNotif, showSuccessNotif} from '~/utils/notif';
import {secureStore} from '~/store/mmkv';
import {productId} from '~/utils/const';
import colors from 'tailwindcss/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';

// import { Container } from './styles';

const featureList = [
  'Unlock shortcuts bar',
  'Keep it ad free forever!',
  'Always-offline articles.',
  'Time travel with Undo / Redo.',
  'Export SQL database (.db) file.',
  'Unlock 15+ SQL lessons for Data Analysts.',
  '24/7 email support to nail your SQL queries.',
  'Export your tables on the fly in CSV / XLSX.',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Purchase'>;

const Purchase = ({navigation}: Props) => {
  const {
    connected,
    products,
    getProducts,
    requestPurchase,
    currentPurchaseError,
    purchaseHistory,
    getPurchaseHistory,
  } = useIAP();

  const [hasPro, setHasPro] = useMMKVStorage('hasPro', secureStore, false);
  const [transactionId, setTransactionId] = useMMKVStorage<string | null>(
    'transactionId',
    secureStore,
    null,
  );
  useEffect(() => {
    // setHasPro(false);
    getProducts({skus: [productId]});
  }, []);

  useEffect(() => {
    if (!currentPurchaseError) return;
    showErrorNotif(
      currentPurchaseError?.message ?? 'Unknown error occured while purchasing',
    );
  }, [currentPurchaseError]);

  useEffect(() => {
    purchaseHistory.forEach(purchase => {
      if (purchase.productId !== productId) {
        return showErrorNotif('Previous product id do not match');
      }

      if (purchase.transactionId) {
        setTransactionId(purchase.transactionId);
      } else {
        setTransactionId(purchase.purchaseToken ?? purchase.transactionReceipt);
      }

      // finishTransaction({purchase, isConsumable: true});
      setHasPro(true);
      showSuccessNotif('Yay! Your SQL Play Pro has been restored');
    });
  }, [purchaseHistory]);

  const restorePurchase = async () => {
    try {
      await getPurchaseHistory();
      if (purchaseHistory?.length === 0) {
        return showErrorNotif(
          'Failed to restore purchase',
          'No previous purchase found on this account.',
        );
      }
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

  const localisedPrice = products[0]?.localizedPrice;
  const btnBuyTxt = connected
    ? localisedPrice
      ? `Buy Now For ${localisedPrice}`
      : 'Getting the price ...'
    : 'Not available';

  const btnBoughtTxt = 'Sweet! You have SQL Play Pro';

  return (
    <ScrollView
      style={{backgroundColor: 'rgba(0,0,0,0.7)', flex: 1}}
      contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            navigation.canGoBack()
              ? navigation.goBack()
              : navigation.navigate('CodeRunner')
          }
          style={styles.closeBtn}>
          <MIcon name="close" size={30} color={colors.gray[800]} />
        </TouchableOpacity>
        <View style={styles.header} />

        <Text style={styles.headerText}>
          Put the <Text style={styles.semiBold}>Pro</Text> in your{' '}
          <Text style={styles.semiBold}>Pro</Text>fession.
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
            focusable={true}
            disabled={!connected || hasPro}
            title={hasPro ? btnBoughtTxt : btnBuyTxt}
            onPress={async () => {
              await requestPurchase({
                sku: productId,
                skus: [productId],
              });
            }}
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
    maxHeight: 600,
    maxWidth: 335,
    width: '95%',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'space-around',
    position: 'relative',
    // flex: 1,
    paddingHorizontal: 6,
    paddingBottom: 16,
  },
  header: {
    position: 'absolute',
    backgroundColor: colors.amber[300],
    height: 1500,
    width: 1500,
    top: -1350,
    left: '50%',
    transform: [{translateX: -750}],
    borderRadius: 750,
  },
  semiBold: {
    fontWeight: '700',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000',
    marginTop: 50,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    // alignItems: 'center',
    width: '100%',
    paddingBottom: 8,
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
