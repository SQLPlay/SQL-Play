import {Picker} from '@react-native-picker/picker';
import {
  View,
  Text,
  Pressable,
  PressableProps,
  Platform,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import React, {
  ElementType,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {exportCSV, exportDb, exportXlsx, getAllTablesName} from '~/utils/db';
import PrimaryButton from '~/component/Button/PrimaryButton';

import _IonIcon from 'react-native-vector-icons/Ionicons';

const IonIcon = _IonIcon as ElementType;

import {Theme, useTheme} from '@react-navigation/native';

import {useFloating, shift, autoPlacement} from '@floating-ui/react-native';

import RNReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';

type Format = {title: string; description: string; icon: string};
const formats: Format[] = [
  {
    title: 'CSV',
    icon: 'grid-outline',
    description:
      'Text file with comma separated values, universally supported.',
  },
  {
    title: 'XLSX',
    icon: 'duplicate-outline',
    description: 'MS Excel file, works with Google Sheets, Calc, Numbers etc.',
  },
  {
    icon: 'server-outline',
    title: 'SQLite File',
    description: 'RAW database file (.sqlite) with all the tables and schema.',
  },
];

type SelectItemProps = PressableProps & {
  colors: Theme['colors'];
  format: Format;
  isSelected: boolean;
  isLast: boolean;
};

const SelectItem = ({
  colors,
  format,
  isSelected,
  isLast,
  ...props
}: SelectItemProps) => {
  return (
    <Pressable {...props} aria-checked={isSelected}>
      <View className="flex-row items-center pt-2 pl-3">
        <IonIcon name={format.icon} size={24} color={colors.primary} />
        <View
          style={{borderBottomWidth: isLast ? 0 : 1}}
          className="ml-3 pb-2 flex-row items-center border-gray-600/30 flex-1">
          <View className="flex-1 pr-2" collapsable={false}>
            <Text className="text-black dark:text-gray-100 text-[16px]">
              {format.title}
            </Text>
            <Text>{format.description}</Text>
          </View>
          <IonIcon
            style={{marginRight: 12, opacity: isSelected ? 1 : 0}}
            name="checkmark-sharp"
            size={24}
            color={colors.primary}
          />
        </View>
      </View>
    </Pressable>
  );
};

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const layoutAnimConfig = {
  duration: 300,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleX,
  },
  delete: {
    duration: 100,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Export'>;
const Export = ({navigation}: Props) => {
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState(tableNames[0]);
  const [selectedFormatIdx, setSelectedFormatIdx] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {colors} = useTheme();
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);

  useEffect(() => {
    setIsLoading(false);
    getAllTablesName().then(names => setTableNames(names ?? []));
  }, []);

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(layoutAnimConfig);
  }, [selectedFormatIdx]);

  const handleExport = async () => {
    if (!hasPro) {
      navigation.navigate('Purchase');
      return;
    }

    setIsLoading(true);

    switch (selectedFormatIdx) {
      case 0: // CSV
        await exportCSV(selectedTable);
        break;
      case 1: // XLSX
        await exportXlsx(selectedTable);
        break;
      case 2: // .SQLite
        await exportDb();
    }
    setIsLoading(false);
  };

  const hasSelectedSqlite = selectedFormatIdx === 2;

  return (
    <View className="flex-1 m-4">
      <View collapsable={false}>
        <Text className="text-sm">Select format</Text>
      </View>
      <View
        style={{backgroundColor: colors.card}}
        className="rounded-xl py-1 my-2">
        {formats.map((format, idx) => (
          <SelectItem
            colors={colors}
            onPress={() => {
              setSelectedFormatIdx(idx);
              RNReactNativeHapticFeedback.trigger(
                HapticFeedbackTypes.effectTick,
              );
            }}
            format={format}
            isSelected={idx === selectedFormatIdx}
            isLast={idx + 1 == formats.length}
            key={format.title}
          />
        ))}
      </View>
      {hasSelectedSqlite ? null : (
        <>
          <Text className="">Select your table</Text>
          <Picker
            selectedValue={selectedTable}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTable(itemValue)
            }>
            {tableNames.map(name => (
              <Picker.Item label={name} value={name} key={name} />
            ))}
          </Picker>
        </>
      )}

      <PrimaryButton
        onPress={handleExport}
        isLoading={isLoading}
        title={`Export ${hasSelectedSqlite ? 'Database' : 'Table'}`}
      />
    </View>
  );
};

export default Export;
