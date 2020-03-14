import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, Animated, Easing } from 'react-native';
import { appendData, retrieveData } from './storage';
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { Routes } from './navigation';
import { DownItemFactory } from './models';

export default function GetItDown() {
  const { navigate } = useNavigation()

  const [newDownItem, updateNewDownItem] = useState('')
  const opacity = useRef(new Animated.Value(1)).current;

  const submitNewDownItem = (item: string) => {
    fadeOut()
    const downItem = DownItemFactory(item)
    appendData(downItem)
  }

  const handleSubmit = (e: any) => {
      submitNewDownItem(newDownItem)
  }

  const fadeOut = () => {
    Animated.timing(                  
      opacity,
      {
        toValue: 0,                   
        duration: 400,              
        useNativeDriver: true,
        easing: Easing.linear,
      }
    ).start(() => {
      updateNewDownItem('')
      Animated.timing(opacity, {toValue: 1, duration: 400, useNativeDriver: true}).start()
    });                        
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.container}
  keyboardShouldPersistTaps='handled'
>
  <Animated.View style={{opacity: opacity.interpolate({inputRange: [0, 1], outputRange: [0, 1]}) }}>
        <TextInput style={[styles.newDownItem]} onSubmitEditing={handleSubmit} placeholder="get it down..." enablesReturnKeyAutomatically autoFocus value={newDownItem} onChangeText={updateNewDownItem}></TextInput>
  </Animated.View>
</ScrollView>

        <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 50, right: 50}} style={styles.showDownItems} onPress={() => navigate(Routes.display)}><Text style={styles.showDownItemsText}>Show My Items</Text></TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newDownItem: {
    fontSize: 30,
    marginBottom: 80
  },
  showDownItems: {
    padding: 25,
    marginBottom: 15 
  },
  showDownItemsText: {
    fontSize: 18,
    color: 'grey'
  }
});
