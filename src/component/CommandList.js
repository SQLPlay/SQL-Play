import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
  TouchableWithoutFeedback,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import {tomorrow} from 'react-syntax-highlighter/styles/hljs';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const ListItem = ({title, description, index, listData}) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  const onItemPress = (index) => {
    setCurrentIndex(index === currentIndex ? null : index);
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        150,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
  };
  return (
    <TouchableWithoutFeedback onPress={() => onItemPress(index)}>
      <View style={styles.item}>
        <View styles={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Icon
            name="arrow-drop-down"
            size={26}
            onPress={() => onItemPress(index)}
          />
        </View>

        <Text style={styles.description}>{description}</Text>
        <View style={styles.codeSyntaxContainer}>
          {index === currentIndex && (
            <SyntaxHighlighter
              fontSize={14}
              language="sql"
              wrapLines={true}
              style={tomorrow}
              wrapLines={true}
              highlighter="hljs">
              {listData[index].syntax}
            </SyntaxHighlighter>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function CommandList({listData}) {
  return (
    <FlatList
      data={listData}
      bounces={false}
      maxToRenderPerBatch={3}
      renderItem={({item, index}) => (
        <ListItem {...item} index={index} listData={listData} />
      )}
      initialNumToRender={2}
      windowSize={5}
      keyExtractor={(item) => item.id}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: '100%',
  },
  item: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between"
  },
  title: {
    fontSize: 18,
    borderWidth: 1,
  },
  description: {
    fontSize: 16,
  },

  codeSyntaxContainer: {
    marginTop: 10,
  },
});
