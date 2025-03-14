import {QuickSQLite} from 'react-native-quick-sqlite';
import {TCell, createXlsx} from './xlsx';
import {parseSqlOutput} from './storage';
import {Dirs, FileSystem} from 'react-native-file-access';
import analytics from '@react-native-firebase/analytics';
import {showErrorNotif, showSuccessNotif} from './notif';
import {Alert, Platform} from 'react-native';
import Share from 'react-native-share';
import {capitalizeWord} from './formatter';

const runQuery = async (query: string) => {
  const res = await QuickSQLite.executeAsync('default.db', query, []);

  if (!res.rows?._array) {
    throw Error('Table has no row');
  }
  const output = parseSqlOutput(res.rows._array);
  if (!output) {
    throw Error('Database response is empty');
  }
  return output;
};

type Format = 'CSV' | 'XLSX' | 'SQLITE';

const isIos = Platform.OS === 'ios';

const shareFile = async (
  tableName: string | null,
  format: Format,
  path: string,
): Promise<void> => {
  try {
    const {success, message} = await Share.open({
      isNewTask: false, // opens the app in separate intent
      showAppsToView: true,
      // failOnCancel: false,
      url: `file://${path}`,
      title: `Share ${tableName} file via`,
      message: isIos
        ? undefined
        : `Check out this ${format} ${
            tableName ?? 'database'
          } file, which I exported from SQL Play App.`,
    });
    if (success) {
      showSuccessNotif('File shared successfully!');
    }
    analytics().logEvent('shared', {success, message, format});
  } catch (err) {
    analytics().logEvent('shared', {
      format,
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export const getAllTablesName = async () => {
  const query =
    "SELECT name FROM pragma_table_list WHERE NOT name LIKE 'sqlite%'";
  const {rows} = await runQuery(query);
  return rows.map(row => row[0]);
};

const showAlert = (tableName: string | null, format: Format, path: string) => {
  if (isIos) {
    shareFile(tableName, format, path);
    return;
  }
  Alert.alert(
    `Yay! ${
      tableName ? capitalizeWord(tableName) : 'Database'
    } exported in ${format}.`,
    'You can now access it from your downloads folder.\nWanna share to other apps?',
    [
      {text: "No, I'm done", style: 'cancel'},
      {
        text: 'Yes, share',
        onPress: () => shareFile(tableName, format, path),
      },
    ],
    {
      cancelable: true,
      onDismiss: () => {
        analytics().logEvent('didnot_share');
      },
    },
  );
};

export const exportXlsx = async (tableName: string) => {
  try {
    const query = `SELECT * from ${tableName}`;
    const {rows, header} = await runQuery(query);
    const headerSheet: TCell[] = header.map(row => {
      return {value: (row as string) ?? 'unknown', type: 'string'};
    });

    const rowsSheet: TCell[][] = rows.map(row => {
      return row.map(cell => {
        return {value: (cell as string) ?? 'unknown', type: 'string'};
      });
    });

    const combinedSheet: TCell[][] = [headerSheet, ...rowsSheet];
    const path = await createXlsx(combinedSheet, tableName);
    showAlert(tableName, 'XLSX', path);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    showErrorNotif('Failed to export XLSX', errMsg);
  }
};

export const exportCSV = async (tableName: string) => {
  try {
    /** Fetch rows from database and make it csv */
    const res = await QuickSQLite.executeAsync(
      'default.db',
      `SELECT * from ${tableName}`,
      [],
    );
    const len = res?.rows?.length;
    // console.log(res.rows);
    if (!len) {
      return null;
    }
    if (!res?.rows) {
      throw Error('Got no rows from DB');
    }

    const {header, rows} = parseSqlOutput(res.rows._array);
    const tableData = [header, ...rows];

    // console.log(tableData);

    const csvArray: string[] = [];
    tableData.forEach(_row => {
      const row = _row.map(cell => {
        if (cell && isNaN(+cell) && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      });
      const line = row.join(',');
      csvArray.push(line);
    });

    const csvString = csvArray.join('\n');

    /** Path of saving the csv file */
    const path = `${Dirs.CacheDir}/${tableName}_${Date.now()}.csv`;
    await FileSystem.writeFile(path, csvString, 'utf8');
    // only copy in Android
    if (!isIos) {
      await FileSystem.cpExternal(path, `${tableName}.csv`, 'downloads');
    }
    showAlert(tableName, 'CSV', path);
    // console.log(csvString);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    showErrorNotif('Failed to export CSV', errMsg);
  }
};

export const exportDb = async () => {
  try {
    const path = `${Dirs.DocumentDir}/default.db`;

    // only copy in Android
    if (!isIos) {
      await FileSystem.cpExternal(path, `sqlplay_db.sqlite`, 'downloads');
    }
    showAlert(null, 'SQLITE', 'downloads/sqlplay_db.sqlite');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    showErrorNotif('Failed to export database file', errMsg);
  }
};
