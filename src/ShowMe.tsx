import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, FlatList, Button } from "react-native";
import { retrieveData, storeData } from "./storage";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "./navigation";
import { displayDate } from "./models";

export default function ShowMe() {
  const { navigate } = useNavigation();
  const [downItems, updateDownItems] = useState([]);
  const [refreshing, updateRefrehing] = useState(false);
  const [selectedIndex, updateSelectedIndex] = useState(undefined);
  const [newTag, updateNewTag] = useState('');
  const flatList = useRef(null)

  useEffect(() => {
    showItems();
  }, []);

  const showItems = async () => {
    updateRefrehing(true);
    const retrievedDownItems = await retrieveData();
    updateDownItems(
      retrievedDownItems.map((item: any, index: number) => ({
        ...item,
        key: String(index)
      }))
    );
    updateRefrehing(false);
  };

  const itemActions = (item: any) => {
    updateSelectedIndex(item.index);
    if (downItems.length === item.index + 1) {
      flatList?.current?.scrollToEnd()
    }
  };

  const removeItem = (deleteIndex: number) => {
    const newItems = downItems.filter((item, index) => index !== deleteIndex);
    updateDownItems(newItems);
    updateSelectedIndex(undefined);
    storeData(newItems);
  };

  const tagItem = (tagIndex: number) => {
    const newItems = downItems.map((item, index) => index === tagIndex? ({...item, tag: newTag }): item);
    updateDownItems(newItems);
    updateSelectedIndex(undefined);
    storeData(newItems);
    updateNewTag('')
  };

  const FlatListItem = props => {
    return (
      <View style={styles.itemBox}>
        <TouchableOpacity onPress={() => itemActions(props)}>
          <Text style={styles.item}>{props.item.value}</Text>
          <Text style={styles.displayTag}>{props.item.tag}</Text>
          <Text style={styles.date}>
            {displayDate(props.item.dateAdded)}
          </Text>
        </TouchableOpacity>
        {props.index === selectedIndex && (
          <View>
          <TextInput style={styles.tagInput} onSubmitEditing={() => tagItem(selectedIndex)} placeholder="add a tag..." enablesReturnKeyAutomatically value={newTag} onChangeText={updateNewTag}></TextInput>
          {Boolean(newTag) && (
          <TouchableOpacity
            style={styles.tag}
            onPress={() => tagItem(props.index)}
          >
            <Text style={styles.tagText}>Tag</Text>
          </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.remove}
            onPress={() => removeItem(props.index)}
          >
            <Text style={styles.removeText}>Remove</Text>
          </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "grey"
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatList}
        refreshing={refreshing}
        data={downItems}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={FlatListItem}
      />

      <TouchableOpacity
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }}
        style={styles.goBack}
        onPress={() => navigate(Routes.add)}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50
  },
  itemBox: {
    marginVertical: 3,
    paddingVertical: 9,
    paddingHorizontal: 5,
    minWidth: 300
  },
  item: {
    fontSize: 20
  },
  date: {
    fontSize: 14,
    color: "grey"
  },
  displayTag: {
    fontSize: 14,
    color: "green"
  },
  tagInput: {
    fontSize: 20,
    marginVertical: 20
  },
  goBack: {
    padding: 25,
    marginBottom: 15
  },
  remove: {
    alignItems: "center",
    backgroundColor: "#ea4235",
    padding: 10
  },
  removeText: {
    color: "white"
  },
  tag: {
    alignItems: "center",
    backgroundColor: "#1a73e8",
    padding: 10,
    marginVertical: 5
  },
  tagText: {
    color: "white"
  },
  backText: {
    fontSize: 18,
    color: "grey"
  }
});
