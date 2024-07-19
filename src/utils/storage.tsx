import {QuickSQLite as SQLite} from 'react-native-quick-sqlite';
import {Dirs, FileSystem} from 'react-native-file-access';
import analytics from '@react-native-firebase/analytics';
import {showSuccessNotif} from './notif';
import {historyStore, storage} from '~/store/mmkv';
// Get the path to the assets folder

// FileSystem.ls(`${Dirs.MainBundleDir}`).then(l => console.log(l));

export const initDb = async () => {
  // await FileSystem.cp(
  //   `${Dirs.MainBundleDir}/www/prepop.db`,
  //   Dirs.DocumentDir + '/prepop.db',
  // ).catch(err => console.log(err));
  //

  // console.log(Dirs.MainBundleDir);
  // const assetList = await FileSystem.ls(`${Dirs.DocumentDir}`);
  // console.log(assetList);
  const time = performance.now();
  const dbPath = `${Dirs.DocumentDir}/default.db`;
  const dbAlreadyInPlace = await FileSystem.exists(dbPath);
  if (!dbAlreadyInPlace) {
    await FileSystem.cpAsset('www/prepop.db', dbPath).catch(err =>
      console.log(err),
    );
  }
  SQLite.open('default.db');
};

export const parseSqlOutput = (sqlData: unknown) => {
  if (!sqlData || !Array.isArray(sqlData) || sqlData.length === 0) {
    throw Error('SQL data output is not a non-empty array');
  }
  const headerRow = Object.keys(sqlData[0]);
  const dataRows = sqlData.map(row => Object.values(row).reverse());
  return {header: headerRow.reverse(), rows: dataRows as string[][]};
};

type Command =
  | 'SELECT'
  | 'INSERT'
  | 'UPDATE'
  | 'DELETE'
  | 'CREATE'
  | 'ALTER'
  | 'DROP';

const sqlCommands = new Set([
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'PRAGMA',
]);

//query execution function with promise
export const executeDbQuery = async (query: string) => {
  query = query.trim();
  if (!query) return;

  const command = query.split(' ', 1)[0]?.toUpperCase() as Command;

  if (!command) return;
  if (!sqlCommands.has(command)) {
    throw Error(`\`${command}\` is not a SQL command.`);
  }

  // query = query.replace(/;/g, ''); // remove any semicolon
  query = query.replace(/"/g, "'"); // replace double quotes with single
  try {
    const startedAt = performance.now();
    const res = await SQLite.executeAsync('default.db', query, []);

    const key = `${Date.now()}`.slice(0, -3);
    historyStore.setStringAsync(key, query);

    const {rowsAffected} = res;
    switch (command) {
      case 'INSERT':
        showSuccessNotif(`${rowsAffected} row(s) inserted into table`);
        break;
      case 'DROP':
        showSuccessNotif('Table deleted from the database');
        break;
      case 'CREATE':
        showSuccessNotif('Table created in the database');
        break;
      case 'ALTER':
        showSuccessNotif('Updated table column(s)');
        break;
      case 'DELETE':
        showSuccessNotif(`${rowsAffected} row(s) deleted`);
        break;
      case 'UPDATE':
        showSuccessNotif(`${rowsAffected} row(s) updated`);
        break;
    }

    analytics().logEvent('executed_query', {
      command,
      query_length: query.length,
      executed_in: performance.now() - startedAt,
    });
    //
    const hasRows = Boolean(res.rows?.length);
    if (hasRows) {
      return parseSqlOutput(res.rows?._array);
    }
    return null;
  } catch (err) {
    let msg = 'Unkown error while executing the command.';
    if (err instanceof Error) {
      msg = err.message.replace('[react-native-quick-sqlite]', '').trim();
    }
    throw Error(msg);
  }
};
