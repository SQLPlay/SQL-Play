#!/bin/bun

import chokidar from 'chokidar';

function pascalCase(str: string) {
  const frags = str.split('-');
  frags.forEach((frag, idx) => {
    frags[idx] = frag.charAt(0).toUpperCase() + frag.slice(1);
  });
  return `${frags.join('')}Md`;
}

const argv = process.argv;
const mdPath = argv.at(-1);

if (!mdPath) {
  throw 'File path is not passed';
}

const convertMd2Js = async (path: string) => {
  const mdFile = await Bun.file(path).text();
  const jsPath = mdPath.replace('.md', '.js');

  const fileName = path.split('/').at(-1)?.replace('.md', '');
  if (!fileName) {
    throw 'Unable to parse filename';
  }
  const funcName = pascalCase(fileName);

  const jsMdFn = `export default ${funcName} = \`${mdFile.replaceAll(
    '`',
    '\\`',
  )}\``;
  await Bun.write(jsPath, jsMdFn);
};

convertMd2Js(mdPath);

const watcher = chokidar.watch(mdPath).on('change', path => {
  convertMd2Js(mdPath);
});

process.on('SIGINT', () => {
  // close watcher when Ctrl-C is pressed
  console.log('\nClosing watcher...');
  watcher.close();

  process.exit(0);
});
