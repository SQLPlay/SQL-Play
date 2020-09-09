import React, {FC, RefObject} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
//@ts-ignore
import {Table, Row, Rows} from 'react-native-table-component';

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  ColorSchemeProvider,
} from 'react-native-dynamic';

interface Props {
  header: any[];
  rows: any[];
  tableWidths: RefObject<number[]>;
}

const DataTable: FC<Props> = ({header, rows, tableWidths}) => {
  const styles = useDynamicValue(dynamicStyles);
  return (
    <>
      <Text style={styles.outputText}>Output</Text>

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
};
export default DataTable;

const dynamicStyles = new DynamicStyleSheet({
  outputText: {
    color: new DynamicValue('black', 'white'),
  },
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
    color: new DynamicValue('black', 'white'),
  },
  outPutContainer: {
    flex: 1,
    marginBottom: 235,
    marginTop: 10,
    width: '100%',
  },
});
