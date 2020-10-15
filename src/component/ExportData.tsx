import React, { FC } from 'react'
import { PermissionsAndroid} from 'react-native'
import DialogInput from 'react-native-dialog-input';

//@ts-ignore
import Share from 'react-native-share'

import RNFS from 'react-native-fs'

import { requestExternalWritePermission } from '../utils/utils';

interface Props {
    modalState: boolean;
    setModalState: (val: boolean) => void;
  }

const ExportData: FC<Props> = ({modalState, setModalState}) => {

    const exportCSV = async (tName: string):Promise<void> => {
        const isGranted:boolean = await requestExternalWritePermission()
        if (!isGranted) {
          return
        }
        const path = `${RNFS.DownloadDirectoryPath}/${tName}.csv`;
        console.log(path);
        
        const data: string = `Year,Make,Model,Description,Price
        1997,Ford,E350,"ac, abs, moon",3000.00
        1999,Chevy,"Venture ""Extended Edition""","",4900.00
        1999,Chevy,"Venture ""Extended Edition, Very Large""",,5000.00
        1996,Jeep,Grand Cherokee,"MUST SELL!
        air, moon roof, loaded",4799.00`
        try {
          await RNFS.writeFile(path, data, 'utf8');
    
        const shareResponse = await Share.open({url: `file://${path}`, title: "Table Exported", message: "Please save it or share it"});
        } catch (error) {
           console.log(error.message);
        }
      
      }

    return (
        <DialogInput isDialogVisible={modalState}
            title={"Export Table"}
            message={"Type the table name"}
            hintInput ={"Employees"}
            submitText="Export"
            submitInput={exportCSV}
            closeDialog={() => setModalState(false)}>
        </DialogInput>
    )
}

export default ExportData

