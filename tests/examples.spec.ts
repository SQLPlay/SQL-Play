import Database from 'better-sqlite3';
const db = new Database(':memory:');

import {describe, test, expect} from 'vitest';
import commands from '../src/data/commands.json';

commands.forEach(cmd => {
  const examples = cmd.example;

  if (!examples) {
    return;
  }

  examples.forEach(example => {
    test(`Running ${cmd.title} examples`, () => {
      const statement = db.prepare(example);

      const res = statement.run();
      expect(res.changes).toBeTypeOf('number');
    });
  });
});
