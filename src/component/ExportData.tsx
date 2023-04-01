import React, {FC, useEffect, useState} from 'react';

//@ts-ignore
import Dialog from 'react-native-dialog';

//@ts-ignore
import Share from 'react-native-share';

import {ExecuteUserQuery} from '../utils/storage';
import {ActivityIndicator, StyleSheet, Text} from 'react-native';

interface Props {
  modalState: boolean;
  setModalState: (val: boolean) => void;
}

let path: string = '';
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
    let csvString: string = '';

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
      tableData.forEach(row => {
        const line = row.join(',');
        CSVArray.push(line);
      });

      csvString = CSVArray.join('\n');
    } catch (error) {
      setIsLoading(false);
      setExportErr('Error in finding table');
      // console.error(error.message);
      return;
    }

    try {
      /** Path of saving the csv file */
      /* const randomNum: number = Math.floor(Math.random() * 899 + 100);
      path = `${RNFS.TemporaryDirectoryPath}/${fieldValue}_${randomNum}.csv`;
      console.log(path);

      await RNFS.writeFile(path, csvString, 'utf8');
      setIsExported(true); */
    } catch (error) {
      console.log(error.message);
    }
  };

  const shareCSV = async (): Promise<void> => {
    try {
      const shareResponse = await Share.open({
        url: `file://${path}`,
        title: 'Table Exported',
        message: 'Share the CSV file',
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    console.log(modalState);
  }, [modalState]);

  /** We will reset all the states here */
  const onCancel = (): void => {
    setModalState(false);

    setIsExported(false);
    setFieldValue('');
  };

  /** Handle when user clicks the export or share button both are in same */
  const onExportOrShare = (): void => {
    if (isExported) {
      shareCSV();
    } else {
      exportCSV();
    }
  };

  return (
    <Dialog.Container
      visible={modalState}
      contentStyle={{
        height: 220,
        marginBottom: 40,
        justifyContent: 'space-around',
      }}
      onBackdropPress={onCancel}>
      {!isLoading && (
        <Dialog.Title>
          {isExported ? 'Table Exported Sucessfully' : 'Export Table in CSV'}
        </Dialog.Title>
      )}

      {!isLoading && (
        <Dialog.Description>
          {isExported
            ? 'Share or Save it anywhere you want'
            : 'Type the table name'}
        </Dialog.Description>
      )}
      {!isLoading && !isExported ? (
        <Dialog.Input
          autoFocus={true}
          style={styles.tableInput}
          placeholder="Employees"
          onChangeText={(text: string) => setFieldValue(text)}
          value={fieldValue}
        />
      ) : (
        isLoading && <ActivityIndicator color="gold" size="large" />
      )}

      {!!exportErr && <Text style={styles.errorTxt}>{exportErr}</Text>}
      {!isLoading && <Dialog.Button label="Cancel" onPress={onCancel} />}
      {!isLoading && (
        <Dialog.Button
          label={isExported ? 'Share' : 'Export'}
          onPress={onExportOrShare}
        />
      )}
    </Dialog.Container>
  );
};

export default ExportData;

const styles = StyleSheet.create({
  tableInput: {
    // borderBottomWidth: 1,
    marginLeft: 3,
    marginRight: 3,
  },
  errorTxt: {
    color: 'tomato',
    marginLeft: 15,
    marginTop: -15,
  },
});
