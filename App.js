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
} from 'react-native';
import {ExecuteQuery} from './storage';
import {Table, Row, Rows} from 'react-native-table-component';

const App = () => {
  const [value, onChangeText] = React.useState('');

  const [dbHeader, setDbHeader] = useState(['price', 'name']); // headers from db
  const [dbData, setDbData] = useState([
    ['sundae', 10],
    ['stray suck', 69],
  ]); // main rows with value

  const runQuery = async () => {
    try {
      const res = await ExecuteQuery(value);

      const tablesVals = [];
      const header = Object.keys(res.rows.item(0)).reverse();
      console.log(header);
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
              numberOfLines={4}
              placeholder="Type your SQL query"
            />
          </View>

          <Button title="Clear" onPress={() => onChangeText('')} />
          <Text>Output</Text>
          <ScrollView style={styles.outPutContainer}>
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
              <Row data={dbHeader} style={styles.head} textStyle={styles.text}/>
              <Rows data={dbData} textStyle={styles.text}/>
            </Table>
          </ScrollView>
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
  text: {
    margin: 6,
    textAlign: "center",
    textTransform: "capitalize"
  },
});

export default App;
