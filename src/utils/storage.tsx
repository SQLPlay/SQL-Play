// import {QuickSQLite} from 'react-native-quick-sqlite';
import {QuickSQLite as SQLite} from 'react-native-quick-sqlite';
import {Dirs, FileSystem} from 'react-native-file-access';

// Get the path to the assets folder

// FileSystem.ls(`${Dirs.MainBundleDir}`).then(l => console.log(l));

const init = async () => {
  // await FileSystem.cp(
  //   `${Dirs.MainBundleDir}/www/prepop.db`,
  //   Dirs.DocumentDir + '/prepop.db',
  // ).catch(err => console.log(err));
  //

  const assetList = await FileSystem.ls(Dirs.DocumentDir);
  console.log(assetList);
  const dbPath = `${Dirs.DocumentDir}/default.db`;
  const dbAlreadyInPlace = await FileSystem.exists(dbPath);
  if (!dbAlreadyInPlace) {
    await FileSystem.cpAsset('www/prepop.db', dbPath).catch(err =>
      console.log(err),
    );
  }

  // await FileSystem.unlink()
  // stat.forEach(i => console.log(i.path));
  SQLite.open('default.db');
};

init();
// if (!status) {
//   rows.forEach(row => {
//     console.log(row);
//   });
// }
//
const parseSqlOutput = (sqlData: unknown) => {
  if (!sqlData || !Array.isArray(sqlData) || sqlData.length === 0) {
    throw Error('SQL data output is not a non-empty array');
  }
  const headerRow = Object.keys(sqlData[0]);
  const dataRows = sqlData.map(row => Object.values(row).reverse());
  return {header: headerRow.reverse(), rows: dataRows as string[][]};
};

//query execution function with promise
export const ExecuteUserQuery = async (query: string) => {
  query = query.replace(/;/g, ''); // remove any semicolon
  query = query.replace(/"/g, "'"); // replace double quotes with single
  try {
    const res = await SQLite.executeAsync('default.db', query, undefined);
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
