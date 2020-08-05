import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Pressable,
  Button,
  Alert,
  ToastAndroid,
} from 'react-native';
import {ExecuteQuery} from './storage';

import TableData from './component/TableData';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';


const App = () => {
  const [value, onChangeText] = React.useState('');

  const [dbHeader, setDbHeader] = useState([]); // headers from db
  const [dbData, setDbData] = useState([]); // main rows with value

  const runQuery = async () => {
    ToastAndroid.showWithGravity(
      'All Your Base Are Belong To Us',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );

    try {
      const res = await ExecuteQuery(value);

      const header = Object.keys(res.rows.item(0)).reverse();
      // console.log(header);
      setDbHeader(header);

      const len = res.rows.length;
      const resultArr = [];

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        resultArr.push(Object.values(row).reverse());
      }
      console.log(resultArr);
      setDbData(resultArr);
    } catch (error) {
      Alert.alert('Error in DB', error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={styles.scrollView}>
          <View>
            <TextInput
              style={{borderColor: 'gray', borderWidth: 1}}
              onChangeText={(text) => onChangeText(text)}
              multiline
              value={value}
              autoCorrect={false}
              numberOfLines={4}
              placeholder="Type your SQL query"
            />
          </View>

          <Button title="Clear" onPress={() => onChangeText('')} />
          <Text>Output</Text>
          <View style={styles.outPutContainer}>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{flexGrow: 1}}>
              {/* <View>
                <ScrollView>
                  <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                    <Row
                      data={dbHeader}
                      style={styles.head}
                      textStyle={styles.headerText}
                    />
                    <Rows data={dbData} textStyle={styles.rowTxt} />
                  </Table>
                </ScrollView>
              </View> */}
              <TableData/>
            </ScrollView>
          </View>
          <View style={styles.runBtn}>
            <Button title="Run" onPress={runQuery} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    width: '100%',
    padding: 10,
  },
  runBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: '100%',
  },

  outPutContainer: {
    flex: 1,
    padding: 5,
    backgroundColor: '#fff',
    marginBottom: 50,
  },

  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headerText: {
    margin: 6,
    // textAlign: 'center',
    textTransform: 'capitalize',
  },
  rowTxt: {
    margin: 6,
  },
});

export default App;
