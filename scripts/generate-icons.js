const {writeFileSync} = require('fs');
const fg = require('fast-glob');
const {resolve} = require('path');

const svgDir = './src/assets/icons/';

const outputDir = './src/component/Icons/';
const svgs = fg.sync('*.svg', {cwd: resolve(process.cwd(), svgDir)});

//converts some_icon -> SomeIcon
function humanize(str) {
  let i,
    frags = str.split('-');
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join('');
}

let code = '';

const iconNames = new Set();
const componentList = new Set();

svgs.forEach(path => {
  const filename = path.split('.')[0].toLowerCase();
  const componentName = humanize(filename);
  componentList.add(componentName);

  // just keep the first name
  // const name = filename.replace(/_(dark|light).*/gm, '');

  iconNames.add(filename);

  code += `import ${componentName} from '../../assets/icons/${path}';\n`;
});

// console.log(iconNames);

code += `
export {
  ${[...componentList].join(',\n  ')},
};
`;

const types = `export type IconNames =
  | '${[...componentList].join("'\n  | '")}';
`;

writeFileSync(resolve(process.cwd(), outputDir + 'SVGIconList.tsx'), code);
// writeFileSync(resolve(__dirname, outputDir + 'SVGIconNames.ts'), types);

console.log('Generated components and types');
