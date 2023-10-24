import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Markdown, {MarkdownProps} from 'react-native-marked';
import SupportedQueryMd from '../../md-pages/supported-query';

const mdStyle: MarkdownProps['styles'] = {
  h2: {
    fontSize: 19,
    lineHeight: 24,
    marginTop: 14,
  },
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
export default function SupportedQuery() {
  return (
    <View style={{padding: 8, backgroundColor: '#fff'}}>
      <Markdown styles={mdStyle} value={SupportedQueryMd} />
    </View>
  );
}

const styles = StyleSheet.create({});
