import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Button } from "react-native";
import { retrieveData, storeData } from "./storage";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routes } from "./navigation";
import { displayDate } from "./models";

export default function ShowMe() {
  const { navigate } = useNavigation();
  const [downItems, updateDownItems] = useState([]);
  const [refreshing, updateRefrehing] = useState(false);
  const [selectedIndex, updateSelectedIndex] = useState(undefined);

  useEffect(() => {
    showItems();
  }, []);

  const showItems = async () => {
    updateRefrehing(true);
    const retrievedDownItems = await retrieveData();
    updateDownItems(
      retrievedDownItems.map((item: any, index: number) => ({
        item,
        key: String(index)
      }))
    );
    updateRefrehing(false);
  };

  const itemActions = (item: any) => {
    console.log(item)
    updateSelectedIndex(item.index);
  };

  const removeItem = (deleteIndex: number) => {
    const newItems = downItems.filter((item, index) => index !== deleteIndex)
    updateDownItems(newItems)
    updateSelectedIndex(undefined)
    storeData(newItems)
  }

  const FlatListItem = props => {
    console.log(props);
    return (
      <View style={styles.itemBox}>
      <TouchableOpacity
        onPress={() => itemActions(props)}
      >
        <Text style={styles.item}>{props.item.item.value}</Text>
        <Text style={styles.date}>
          {displayDate(props.item.item.dateAdded)}
        </Text>
      </TouchableOpacity>
        {props.index === selectedIndex && (
          <TouchableOpacity style={styles.remove} onPress={() => removeItem(props.index)}><Text style={styles.removeText}>
            Remove</Text></TouchableOpacity>
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
  goBack: {
    padding: 25,
    marginBottom: 15
  },
  remove: {
    alignItems: 'center',
    backgroundColor: '#ea4235',
    padding: 10
  },
  removeText: {
    color: "white",
  },
  backText: {
    fontSize: 18,
    color: "grey"
  }
});
