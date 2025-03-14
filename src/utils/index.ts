import {historyStore} from '~/store/mmkv';

export const getLast20Commands = async () => {
  const commandsWithKey =
    (await historyStore.indexer.strings.getAll()) as string[][];

  const commands: string[] = [];

  for (let i = 0; i < commandsWithKey.length; i++) {
    commands.push(commandsWithKey[i][1]);
    if (i >= 19) break;
  }

  return commands;
};
