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
  ComponentProps,
  ElementType,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {exportCSV, exportDb, exportXlsx, getAllTablesName} from '~/utils/db';
import PrimaryButton from '~/component/Button/PrimaryButton';

import IonIcon from '@react-native-vector-icons/ionicons';
import MIcon from '@react-native-vector-icons/material-icons';

import {Theme, useTheme} from '@react-navigation/native';

// import {useFloating, shift, autoPlacement} from '@floating-ui/react-native';

import RNReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {secureStore} from '~/store/mmkv';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '~/types/nav';
import {isIos} from '~/utils/platform';

type Format = {
  title: string;
  description: string;
  iosIcon: ComponentProps<typeof IonIcon>['name'];
  androidIcon: ComponentProps<typeof MIcon>['name'];
};
const formats: Format[] = [
  {
    title: 'CSV',
    description: 'Tabular data in a text file, most compatible.',
    iosIcon: 'grid-outline',
    androidIcon: 'table-view',
  },
  {
    title: 'XLSX',
    description: 'Excel file, works with Sheets, Numbers etc.',
    iosIcon: 'duplicate-outline',
    androidIcon: 'description',
  },
  {
    title: 'SQLite File',
    description: 'RAW database file (.sqlite) for advance users.',
    iosIcon: 'server-outline',
    androidIcon: 'storage',
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
        {isIos ? (
          <IonIcon
            name={format.iosIcon}
            style={{paddingHorizontal: 10}}
            size={24}
            color={colors.primary}
          />
        ) : (
          <MIcon
            name={format.androidIcon}
            style={{paddingHorizontal: 10}}
            size={24}
            color={colors.primary}
          />
        )}
        <View
          style={{borderBottomWidth: isLast ? 0 : 1}}
          className="ml-3 pb-2 flex-row items-center border-gray-600/30 flex-1">
          <View className="flex-1 pr-2" collapsable={false}>
            <Text className="text-black dark:text-gray-100 text-[16px]">
              {format.title}
            </Text>
            <Text className="text-gray-700 text-sm dark:text-gray-300">
              {format.description}
            </Text>
          </View>
          {isIos ? (
            <IonIcon
              style={{marginRight: 12, opacity: isSelected ? 1 : 0}}
              name="checkmark-sharp"
              size={24}
              color={colors.primary}
            />
          ) : (
            <MIcon
              style={{marginRight: 12, opacity: isSelected ? 1 : 0}}
              name="check"
              size={24}
              color={colors.primary}
            />
          )}
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
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedFormatIdx, setSelectedFormatIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {colors} = useTheme();
  const [hasPro] = useMMKVStorage('hasPro', secureStore, false);

  useEffect(() => {
    setIsLoading(false);
    getAllTablesName().then(names => {
      setTableNames(names ?? []);
      if (!names) return;
      setSelectedTable(names[0]);
    });
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
    <View className="mx-auto flex-1 w-full p-4 max-w-xl">
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
          <Text className="dark:text-gray-100">Select your table</Text>
          <Picker
            selectedValue={selectedTable}
            itemStyle={{color: colors.text}}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTable(itemValue)
            }>
            {tableNames.map(name => (
              <Picker.Item
                color={colors.text}
                label={name}
                value={name}
                key={name}
              />
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
