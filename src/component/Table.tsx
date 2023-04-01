import React, {FC, RefObject, memo, useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
//@ts-ignore

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
const data = [
  ['name', 'age', 'job'],
  ['ritika', 19, 'milking'],
  ['lufushivma', 909, 'developer pepe'],
  // add more data here...
];
const DataTable: FC<Props> = ({header, rows, tableWidths}) => {
  const styles = useDynamicValue(dynamicStyles);

  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  useEffect(() => {
    // calculate the maximum width of each column
    const widths = data[0].map((text, index) => {
      let maxWidth = Math.ceil(text.toString().length * 10) + 30; // estimate the width of the header based on the length of the text
      for (let i = 1; i < data.length; i++) {
        const cellText = data[i][index].toString();
        const cellWidth = Math.ceil(cellText.length * 10) + 30; // estimate the width of the cell based on the length of the text
        maxWidth = Math.max(maxWidth, cellWidth);
      }
      return maxWidth;
    });
    setColumnWidths(widths);
  }, []);

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            {data[0].map((cell, index) => (
              <View
                key={index}
                style={[styles.headerCell, {minWidth: columnWidths[index]}]}>
                <Text>{cell.toString()}</Text>
              </View>
            ))}
          </View>
          {data.slice(1).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[styles.cell, {minWidth: columnWidths[cellIndex]}]}>
                  <Text>{cell.toString()}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};
export default memo(DataTable);

const dynamicStyles = new DynamicStyleSheet({
  table: {
    flexDirection: 'column',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f2f2f2',
  },
  cell: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderLeftWidth: 2,
  },
  outputText: {
    color: new DynamicValue('black', 'white'),
  },
  tableBorder: {
    borderWidth: 2,
    borderColor: '#fdd835',
  },
  head: {
    height: 40,
    backgroundColor: '#ffea00',
  },
  headerText: {
    margin: 6,
    textTransform: 'capitalize',
  },
  rowTxt: {
    margin: 6,
    color: new DynamicValue('black', 'white'),
  },
  container: {
    // flex: 1,
    // marginBottom: 235,
    marginTop: 10,
    width: '100%',
  },
});
