import React, {FC, useEffect, useState} from 'react';

import Dialog from 'react-native-dialog';

//@ts-ignore
import Share from 'react-native-share';

import RNFS from 'react-native-fs';

import {requestExternalWritePermission} from '../utils/utils';
import {ExecuteUserQuery} from '../utils/storage';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface Props {
  modalState: boolean;
  setModalState: (val: boolean) => void;
}

const ExportData: FC<Props> = ({modalState, setModalState}) => {
  const [exportErr, setExportErr] = useState<string>('');
  const [fieldValue, setFieldValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExported, setIsExported] = useState<boolean>(false);

  /** If input changes then make the export error empty */
  useEffect(() => {
    if (fieldValue !== '') {
      setExportErr('');
    }
  }, [fieldValue]);

  const exportCSV = async (): Promise<void> => {
    const isGranted: boolean = await requestExternalWritePermission();
    let csvString: string = '';

    if (!isGranted) {
      return;
    }

    try {
      setIsLoading(true);

      /** Fetch rows from database and make it csv */
      const res: any = await ExecuteUserQuery(
        `SELECT * FROM ${fieldValue}`,
        [],
        true,
      );
      const len: number = res.rows.length;
      setIsLoading(false);
      // console.log(res.rows);
      if (len === 0) {
        setExportErr('Table is empty');
        return;
      } else {
        setExportErr('');
      }

      const header: string[] = Object.keys(res.rows.item(0)).reverse();
      const rowsArr: any[] = [];

      for (let i = 0; i < len; i++) {
        let row = res.rows.item(i);
        rowsArr.push(Object.values(row).reverse());
      }
      // console.log(header);
      const tableData: [][] = [header, ...rowsArr];

      // console.log(tableData);

      const CSVArray: string[] = [];
      tableData.forEach((row) => {
        const line = row.join(',');
        CSVArray.push(line);
      });

      csvString = CSVArray.join('\n');

      console.log(csvString);
    } catch (error) {
      setIsLoading(false);
      setExportErr('Error in finding table');
      // console.error(error.message);
      return;
    }

    try {
      /** Path of saving the csv file */
      const randomNum: number = Math.floor(Math.random() * 899 + 100);
      const path = `${RNFS.DownloadDirectoryPath}/${fieldValue}_${randomNum}.csv`;
      console.log(path);

      await RNFS.writeFile(path, csvString, 'utf8');
      setIsExported(true);
      // const shareResponse = await Share.open({
      //   url: `file://${path}`,
      //   title: 'Table Exported',
      //   message: 'Please save it or share it',
      // });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Dialog.Container
      visible={modalState}
      contentStyle={{height: 220, justifyContent: 'space-around'}}
      onBackdropPress={() => setModalState(false)}>
      {!isLoading && (
        <Dialog.Title>
          {isExported ? 'Table Exported Sucessfully' : 'Export Table in CSV'}
        </Dialog.Title>
      )}

      {!isLoading && (
        <Dialog.Description>
          {isExported
            ? 'CSV file saved in your downloads\nWould you like to share it ?'
            : 'Type the table name'}
        </Dialog.Description>
      )}
      {isLoading ? (
        <ActivityIndicator color="gold" size="large" />
      ) : (
        !isExported && (
          <Dialog.Input
            autoFocus={true}
            style={styles.tableInput}
            placeholder="Employees"
            onChangeText={(text: string) => setFieldValue(text)}
            value={fieldValue}
          />
        )
      )}

      {!!exportErr && <Text style={styles.errorTxt}>{exportErr}</Text>}
      {!isLoading && (
        <Dialog.Button label="Cancel" onPress={() => setModalState(false)} />
      )}
      {!isLoading && (
        <Dialog.Button
          label={isExported ? 'Share' : 'Export'}
          onPress={() => exportCSV()}
        />
      )}
    </Dialog.Container>
  );
};

export default ExportData;

const styles = StyleSheet.create({
  tableInput: {
    borderBottomWidth: 1,
    marginLeft: 3,
    marginRight: 3,
  },
  errorTxt: {
    color: 'tomato',
    marginLeft: 15,
    marginTop: -15,
  },
});
