import React, {
  FC,
  RefObject,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {View, Text, ScrollView, StyleSheet, FlatList} from 'react-native';
//@ts-ignore

import {
  DynamicStyleSheet,
  DynamicValue,
  useDynamicValue,
  ColorSchemeProvider,
} from 'react-native-dynamic';

interface Props {
  header: string[];
  rows: string[][];
  columnWidths: number[];
}

const DataTable: FC<Props> = ({header, rows, columnWidths}) => {
  // const styles = useDynamicValue(dynamicStyles);

  const renderItem = ({item, index}: {item: string[]; index: number}) => {
    return (
      <View key={index} style={styles.row}>
        {item.map((cell, cellIndex) => (
          <View
            key={cellIndex}
            style={[
              styles.cell,
              {width: columnWidths[cellIndex]},
              {borderRightWidth: item.length === cellIndex + 1 ? 0 : 1},
            ]}>
            <Text>{cell}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerRow}>
        {header.map((cell, index) => (
          <View
            key={index}
            style={[
              styles.headerCell,
              {width: columnWidths[index]},
              {borderRightWidth: header.length === index + 1 ? 0 : 1},
            ]}>
            <Text style={styles.headerText}>{cell}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView horizontal={true}>
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          data={rows}
          scrollEnabled={true}
          stickyHeaderIndices={[0]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          stickyHeaderHiddenOnScroll={false}
        />
      </View>
    </ScrollView>
  );
};
export default memo(DataTable);

const borderColor = '#e5e7eb';
const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: borderColor,
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontFamily: 'Roboto',
    borderRightWidth: 1,
    borderColor,
  },
  cell: {
    fontSize: 16,
    borderRightWidth: 1,
    borderColor: borderColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  outputText: {
    // color: new DynamicValue('black', 'white'),
  },
  tableBorder: {
    // borderWidth: 2,
    // borderColor: '#fdd835',
  },
  head: {
    height: 40,
    // backgroundColor: '#ffea00',
  },
  headerText: {
    textTransform: 'capitalize',
    color: '#353b48',
    fontWeight: '500',
    // fontFamily: 'DroidSans-Bold',
    fontSize: 16,
  },
  rowTxt: {
    margin: 6,
    // color: new DynamicValue('black', 'white'),
  },
  container: {
    flex: 1,
    // marginBottom: 235,
    marginTop: 18,
    marginHorizontal: 8,
    width: '100%',
  },
});
