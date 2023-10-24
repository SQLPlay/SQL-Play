import {NativeModules} from 'react-native';
import {memoizeWithLimit} from 'sonic-memoize';
const {MeasureSizeModule} = NativeModules;

export const measureTextSize = (text: string, font = 'Roboto', size = 16) => {
  return MeasureSizeModule.measureSize(text, font, size) as Promise<number>;
};

const _calculateWidths = async (header: string[], rows?: string[][]) => {
  if (!rows || !rows.length) {
    throw Error('Empty rows received');
  }

  const headerWidths: number[] = [];
  for (let i = 0; i < header.length; i++) {
    let longestText = '';
    let maxWidth = 0;
    for (let j = 0; j < rows.length; j++) {
      const text = `${rows[j][i]}`;
      if (text && text.length > longestText.length) {
        longestText = text;
      }
    }
    const charWidth = await measureTextSize(longestText);
    const headerCharWidth = await measureTextSize(header[i]);
    maxWidth = Math.max(charWidth, headerCharWidth);
    console.log(longestText, header[i]);
    maxWidth = Math.min(maxWidth, 250);
    headerWidths.push(maxWidth + 50);
  }

  return headerWidths;
};

export const calculateWidths = memoizeWithLimit(_calculateWidths, 20);
