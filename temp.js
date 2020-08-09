const data = [
  {
    title: 'CREATE TABLE',
    description: 'Define a new table',
    tag: 'Data Definition Language (DDL)',
    examples: ['CREATE TABLE kids'],
  },
  {
    title: 'ALTER TABLE',
    description: 'Modifies a table definition',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'CREATE VIEW',
    description: 'Define a new view',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'DROP TABLE',
    description: 'Define a new table',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'CREATE INDEX',
    description: 'Define a new table',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'DROP VIEW',
    description: 'Remove a view',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'TRUNCATE TABLE',
    description: 'Empty a table',
    tag: 'Data Definition Language (DDL)',
    examples: [''],
  },
  {
    title: 'SELECT',
    description: 'Retrieve rows from a table or view',
    tag: 'Data Manipulation Language (DML))',
    examples: [''],
  },
  {
    title: 'INSERT INTO',
    description: 'Create new rows in a table',
    tag: 'Data Manipulation Language (DML))',
    examples: [''],
  },
  {
    title: 'UPDATE',
    description: 'Update rows of a table',
    tag: 'Data Manipulation Language (DML))',
    examples: [''],
  },
  {
    title: 'DELETE',
    description: 'Delete rows of a table',
    tag: 'Data Manipulation Language (DML))',
    examples: [''],
  },
  {
    title: 'SELECT <columns> INTO',
    description: 'Create a new table from the results of a query',
    tag: 'Data Manipulation Language (DML))',
    examples: [''],
  },
  {
    title: 'WHERE',
    description:
      'To retrieve specific information from a table excluding other irrelevant data',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'AND',
    description: 'Select rows that must satisfy all the given conditions',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'OR',
    description: 'Select rows that satisfy atleast one of the given conditions',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'NOT',
    description: 'Select rows that do not satisfy the given condition',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'AS (alias)',
    description: 'To temporarily rename a table or a column heading',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'BETWEEN..AND..',
    description: 'To select values within a range',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'EXISTS',
    description:
      'Used in combination with a subquery and is considered to be met if the subquery returns at least one row',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'GROUP BY',
    description:
      'To collect data across multiple records and group the results by a column',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'HAVING',
    description: 'To filter data based on the group functions',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'IN',
    description: 'To test whether a value is in the list of values provided',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'LIKE',
    description: 'To search for a specified pattern in a column',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'DISTINCT',
    description: 'To return only distinct (different) values in a column',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'ORDER BY',
    description: 'To sort the records in the result based on a column',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'IS NULL',
    description: 'To test for a NULL value in a column',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'INNER JOIN',
    description: 'Returns all rows from both tables where there is a match',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'LEFT JOIN',
    description:
      'Returns all the rows from the first table even if there are no matches in the second table',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'RIGHT JOIN',
    description:
      'Returns all the rows from the second table, even if there are no matches in the first table',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'FULL JOIN',
    description:
      'Returns all rows from both tables with nulls in place where the join condition is not met',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'UNION',
    description:
      'Combines the result of two or more SELECT statements and selects only distinct values',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'UNION ALL',
    description:
      'Combines the result of two or more SELECT statements and also select duplicate values',
    tag: 'Arguments',
    examples: [''],
  },
  {
    title: 'AVG()',
    description: 'Returns the average value of a numeric column',
    tag: 'Aggregate Functions',
    examples: [''],
  },
  {
    title: 'COUNT()',
    description: 'Returns the number of rows that matches a specified criteria',
    tag: 'Aggregate Functions',
    examples: [''],
  },
  {
    title: 'MAX()',
    description: 'Returns the largest value of the selected column',
    tag: 'Aggregate Functions',
    examples: [''],
  },
  {
    title: 'MIN()',
    description: 'Returns the smallest value of the selected column',
    tag: 'Aggregate Functions',
    examples: [''],
  },
  {
    title: 'SUM()',
    description: 'Returns the total sum of a numeric column',
    tag: 'Aggregate Functions',
    examples: [''],
  },
  {
    title: 'NOT NULL',
    description: 'Enforces a column to not accept NULL values',
    tag: 'SQL Constraints',
    examples: [''],
  },
  {
    title: 'UNIQUE',
    description: 'Ensures that each row for a column must have a unique value',
    tag: 'SQL Constraints',
    examples: [''],
  },
  {
    title: 'PRIMARY KEY',
    description:
      'Combination of NOT NULL and UNIQUE.It uniquely identifies each record in a database table',
    tag: 'SQL Constraints',
    examples: [''],
  },
  {
    title: 'FOREIGN KEY',
    description:
      'Ensure the referential integrity of the data in one table to match values in another table',
    tag: 'SQL Constraints',
    examples: [''],
  },
  {
    title: 'DEFAULT',
    description: 'Specifies a default value for a column',
    tag: 'SQL Constraints',
    examples: [''],
  },
  {
    title: 'UCASE()',
    description: 'Converts a field to upper case',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'LCASE()',
    description: 'Converts a field to lower case',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'MID()',
    description: 'Extract characters from a text field',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'LEN()',
    description: 'Returns the length of a text field',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'ROUND()',
    description: 'Rounds a numeric field to the number of decimals specified',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'NOW()',
    description: 'Returns the current system date and time',
    tag: 'Scalar Functions',
    examples: [''],
  },
  {
    title: 'FORMAT()',
    description: 'Formats how a field is to be displayed',
    tag: 'Scalar Functions',
    examples: [''],
  },
];

function createUUID() {
  // http://www.ietf.org/rfc/rfc4122.txt
  var s = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '-';

  var uuid = s.join('');
  return uuid;
}

// const output = [];
// data.forEach((e) => {
//   output.push({...e, id: createUUID()});
// });

// console.log(JSON.stringify(output));

const filterData = () => {
  return data.filter((item) => {
    return item.title.indexOf("Define a new view") !== -1 || item.description.indexOf("Define a new view") !== -1;
  });
};

console.log(filterData())