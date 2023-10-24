import React, {
  FC,
  RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {FlashList} from '@shopify/flash-list';

interface Props {
  header: string[];
  rows: string[][];
  columnWidths: number[];
}

const DataTable: FC<Props> = ({header, rows, columnWidths}) => {
  // const styles = useDynamicValue(dynamicStyles);

  const ref = useRef<FlashList<any>>(null);
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
            <Text selectable={true} style={styles.outputText}>
              {cell}
            </Text>
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
            <Text selectable={true} style={styles.headerText}>
              {cell}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const totalColumnWidth = columnWidths.reduce((prv, cur) => prv + cur, 0);
  return (
    <ScrollView horizontal={true}>
      <View
        style={{
          ...styles.container,
          maxWidth: totalColumnWidth,
        }}>
        {renderHeader()}
        <FlashList
          ref={ref}
          estimatedItemSize={35}
          estimatedListSize={{
            height: 35,
            width: totalColumnWidth,
          }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
          data={rows}
          scrollEnabled={true}
          renderItem={renderItem}
          stickyHeaderHiddenOnScroll={false}
        />
      </View>
    </ScrollView>
  );
};

export default DataTable;

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
    color: '#000000',
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
    flexGrow: 1,
    // marginBottom: 235,
    // marginTop: 18,
    marginHorizontal: 8,
    minWidth: Dimensions.get('window').width,
    minHeight: 200,
  },
});
