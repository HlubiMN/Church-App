import { 
  View, 
  Platform, 
  StatusBar, 
  Text, 
  ScrollView, 
  Image, 
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Button,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking} from 'react-native'
import React, {useEffect, useState} from 'react';
import { Searchbar } from 'react-native-paper';
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { getDatabase, ref as databaseRef, get, child } from 'firebase/database';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase, s } from '../config';

//icons

// Scripts
import styles from '../styles';
import { displayText,displayVideo,searchDisplayText,searchDisplayVideo } from '../display';
import { downloadText, loadHistory } from '../downloadProcess';

export default function MainPage({ navigation }) {
  
  // Variables for the page
  const [searchText, setSearchText] = useState('');
  const [contentList, setContentList] = useState([]);
  const [details, setDetails] = useState([]);
  const [viewImage, setViewImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getAllFolders = async () => {
    const storage = getStorage();
    const listRef = ref(storage, '');
    try {
      const res = await listAll(listRef);
      return res.prefixes.map((folderRef) => ({
        folderTitle: folderRef._location.path_,
        containers: []
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getAllVideoItems = async (folders) => {
    const storage = getStorage();
    const updatedFolders = await Promise.all(folders.map(async (folder) => {
      const listRef = ref(storage, folder.folderTitle);
      try {
        const res = await listAll(listRef);
        const videoItems = await Promise.all(res.prefixes.map(async (folderRef) => {
          return {
            path: folderRef._location.path_,
            title: folderRef._location.path_.split("/").pop(),
            type: 'video',
            imageUri: '',
            trailerUri: '',
            videoUri: '',
            date:0
          };
        }));
        return { ...folder, containers: [...folder.containers, ...videoItems] };
      } catch (error) {
        console.error(error);
        return folder;
      }
    }));
    return updatedFolders;
  };

  const getAllUri = async (folders) => {
    const storage = getStorage();
    const updatedFolders = await Promise.all(folders.map(async (folder) => {
      const updatedContainers = await Promise.all(folder.containers.map(async (container) => {
        const listRef = ref(storage, container.path);
        try {
          const res = await listAll(listRef);
          await Promise.all(res.items.map(async (item) => {
            const url = await getDownloadURL(item);
            if (isImage(item.name)) {
              container.imageUri = url;
            } else if (item.name.toLocaleLowerCase() === 'trailer.mp4') {
              container.trailerUri = url;
            } else {
              container.videoUri = url;
            }
          }));
          return container;
        } catch (error) {
          console.error(error);
          return container;
        }
      }));
      return { ...folder, containers: updatedContainers };
    }));
    return updatedFolders;
  };


  const isImage = (itemName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Add more extensions if needed
    const extension = itemName.substring(itemName.lastIndexOf(".")).toLowerCase();
    return imageExtensions.includes(extension);
  };

  const getFileMetadata = async (folder) => {
    const storage = getStorage()
    
    const updatedFolders = await Promise.all(folder.map(async (folder) => {
      const updatedContainers = await Promise.all(folder.containers.map(async (container) => {
        const listRef = ref(storage, container.path);
        try {
          const res = await listAll(listRef);
          await Promise.all(res.items.map(async (item) => {
            const metadata = await getMetadata(item);
            const meta = metadata.timeCreated.split('-');
            meta[meta.length - 1] = meta[meta.length - 1].split('T')[0];
            container.date = parseInt(meta[0]+meta[1]+meta[2]);
          }));
          return container;
        } catch (error) {
          console.error(error);
          return container;
        }
      }));
      return { ...folder, containers: updatedContainers };
    }));
    return updatedFolders;
    
  }

  const getAllText = async (folders) => {
    const dbRef = databaseRef(getDatabase());
    try {
      const snapshot = await get(child(dbRef, `/`));
      // let church_Donations = []
      if (snapshot.exists()) {
        snapshot.forEach((folderSnap) => {
          const folderTitle = folderSnap.key;
          folderSnap.forEach((itemSnap) => {
            const data = itemSnap.val();
            const folderIndex = folders.findIndex(fold => fold.folderTitle === folderTitle);
            if (folderIndex !== -1) {
              const newText = {
                type: 'text',
                title: data.title,
                scripture: data.scripture,
                date: data.date
              };

              // console.log(newText)
              folders[folderIndex].containers.push(newText);
            } 
            else if (folderIndex === -1) {
              folders.push({
                folderTitle,
                containers: [{
                  type: 'text',
                  title: data.title,
                  scripture: data.scripture
                }]
              });
              console.log('hhhh')
            }
          });
        });
        // await AsyncStorage.setItem('donations', JSON.stringify(church_Donations));
      } 
      else {
        console.log("No data available");
      }
    } catch (error) {
        console.error(error);
    }
    return folders;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const fetchData = async () => {
      try {
        const folders = await getAllFolders();
        const foldersWithVideos = await getAllVideoItems(folders);
        const foldersWithUri = await getAllUri(foldersWithVideos);
        const finalPaths = await getAllText(foldersWithUri);
        setContentList(finalPaths);
        setRefreshing(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const folders = await getAllFolders();
        const foldersWithVideos = await getAllVideoItems(folders);
        const foldersWithUri = await getAllUri(foldersWithVideos);
        // getFileMetadata(foldersWithUri)
        const finalPaths = await getAllText(foldersWithUri);
        // console.log(finalPaths)
        setContentList(finalPaths);
        setLoading(false)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
    
  }, []);


  const setNewDetails = (items, folderTitle) => {
    if (details.length > 0) {
        setDetails([]);
    }
    const newDetails = [...details, items, folderTitle];
    setDetails(newDetails);
    loadHistory(items, folderTitle);
    setViewImage(true);
  }

  const search = (text) => {
    setSearchText(text);
  };

  const textDisplayModal = () => {
    return(
      <ScrollView style={{padding: 40, height:'100%'}}>
        <View style={{alignItems: 'center', marginBottom:70}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>{details[0].title}</Text>
          <Text>{details[0].scripture}</Text>
        </View>
        <View style={{}}>
          <TouchableOpacity onPress={() => [setViewImage(false), setDetails([]), downloadText(details[0])]}>
            <Text style={{fontWeight: 'bold', fontSize: 15, fontStyle: 'italic', position :'absolute', bottom:0, elevation:0, width:'100%', height: 30, textAlign:'center', textAlignVertical:'center'}}>Download</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }
  const videoDisplayModal = (image) => {
    return(
      <TouchableOpacity onPress={() => [setViewImage(false), setDetails([]), navigation.navigate('VideoOptions', {details: details})]}>
        <Image
          style={{width:'100%',height: '100%'}}
          source={{uri: image}}/>
          
        <View style={styles.overlayingContainer}> 
          <Button title='continue' onPress={() => [setViewImage(false), setDetails([]), navigation.navigate('VideoOptions', {details: details})]} color="#003020" />
        </View>
      </TouchableOpacity>
    )
  }

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
      {
        loading && (
          <View style={{width:'100%', height:'100%', justifyContent:'center'}}>
            <ActivityIndicator size='large' color="black" />
          </View>
        )
      }
      {
        searchText.length === 0 &&
          (
            <FlatList
              data={contentList}
              refreshControl={
                <RefreshControl 
                  refreshing = {refreshing}
                  onRefresh={onRefresh}
                />
              }
              renderItem={
                ({ 
                  item: parantItem 
                }) => ( parantItem.containers.length > 0 &&
                  <View style={styles.flatlistViewVertical}>
                    <Text style={{fontSize: 25}}>{parantItem.folderTitle}</Text>
                    <FlatList
                      horizontal
                      data={parantItem.containers}
                      renderItem={
                        ({ 
                          item: childItem
                        }) => ( 
                        <TouchableOpacity onPress={() => setNewDetails(childItem, parantItem.folderTitle)}>
                          {
                            childItem.type === 'text' 
                              ? 
                                displayText(childItem) 
                              : 
                                displayVideo(childItem)
                          }
                        </TouchableOpacity>
                        )
                      }
                    />
                  </View>
                )
              }
            />
          )
        }

        {
          searchText.length > 0 &&
            (
              <FlatList
                data={contentList}
                renderItem={
                  ({ 
                    item: parantItem
                  }) => (
                    <FlatList
                      data={parantItem.containers}
                      renderItem={
                        ({
                          item: childItem
                        }) => childItem.title.toLowerCase().includes(searchText.toLowerCase()) && (
                          <TouchableOpacity onPress={() => setNewDetails(childItem, parantItem.folderTitle)}>  
                            {
                              childItem.type === 'text' 
                              ? 
                                searchDisplayText(childItem)
                              : 
                                searchDisplayVideo(childItem)
                            }
                          </TouchableOpacity>
                      )}
                    />
                  )
                }
              />
            )
        }
        <Modal
          animationType="slide"
          transparent={false}
          visible={viewImage}
          onRequestClose={() => {
            setViewImage(!viewImage);
            setDetails([]);
          }}>
            {
              details.length !== 0 && 
              (
                details[0].type === 'text' ? 
                  textDisplayModal()
                :
                  videoDisplayModal(details[0].imageUri)
              )
            }
        </Modal>               
    </SafeAreaView>
  )
}