import { View, Platform, StatusBar, Text, Image, SafeAreaView, FlatList, Modal, TouchableOpacity, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native';

//Scripts
import styles from '../styles';
import { deleteContent } from '../downloadProcess';

import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function Downloads({navigation}) {

  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [downloads, setDownloads] = useState([]);
  const [viewItem, setViewItem] = useState(false);
  const [details, setDetails] = useState([]);

  const search = (text) => {
    // console.log(text);
    setSearchText(text);
  }

  const setNewDetails = (items) => {
    if (details.length > 0) {
        setDetails([]);
    }
    const newDetails = [...details, items];
    setDetails(newDetails);
    setViewItem(true);
  }
  const removeItem = (folderTitle, title) => {
    // console.log(downloads);
    // const updatedItems = downloads.filter(item => (item.folderTitle !== folderTitle && item.title !== title));
    // setDownloads(updatedItems);
    // console.log(updatedItems)
    let index;
    for (let i = 0; i < downloads.length; i++) {
      if(downloads[i].title === title && downloads[i].folderTitle === folderTitle) {
        index = i;
        break;
      }
    }
    const prevTextList = [...downloads];
    prevTextList.splice(index, 1);
    setDownloads(prevTextList);
  };


  const searchDisplayVideo = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10, width:'100%'}}>
          <View style={{width:100, height:100}}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10}}
              source={require('../../Pictures/testImage.png')}/>
          </View>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.title}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.downloadDate}</Text>
          </View>
          <View style={{width:50, height:'100%', right:'3%', position :'absolute', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => [deleteContent(item), removeItem(item.folderTitle, item.title)]}>
              <MaterialCommunityIcons name="delete" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const searchDisplayText = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10, width:'100%'}}>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.title}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.downloadDate}</Text>
          </View>
          <View style={{width:50, height:'100%', right:'3%', position :'absolute', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => [deleteContent(item), removeItem(item.folderTitle, item.title)]}>
              <MaterialCommunityIcons name="delete" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  const retrive = async() => {
    // await AsyncStorage.removeItem('downloads');
    const storedArrayString = await AsyncStorage.getItem('downloads');
    // console.log(storedArrayString)
    const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];
    setDownloads(storedArray);
  }

  useEffect(() => {
    if (isFocused) {
      retrive();
    }
  },[isFocused])

  return (
    <SafeAreaView style={[styles.screenContainer, {paddingBottom: 60}]}>
      <View style={styles.searchBarAndProfileContainer}>
        <View style={styles.searchBarContainer}>
          <Searchbar
            placeholder="Search..."
            onChangeText={(value_) => search(value_)}
            value={searchText}
          />
        </View>
      </View>

      <FlatList
        data={downloads}
        renderItem={
          ({ 
            item 
          }) => (searchText.length === 0 || item.title.toLowerCase().includes(searchText.toLowerCase())) && (
            item.type ==='text' ? (
              <TouchableOpacity onPress={()=> setNewDetails(item)}>
                {searchDisplayText(item)}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={()=> {navigation.navigate('VideoP', {uri: item.videoUri})}}>
                {searchDisplayVideo(item)}
              </TouchableOpacity>
            )
          )
        }
      />

      {
        downloads.length === 0 && (
          <View style={{
            justifyContent: 'center', 
            width: '100%', 
            height: '85%', 
            alignItems: 'center'}}>
            <FontAwesome name="download" size={150} color="black" />
            <Text>The is no Downloads available</Text>
          </View>
        )
      }

      <Modal
        animationType="slide"
        transparent={false}
        visible={viewItem}
        onRequestClose={() => {
          setViewItem(!viewItem);
          setDetails([]);
        }}>
          {
            details.length > 0 && (
              <ScrollView style={{padding: 40, height:'100%'}}>
                <View style={{alignItems: 'center', marginBottom:70}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>{details[0].title}</Text>
                  <Text>{details[0].scripture}</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity onPress={() => downloadText(details[0])}>
                    <Text style={{fontWeight: 'bold', fontSize: 15, fontStyle: 'italic', position :'absolute', bottom:0, elevation:0, width:'100%', height: 30, textAlign:'center', textAlignVertical:'center'}}>Download</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )
          }
      </Modal>
  
    </SafeAreaView>
  )
}