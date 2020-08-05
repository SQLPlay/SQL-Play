import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function Cell({data}) {
  return (
    <View style={styles.cellStyle}>
      <Text>{data}</Text>
    </View>
  );
}

function Row({column}) {
  return (
    <View style={styles.rowStyle}>
      {column.map(data => (
        <Cell data={data} />
      ))}
    </View>
  );
}

export default function TableData() {
  const data = [
    ['Andrew', 'General Manager'],
    ['Nancy', 'Sales Manager'],
    ['Jane', 'Sales Support Agent'],
    ['Margaret', 'Sales Support Agent'],
    ['Steve', 'Sales Support Agent'],
    ['Michael', 'IT Manager'],
    ['Robert', 'IT Staff'],
    ['Laura', 'IT Staff'],
  ];
  return (
    <View style={styles.gridContainer}>
      {data.map(column => (
        <Row column={column} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cellStyle: {
    padding: 10,
    borderWidth: 1,
    width: '50%',
  },
});
