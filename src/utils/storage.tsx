// import {QuickSQLite} from 'react-native-quick-sqlite';
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
  /**

**/
  console.log('init db');
  // await FileSystem.unlink()
  // stat.forEach(i => console.log(i.path));
  SQLite.open('default.db');

  console.log('took:', performance.now() - time);
};

// if (!status) {
//   rows.forEach(row => {
//     console.log(row);
//   });
// }
//
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

//query execution function with promise
export const ExecuteAppQuery = (query: string, params = []) => {};

//add functions for basic value and string storage
const createAppDataTable = async () => {
  /* await ExecuteAppQuery(
    'CREATE TABLE IF NOT EXISTS appData(id String Primary KEY, value string);',
  ); */
};

// setAppDataVal
export const setAppData = async (id: string, val: string | number) => {
  /* return await ExecuteAppQuery(
    `INSERT OR REPLACE INTO appData(id, value) VALUES ("${id}", "${val}");`,
  ); */
};

// this will get the string data
export const getAppData = async (id: string): Promise<string | null> => {
  // destructre it
  /*
  const res = await ExecuteAppQuery(
    `SELECT value from appData where id = "${id}"`,
  );

  //if array is empty it means there is no data
  if (res.rows.length !== 0) {
    return res.rows.item(0).value;
  } else {
    return null;
  } */
};

//add functions for storing user commands
const createUserCommandsTable = async () => {
  console.log('creating table');

  await ExecuteAppQuery(
    `CREATE TABLE IF NOT EXISTS 
    userCommands(id INTEGER PRIMARY KEY AUTOINCREMENT, command String NOT NULL);`,
  );
};

export const insertUserCommand = async (val: string) => {
  return await ExecuteAppQuery(
    `INSERT INTO userCommands(command) VALUES ("${val}");`,
  );
};

// will be used for autocomplete
export const findUserCommands = async (val: string) => {
  const res = await ExecuteAppQuery(
    `SELECT * from userCommands 
    WHERE command LIKE "${val}%"
    ORDER BY id desc
    LIMIT 1
    `,
  );

  if (res.rows.length !== 0) {
    return res.rows.item(0).command;
  } else {
    return null;
  }
};

// will get the last command from user db
export const getLastUserCommand = async (offset: number) => {
  const res = await ExecuteAppQuery(
    `SELECT * from userCommands 
    ORDER BY id desc
    LIMIT 1
    OFFSET ${offset}
    `,
  );

  if (res.rows.length !== 0) {
    return res.rows.item(0).command;
  } else {
    return null;
  }
};

// createAppDataTable();

// createUserCommandsTable();

// insertUserCommand('Select yoyo from empylohre');
