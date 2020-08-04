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

const App = () => {
  const [value, onChangeText] = React.useState('');
  const [dbOutput, setDbOutput] = useState('');

  const runQuery = async () => {
    try {
      const res = await ExecuteQuery(value);

      const resultArr = [];
      const tablesVals = [];
      const len = res.rows.length;
      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        resultArr.push(Object.values(row).reverse().join(" | "))
      }
      console.log(resultArr.join("\n"));
      setDbOutput(resultArr.join("\n"))
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
          <ScrollView style={styles.outPut}>
            <Text>{dbOutput}</Text>
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
  outPut: {
    borderWidth: 1,
    padding: 5,
    marginBottom: 50
  }
});

export default App;
