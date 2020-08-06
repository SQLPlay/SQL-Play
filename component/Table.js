import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

export default function TableData({header, rows, tableWidths}) {
  return (
    <>
      <Text>Output</Text>

      <ScrollView horizontal={true} bounces={false}>
        <View style={styles.outPutContainer}>
          <ScrollView bounces={false}>
            <Table borderStyle={styles.tableBorder}>
              <Row
                data={header}
                style={styles.head}
                textStyle={styles.headerText}
                widthArr={tableWidths.current}
              />
              <Rows
                data={rows}
                widthArr={tableWidths.current}
                textStyle={styles.rowTxt}
              />
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  tableBorder: {
    borderWidth: 2,
    borderColor: '#c8e1ff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  headerText: {
    margin: 6,
    textTransform: 'capitalize',
  },
  rowTxt: {
    margin: 6,
  },
  outPutContainer: {
    flex: 1,
    marginBottom: 50,
    height: '100%',
    width: '100%',
  },
});
