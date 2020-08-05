import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'prepop.db', createFromLocation : 1});

//query execution function with promise
export const ExecuteQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.transaction(trans => {
      trans.executeSql(
        sql,
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