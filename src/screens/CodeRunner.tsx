import {StyleSheet, View} from 'react-native';
import React from 'react';
import InputContainer from '~/component/InputContainer';
import Table from '~/component/Table';
import ShortcutsBar from '~/component/ShortcutsBar';
import RunButton from '~/component/RunButton';
import {useStore} from '@nanostores/react';
import {$tableData, $tableWidths} from '~/utils/run-query';
import SearchSheet from '~/component/SearchSheet';

// import {StartupTime, getTimeSinceStartup} from 'react-native-startup-time';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

export default function CodeRunner() {
  const tableData = useStore($tableData);

  return (
    <View testID="query-runner" style={styles.outerContainer}>
      <View style={styles.innercontainer}>
        <InputContainer />
        {tableData.header.length ? (
          <Table {...tableData} columnWidths={$tableWidths.get()} />
        ) : null}
      </View>
      <BottomSheetModalProvider>
        <SearchSheet />
      </BottomSheetModalProvider>
      <ShortcutsBar />
      <RunButton />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    // backgroundColor: '#292432',
    flex: 1,
  },
  innercontainer: {
    flex: 1,
    paddingBottom: 10,
  },
});
