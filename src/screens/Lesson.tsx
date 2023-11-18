import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  Vibration,
  View,
} from 'react-native';
import React, {ReactNode} from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Lesson'>;

class CustomRenderer extends Renderer implements RendererInterface {
  constructor() {
    super();
  }
  codespan(text: string, _styles?: TextStyle): ReactNode {
    return (
      <Text
        key={this.getKey()}
        className="text-gray-700 font-bold"
        style={{fontFamily: 'monospace'}}>
        `{text}`
      </Text>
    );
  }
  //@ts-ignore
  code(text: string, _styles?: TextStyle): ReactNode {
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
        }}>
        <CodeHighlighter
          key={this.getKey()}
          wrapLongLines={true}
          scrollViewProps={{
            contentContainerStyle: {
              flex: 1,
              paddingVertical: 4,
              paddingHorizontal: 6,
              marginBottom: 8,
            },
          }}
          hljsStyle={defaultStyle}
          textStyle={{fontFamily: 'monospace'}}
          language="sql">
          {text}
        </CodeHighlighter>
      </Pressable>
    );
  }
}

const renderer = new CustomRenderer();

const Lesson = ({navigation, route}: Props) => {
  const {path, title} = route.params;

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
        styles={mdStyle}
        //@ts-ignore
        renderer={renderer}
        value={`# ${title}\n${data}`}
      />
    </View>
  );
};

export default Lesson;

const styles = StyleSheet.create({});
