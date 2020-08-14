import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({name: 'prepop.db', createFromLocation: 1});

//query execution function with promise
export const ExecuteQuery = (sql, params = []) => {
  sql.replace(/^;/, ''); // remove any semicolon and add limit of 150
  const formattedSQL = `${sql} limit 150`;

  return new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(
        formattedSQL,
        params,
        (tx, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        },
      );
    });
  });
};

//add functions for basic value and string storage
const createAppDataTable = async () => {
  await ExecuteQuery(
    `CREATE TABLE IF NOT EXISTS appData(id String Primary KEY, value string);`,
  );
};

// setAppDataVal
export const setAppData = async (id, val) => {
  return await ExecuteQuery(
    `INSERT OR REPLACE INTO appData(id, value) VALUES ("${id}", "${val}");`,
  );
};

// this will get the string data
export const getAppData = async (id) => {
  // destructre it
  const res = await ExecuteQuery(
    `SELECT value from appData where id = "${id}"`,
  );

  //if array is empty it means there is no data
  if (res.rows.length !== 0) {
    return res.rows.item(0).value;
  } else {
    return null ;
  }
};

createAppDataTable();
