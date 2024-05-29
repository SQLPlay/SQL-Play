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
import {useTheme} from '@react-navigation/native';
import colors from 'tailwindcss/colors';

interface Props {
  header: string[];
  rows: string[][];
  columnWidths: number[];
}

const DataTable: FC<Props> = ({header, rows, columnWidths}) => {
  // const styles = useDynamicValue(dynamicStyles);

  const {colors} = useTheme();
  const ref = useRef<FlashList<any>>(null);
  const renderItem = ({item, index}: {item: string[]; index: number}) => {
    return (
      <View key={index} style={styles.row}>
        {item.map((cell, cellIndex) => (
          <View
            key={cellIndex}
            style={[styles.cell, {width: columnWidths[cellIndex]}]}>
            <Text selectable={true} style={{color: colors.text}}>
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
            style={[styles.headerCell, {width: columnWidths[index]}]}>
            <Text
              selectable={true}
              style={[styles.headerText, {color: colors.text}]}>
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

const borderColor = colors.gray['300'];

const styles = StyleSheet.create({
  table: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor,
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: borderColor,
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cell: {
    fontSize: 16,
    borderRightWidth: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  headerText: {
    textTransform: 'capitalize',
    fontWeight: '500',
    fontSize: 16,
  },
  rowTxt: {
    margin: 6,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    marginHorizontal: 8,
    minWidth: Dimensions.get('window').width,
    minHeight: 200,
  },
});
