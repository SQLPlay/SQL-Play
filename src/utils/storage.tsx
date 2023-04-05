// import {QuickSQLite} from 'react-native-quick-sqlite';
import SQLite, {ResultSet, SQLError} from 'react-native-sqlite-storage';
// import {Dirs, FileSystem} from 'react-native-file-access';

const errorCB = (err: SQLError) => {
  console.warn('SQL Error: ' + err);
};

const openCB = () => {
  console.log('Database OPENED');
};

// FileSystem.ls(`${Dirs.MainBundleDir}`).then(l => console.log(l));

const init = async () => {
  // await FileSystem.cp(
  //   `${Dirs.MainBundleDir}/www/prepop.db`,
  //   Dirs.DocumentDir + '/prepop.db',
  // ).catch(err => console.log(err));
  //
  // const stat = await FileSystem.statDir(Dirs.MainBundleDir);
  // stat.forEach(i => console.log(i.path));
  // const db = QuickSQLite.open('prepop.db', '../databases');
  // //
  // console.log('db', db);
  // //
  // const res = QuickSQLite.executeSql(
  //   'prepop.db',
  //   "SELECT * FROM sqlite_master WHERE type='table'",
  //   undefined,
  // );
  //
  // console.log(res.rows);
};

// init();
// if (!status) {
//   rows.forEach(row => {
//     console.log(row);
//   });
// }

const userDb = SQLite.openDatabase(
  {
    name: 'prepop.db',
    createFromLocation: 1,
    location: 'Library',
  },
  openCB,
  errorCB,
);

const appDb = SQLite.openDatabase(
  {
    name: 'app.db',
    location: 'Library',
  },
  openCB,
  errorCB,
);

//query execution function with promise
export const ExecuteUserQuery = (
  query: string,
  params = [],
  noLimit: boolean = false,
): Promise<ResultSet> => {
  query = query.replace(/;/g, ''); // remove any semicolon
  query = query.replace(/"/g, "'"); // replace double quotes with single

  if (query.search(/select/i) !== -1) {
    // if no limit then no need to add limit
    if (!noLimit) {
      query = `${query} limit 100`; //limit of 100 if there is a select
    }
  }

  return new Promise<ResultSet>((resolve, reject) => {
    userDb.transaction(trans => {
      trans.executeSql(
        query,
        params,
        (tx, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

//query execution function with promise
export const ExecuteAppQuery = (
  query: string,
  params = [],
): Promise<ResultSet> => {
  return new Promise<ResultSet>((resolve, reject) => {
    appDb.transaction(trans => {
      trans.executeSql(
        query,
        params,
        (tx, results) => {
          resolve(results);
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

//add functions for basic value and string storage
const createAppDataTable = async () => {
  await ExecuteAppQuery(
    'CREATE TABLE IF NOT EXISTS appData(id String Primary KEY, value string);',
  );
};

// setAppDataVal
export const setAppData = async (id: string, val: string | number) => {
  return await ExecuteAppQuery(
    `INSERT OR REPLACE INTO appData(id, value) VALUES ("${id}", "${val}");`,
  );
};

// this will get the string data
export const getAppData = async (id: string): Promise<string | null> => {
  // destructre it

  const res: ResultSet = await ExecuteAppQuery(
    `SELECT value from appData where id = "${id}"`,
  );

  //if array is empty it means there is no data
  if (res.rows.length !== 0) {
    return res.rows.item(0).value;
  } else {
    return null;
  }
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
  const res: ResultSet = await ExecuteAppQuery(
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
  const res: ResultSet = await ExecuteAppQuery(
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

createAppDataTable();

createUserCommandsTable();

// insertUserCommand('Select yoyo from empylohre');
