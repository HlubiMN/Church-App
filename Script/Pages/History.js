import { 
  View, 
  Platform, 
  StatusBar, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  Modal, 
  FlatList,
  SafeAreaView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Searchbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

//Scripts
import styles from '../styles';
import { searchDisplayTextH, searchDisplayVideoH } from '../display';
import { downloadText } from '../downloadProcess';

//icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function History({navigation}) {

  const isFocused = useIsFocused();
  const [searchText, setSearchText] = useState('');
  const [viewItem, setViewItem] = useState(false);
  const [details, setDetails] = useState([]);
  const [history, setHistory] = useState([]);

  const search = (text) => {
    setSearchText(text);
  };
  
  const setNewDetails = (items) => {
    if (details.length > 0) {
        setDetails([]);
    }
    const newDetails = [...details, items];
    setDetails(newDetails);
    setViewItem(true);
  }

  const retrive = async() => {
    const storedArrayString = await AsyncStorage.getItem('history');
    const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];
    setHistory(storedArray);
  }

  useEffect(() => {
    if (isFocused){
      retrive();
    }
  }, [isFocused])
  
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
        data={history}
        renderItem={
          ({ 
            item 
          }) => (searchText.length === 0 || item.name.toLowerCase().includes(searchText.toLowerCase())) && (
            item.type ==='text' ? (
              <TouchableOpacity onPress={()=> setNewDetails(item)}>
                {searchDisplayTextH(item)}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={()=> {navigation.navigate('VideoP', {uri: item.videoUri})}}>
                {searchDisplayVideoH(item)}
              </TouchableOpacity>
            )
          )
        }
      />

      {
        history.length === 0 && (
          <View style={{
            justifyContent: 'center', 
            width: '100%', 
            height: '85%', 
            alignItems: 'center'}}>
            <MaterialCommunityIcons name="history" size={150} color="black" />
            <Text>The is no history available</Text>
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
                  <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 20}}>{details[0].name}</Text>
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
