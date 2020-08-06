import React, {useState, useRef} from 'react';
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
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';


import {ExecuteQuery} from './storage';

import TableData from './component/TableData';
import {Table, Row, Rows, TableWrapper} from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getLargestWidths} from './component/utils';

const {height, width} = Dimensions.get('window');
const App = () => {
  const [value, onChangeText] = React.useState('select * from employees');

  const [dbHeader, setDbHeader] = useState([]); // headers from db
  const [dbData, setDbData] = useState([]); // main rows with value
  const tableWidths = useRef([]);

  const runQuery = async () => {
    try {
      const res = await ExecuteQuery(value);

      const len = res.rows.length;
      const resultArr = [];

      if (len < 1) {
        console.log('nothing found');
        ToastAndroid.showWithGravity(
          'Query Executed',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
        return;
      }

      const header = Object.keys(res.rows.item(0)).reverse();

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        resultArr.push(Object.values(row).reverse());
      }
      // pass the header and result arr to get the largest widths of their respective column
      tableWidths.current = await getLargestWidths([header, ...resultArr]);
      console.log(tableWidths);

      // console.log(resultArr);
      setDbData(resultArr);
      // console.log(header);
      setDbHeader(header);
    } catch (error) {
      Alert.alert('Error in DB', error.message);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" />
      <SafeAreaView>
        <View style={styles.outerContainer}>
          <View style={styles.appBar}>
            <Icon name="menu" size={24} />
            <Text style={styles.appBarTxt}>SQL Playground</Text>
          </View>
          <View style={styles.innercontainer}>
            <Text style={styles.inputHeader}>Type your SQL Query</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onChangeText(text)}
              multiline
              textAlignVertical="top"
              value={value}
              autoCorrect={false}
              numberOfLines={4}
              placeholder="Type your SQL query"
            />

            <Button title="Clear" onPress={() => onChangeText('')} />
            <Text>Output</Text>
            <View style={styles.outPutContainer}>
              <ScrollView horizontal={true} bounces={false}>
                <View>
                  <ScrollView bounces={false}>
                    <Table
                      borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                      <Row
                        data={dbHeader}
                        style={styles.head}
                        textStyle={styles.headerText}
                        widthArr={tableWidths.current}
                      />
                      <Rows
                        data={dbData}
                        widthArr={tableWidths.current}
                        textStyle={styles.rowTxt}
                      />
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity onPress={runQuery} style={styles.runBtn}>
            <Icon name="play-arrow" size={45} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  appBar: {
    width: '100%',
    height: 45,
    backgroundColor: 'gold',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  appBarTxt: {
    textAlign: 'center',
    fontSize: 22,
  },
  innercontainer: {
    padding: 5,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 10,
    marginTop: 10,
  },
  inputHeader: {
    fontSize: 16,
  },
  runBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    backgroundColor: '#2ecc71',
    borderRadius: 150,
  },

  outPutContainer: {
    flex: 1,
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
