## Is this even real?

SQL Play supports almost all the queries which **MySQL**, **Postgres** and **MS SQL** does.

You can perform all the operations like:

- Create a table
- Delete a table or records
- Modify table and it's rows
- Perform inner joins and left joins
- Export table as CSV (Pro)

## Limitations

> SQL Play uses SQLite database for running your queries, which has some limitations.

These are some of the major things which SQLite can't do right now:

- Users or passwords
- Roles for users
- Remote connection
- Plugins & extensions
- Limited data types
- Full outer joins

## Differences

Not all databases are born equal, so you need to make sure you are using the right syntax.

1. `SELECT DATETIME` is equivalent to `SELECT NOW`

| Column1 | Column2 | Column3 |
| ------- | ------- | ------- |
| Item1   | Item1   | Item1   |
