import {$inputQuery} from '~/store/input';
import {calculateWidths} from './measureTextSize';
import {showErrorNotif, showSuccessNotif} from './notif';
import {ExecuteUserQuery} from './storage';
import {atom} from 'nanostores';

type TableDataNode = {
  header: Array<string>;
  rows: Array<Array<string>>;
};

export const $isLoading = atom(false);
export const $tableWidths = atom<Array<number>>([]);
export const $tableData = atom<TableDataNode>({
  header: [],
  rows: [[]],
});

export const runQuery = async () => {
  // setLoaderVisibility(true);
  // await insertUserCommand(inputValue); // store the command in db
  try {
    /** Show add if user is not premium */
    // if (!isPremium) {
    //   showAd();
    // }
    // execute the query
    const res = await ExecuteUserQuery($inputQuery.get());

    // console.log(res);
    if (!res?.rows || !res.header) {
      // setLoaderVisibility(false);
      showSuccessNotif(
        'Command Executed Successfully',
        'There was nothing  to show',
      );
      return;
    }

    const rowWidths = await calculateWidths(res?.header, res.rows);

    $tableWidths.set(rowWidths);
    $tableData.set(res);
    // pass the header and result arr to get the largest widths of their respective column
    // tableWidths.current = await getLargestWidths([header, ...rowsArr]);
    // console.log(([header, ...rowsArr]));

    // setLoaderVisibility(false);
    // console.log(rowsArr);

    // setTableData({header: header, rows: rowsArr});
  } catch (error) {
    if (error instanceof Error) {
      // setLoaderVisibility(false);
      console.log(error);
      showErrorNotif(error?.message);
    }
  }
};
