import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {ReactNode, useRef, useState} from 'react';
import Markdown, {
  MarkdownProps,
  Renderer,
  RendererInterface,
} from 'react-native-marked';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {RootStackParamList} from '~/types/nav';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CodeHighlighter from 'react-native-code-highlighter';
import {useGetLessonMd} from '~/api/lessons-api';
import {
  vs2015,
  defaultStyle,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Clipboard from '@react-native-clipboard/clipboard';
import {$inputQuery} from '~/store/input';
import {showSuccessNotif} from '~/utils/notif';
import {useTheme} from '@react-navigation/native';

const mdStyle: MarkdownProps['styles'] = {
  text: {
    textAlignVertical: 'center',
  },
  h1: {
    fontSize: 22,
  },
  h2: {
    fontSize: 19,
    lineHeight: 24,
    marginTop: 14,
  },
  h3: {
    fontSize: 18,
  },
  paragraph: {},
  codespan: {
    fontStyle: 'normal',
    backgroundColor: '#0000000f',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    // fontWeight: 'bold',
    fontFamily: 'monospace',
  },
};

const AutoHeightImage = ({uri}: {uri: string}) => {
  const [height, setHeight] = useState(0);
  return (
    <Image
      style={{flex: 1, width: '100%', minHeight: 100, height}}
      source={{uri: uri}}
      onLoad={({
        nativeEvent: {
          source: {width, height},
        },
      }) => setHeight(height)}
      resizeMode="contain"
    />
  );
};

class CustomRenderer extends Renderer implements RendererInterface {
  constructor() {
    super();
  }

  codespan(text: string, _styles?: TextStyle): ReactNode {
    return (
      <Text
        key={this.getKey()}
        className="text-gray-700 dark:text-gray-200 font-bold"
        style={{fontFamily: 'monospace'}}>
        `{text}`
      </Text>
    );
  }
  // image(uri: string, _alt?: string, _style?: ImageStyle): ReactNode {
  //   return <AutoHeightImage uri={uri} key={this.getKey()} />;
  // }
  //@ts-ignore
  code(
    text: string,
    _styles: TextStyle,
    _containerStyle: ViewStyle,
  ): ReactNode {
    return (
      <Pressable
        onLongPress={() => {
          Clipboard.setString(text);
          showSuccessNotif('Code copied to clipboard');
        }}
        onPress={() => {
          $inputQuery.set(text);
          ReactNativeHapticFeedback.trigger('impactMedium');
          showSuccessNotif('Code copied in editor');
        }}
        style={{paddingBottom: 8}}>
        <CodeHighlighter
          key={this.getKey()}
          wrapLongLines={true}
          scrollViewProps={{
            contentContainerStyle: {
              flex: 1,
              paddingVertical: 4,
              paddingHorizontal: 6,
              backgroundColor: _containerStyle.backgroundColor,
              // marginBottom: 8,
            },
          }}
          hljsStyle={
            _containerStyle?.backgroundColor === 'rgb(18, 18, 18)'
              ? vs2015
              : defaultStyle
          }
          textStyle={{fontFamily: 'monospace'}}
          language="sql">
          {text}
        </CodeHighlighter>
      </Pressable>
    );
  }
}

const renderer = new CustomRenderer();

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Lesson' | 'SupportedQuery'
>;
const Lesson = ({navigation, route}: Props) => {
  const {path, title} = route.params;

  const {colors} = useTheme();

  const {data, isLoading} = useGetLessonMd(path);
  if (isLoading || !data) {
    return <ActivityIndicator size="large" color="#000" />;
  }
  return (
    <View style={{backgroundColor: '#fff'}}>
      <Markdown
        flatListProps={{
          contentContainerStyle: {marginHorizontal: 10, paddingBottom: 20},
        }}
        styles={{...mdStyle, code: {backgroundColor: colors.card}}}
        //@ts-ignore
        renderer={renderer}
        value={`# ${title}\n${data}`}
      />
    </View>
  );
};

export default Lesson;

const styles = StyleSheet.create({});
