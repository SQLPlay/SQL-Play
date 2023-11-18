import {Dirs, FileSystem} from 'react-native-file-access';
import {Buffer} from '@craftzdog/react-native-buffer';
//@ts-ignore
import zipcelx from 'zipcelx-on-steroids/lib/module/';

export type TCell = {
  value: string;
  type: string;
};

export const createXlsx = async (data: TCell[][], table_name: string) => {
  const buffer = (await zipcelx(
    {
      filename: 'general-ledger-Q1',
      sheet: {
        data,
      },
    },
    'blob',
  )) as Buffer;

  const path = Dirs.CacheDir + `/${table_name}_${Date.now()}.xlsx`;
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  const base64 = buffer.toString('base64');

  // const base64WithType = `data:${fileType};base64,${base64}`;

  await FileSystem.writeFile(path, base64, 'base64');
  await FileSystem.cpExternal(path, `${table_name}.xlsx`, 'downloads');
  return path;
};
