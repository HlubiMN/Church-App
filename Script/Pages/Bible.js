import { View, Text, SafeAreaView, FlatList, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { getBookDetails, chapterOptionsFinder } from '../data';
import { Searchbar } from 'react-native-paper';

import styles from '../styles';

export default function Bible() {

  const chapters = [
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Job',
    'Psalms',
    'Proverbs',
    'Ecclesiastes',
    'Song of Solomon',
    'Isaiah',
    'Jeremiah',
    'Lamentations',
    'Ezekiel',
    'Daniel',
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation',
  ]
  const [choice, setChoice] = useState([])
  const [allVerses, setAllVerses] = useState([]);
  const [getChapter, setGetChapter] = useState('')
  const [viewChapters, setViewChapters] = useState(false);
  const [viewVerses, setViewVerses] =useState(false);
  const [lines, setLines] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://labs.bible.org/api/';

  const getChapters = async (bookName, chapter) => {
    setViewChapters(!viewChapters);
    setViewVerses(!viewVerses);
    try {
      const response = await axios.get(`${apiUrl}?passage=${bookName}%20${chapter}&type=json`);
      const data = response.data;
      // console.log(data);
      setChoice([...choice, data]);
    } catch (error) {
      console.error('Error fetching Bible data:', error);
    }
  }

  const displayChapter = (bookName) => {
    setViewChapters(!viewChapters);
    setGetChapter(bookName);
    let numberOfChapters = chapterOptionsFinder(bookName);
    const newLines = Array.from({ length: numberOfChapters }, (_, index) => `${bookName}: Chapter - ${index + 1}`);
    setLines(newLines);
  };

  const search = (text) => {
    // setSearchText(text);
    // getAllVerses(text);
  };
  //get all verses before showiiing them
  const getAllVerses = async(text) => {
    for (let i = 0; i < chapters.length; i++) {
      let numberOfChapters = chapterOptionsFinder(chapters[i]);
      let book = [];
      for (let j = 0; j < numberOfChapters; j++){
        try {
          const response = await axios.get(`${apiUrl}?passage=${chapters[i]}%20${j + 1}&type=json`);
          const data = response.data;
          let item = {
            chapterNumber: j + 1,
            verses: data.filter(verse => verse.text.toLowerCase().includes(text.toLowerCase()))
          }
          if (item.verses.length > 0) {
            book.push(item);
          }
        } catch (error) {
          console.error('Error fetching Bible data:', error);
        }
      }
      let newBook = {
        bookName: chapters[i],
        chapters: book,
      }
      setAllVerses([...allVerses, newBook]);
      // console.log(book)
    }
    // setLoading(false);
  }

  // if (!loading){
  //   return (
  //     <View style={styles.loading}>
  //       <ActivityIndicator size='large' color="white" />
  //     </View>
  //   )
  // } 

  // useEffect(() => {
  //   getAllVerses();
  // }, [])
  return (
    <SafeAreaView style={[styles.screenContainer, {paddingBottom: 60}]}>
      
      <FlatList
        data={chapters}
        renderItem={({ item }) => item.toLowerCase().includes(searchText.toLowerCase()) && (
          <TouchableOpacity onPress={() => {displayChapter(item)}}>
            <View style={{borderWidth: 1, marginVertical: 5, marginHorizontal: 10, padding: 20}}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={viewChapters}
        onRequestClose={() => {
          setViewChapters(!viewChapters);
          setLines([]);
          setGetChapter('');
        }}
      >
        <ScrollView>
          <Text style={{fontWeight: 'bold', fontSize: 25, alignSelf: 'center', paddingTop: 20, paddingBottom: 10}}>{getChapter}</Text>
          {lines.map((line, index) => (
            <TouchableOpacity key={index} onPress={() => getChapters(getChapter, index + 1)}>
              <View style={{borderWidth: 1, marginVertical: 5, marginHorizontal: 10, padding: 20}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>{line}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={viewVerses}
        onRequestClose={() => {
          setViewVerses(!viewVerses);
          setChoice([]);
          setViewChapters(!viewChapters);
        }}
      >
        <Text style={{fontWeight: 'bold', fontSize: 25, alignSelf: 'center', paddingTop: 20, paddingBottom: 10}}>{getChapter}</Text>
        <FlatList
          data={choice[0]}
          renderItem={({ item }) => (
            <View style={{paddingHorizontal: 20, marginVertical: 5, flexDirection:'row'}}>
              <Text style={{fontWeight:'bold'}}>{item.verse}.  </Text>
              <Text>{item.text}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        /> 
      </Modal>
    </SafeAreaView>
  )
}