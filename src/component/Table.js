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
    borderColor: '#fdd835',
  },
  head: {
    height: 40,
    backgroundColor: '#fff176',
  },
  headerText: {
    margin: 6,
    textTransform: 'capitalize',
  },
  rowTxt: {
    margin: 6,
    // color: "#fff"

  },
  outPutContainer: {
    flex: 1,
    marginBottom: 235,
    marginTop: 10,
    width: '100%',
  },
});
