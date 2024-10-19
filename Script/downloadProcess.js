// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import { Button, Platform, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as RNBackgroundDownloader from 'react-native-background-downloader';
import React, { useRef, useEffect } from 'react';
import { Audio,Video } from 'expo-av';
import { Alert } from "react-native";

// const [downloadProgress, setDownloadProgress] = useState(0);
// const [download, setDownload] = useState();
// const [isDownloading, setIsDownloading] = useState(false);
// const [isDownloaded, setIsDownloaded] = useState(false);
// const [isPaused, setIsPaused] = useState(false);

// const callback = (progress) => {
//     const percentProgress = ((progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100).toFixed(2);
//     setDownloadProgress(percentProgress);
// };
// const savedDownloadJSON = await AsyncStorage.getItem("download");

// if (savedDownloadJSON !== undefined && savedDownloadJSON !== null) {
//     const savedDownload = JSON.parse(savedDownloadJSON);
//     const downloadResumable = FileSystem.createDownloadResumable(
//         savedDownload.url,
//         savedDownload.fileUri,
//         savedDownload.options,
//         callback,
//         savedDownload.resumeData
//     );

//     setDownload(downloadResumable);
//     setIsPaused(true);
//     setIsDownloading(true);
// } else {
// }

const startDownloadInBackground = async () => {
    console.log('Starting download in background');
    const fileDest = `${FileSystem.documentDirectory}file.zip`; // Get destination path using expo-file-system
    const task = RNBackgroundDownloader.download({
        id: 'file123',
        url: 'https://testing.taxi/wp-content/uploads/2023/06/compressed-pdf-100M.zip',
        destination: fileDest // Use the obtained destination path
    })
    .begin((expectedBytes) => {
        console.log(`Going to download ${expectedBytes} bytes!`);
    })
    .progress((percent) => {
        console.log(`Downloaded: ${percent * 100}%`);
    })
    .done(() => {
        console.log('Download is done!');
    })
    .error((error) => {
        console.log('Download canceled due to error: ', error);
    });
  
    // For Android, start the download in a foreground service
    if (Platform.OS === 'android') {
        RNBackgroundDownloader.startDownload(task);
    }
  };

const getDownloadable = async (details, folderTitle) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory + details.title);
        const storedArrayString = await AsyncStorage.getItem('downloads');
        let storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];

        if (fileInfo.exists) {
            console.log('File already exists:', FileSystem.documentDirectory + details.title);

            for (let i = 0; i < storedArray.length; i++) {
                if(storedArray[i].title === details.title && storedArray[i].folderTitle === folderTitle) {
                    Alert.alert('Download', 'File already exists:' + FileSystem.documentDirectory + details.title) 
                    return;
                }
            }
            let newItem = {
                folderTitle: folderTitle,
                type : details.type, 
                title: details.title, 
                videoUri: fileInfo.uri, 
                downloadDate: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
            }
            storedArray.push(newItem);
            const updatedArrayString = JSON.stringify(storedArray);
            await AsyncStorage.setItem('downloads', updatedArrayString);
            Alert.alert('Download', 'Successfully Downloaded ' + details.title);
            return;
        }
        const downloadResumable = FileSystem.createDownloadResumable(
            details.videoUri,
            FileSystem.documentDirectory + details.title,
            {},
            (progress) => {
                const percentProgress = ((progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100).toFixed(2);
            }
        );
        const { uri } = await downloadResumable.downloadAsync();

        console.log(uri);

        let newItem = {
            folderTitle: folderTitle,
            type : details.type, 
            title: details.title, 
            videoUri: uri, 
            downloadDate: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
        }

        storedArray.push(newItem);
        const updatedArrayString = JSON.stringify(storedArray);
        await AsyncStorage.setItem('downloads', updatedArrayString);
        
        console.log('Value added successfully.');
        startDownloadInBackground();
        Alert.alert('Download', 'Successfully Downloaded '+ details.title);
    } catch (e) {
        console.log('getDownloadable' + e);
    }
};

const downloadText = async (items, folderTitle)=> {
    try {
        const storedArrayString = await AsyncStorage.getItem('downloads');
        let storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];
        for (let i = 0; i < storedArray.length; i++) {
            if(storedArray[i].title === items.title && storedArray[i].folderTitle === folderTitle) {
                Alert.alert('Download', items.title + 'already Downloaded, \n\n Please check your downloads' ) 
                return;
            }
        }
        let newItem = {
            folderTitle: folderTitle,
            type: items.type, 
            scripture: items.scripture, 
            title: items.title, 
            downloadDate: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString()
        }

        storedArray.push(newItem);
        const updatedArrayString = JSON.stringify(storedArray);
        await AsyncStorage.setItem('downloads', updatedArrayString);
        
        console.log('Value added successfully.');
        Alert.alert('Download', 'Successfully Downloaded ' + items.title);
    } catch (error) {
      console.error('Error adding value:', error);
    }
};

const deleteContent = async (items) => {
    try {
        const storedArrayString = await AsyncStorage.getItem('downloads');
        
        let storedArray = JSON.parse(storedArrayString)
        for (let i = 0; i < storedArray.length; i++) {
            if (items.title.toLowerCase().includes(storedArray[i].title.toLowerCase()) && items.type.toLowerCase().includes(storedArray[i].type.toLowerCase())){
                console.log(items);
                storedArray.splice(i, i + 1)
                break;
            }
        }

        const updatedArrayString = JSON.stringify(storedArray);
        await AsyncStorage.setItem('downloads', updatedArrayString);
        
        console.log('Value added successfully.');
    } catch (error) {
      console.error('Error adding value:', error);
    }
};

const loadHistory = async(item, folderTitle) => {
    try {
        const history = await AsyncStorage.getItem('history');
        let storedHistory = history ? JSON.parse(history) : [];
        for (let i = 0; i < storedHistory.length; i++) {
            if(storedHistory[i].name === item.title && storedHistory[i].folderTitle === folderTitle) {
                storedHistory[i].dateWatched = new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
                storedHistory[i].timeWatched = new Date().getHours().toString() + ':' + new Date().getMinutes().toString()
                const updatedArrayString = JSON.stringify(storedHistory);
                await AsyncStorage.setItem('history', updatedArrayString);
                return;
            }
        }
        if (item.type === 'text'){
            let newItem = {
                folderTitle: folderTitle,
                type: item.type, 
                scripture: item.scripture, 
                name: item.title,
                dateWatched: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
                timeWatched: new Date().getHours().toString() + ':' + new Date().getMinutes().toString()
            }
            storedHistory.push(newItem);
        }
        else{
            let newItem = {
                folderTitle: folderTitle,
                type : item.type, 
                name: item.title, 
                videoUri: item.videoUri,
                imageUri: item.imageUri,
                dateWatched: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
                timeWatched: new Date().getHours().toString() + ':' + new Date().getMinutes().toString()
            }
            storedHistory.push(newItem);
        }
        const updatedArrayString = JSON.stringify(storedHistory);
        await AsyncStorage.setItem('history', updatedArrayString);
    } catch (error) {
        console.error('loadhistory' + error);
    }

}

const resumeDownload = async () => {
    try {
        const storedArrayString = await AsyncStorage.getItem('downloads');
        const storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];

        for (const item of storedArray) {
            const { title, downloadResumable } = item;
            const downloadFilePath = FileSystem.documentDirectory + title;

            const fileInfo = await FileSystem.getInfoAsync(downloadFilePath);
            if (fileInfo.exists) {
                console.log('File already exists:', downloadFilePath);
                continue; 
            }

            const downloadObject = FileSystem.DownloadResumable.createFromJSON(downloadResumable);
            const result = await downloadObject.resumeAsync();

            if (result !== null) {
                console.log('Download resumed:', result.uri);
            }
        }
    } catch (error) {
        console.error('Error in resumeDownloadInBackground:', error);
    }
};

// const BackgroundDownloader = NativeModules.BackgroundDownloader;
const byte = 1024 ;
// const videoRef = useRef({});

// async function getDownloadable2(details, chunkDuration) {
//     // Create a new AV playback object for the video
//     const playbackObject = new Audio.Sound();

//     try {
//       // Load the video from the remote URL into the playback object
//         await playbackObject.loadAsync({ uri: details.videoUri });

//         // Get the total duration of the video
//         const totalDuration = await playbackObject.getStatusAsync();

//         // Calculate the number of chunks based on the chunk duration
//         const numChunks = Math.ceil(totalDuration.durationMillis / chunkDuration);

//         // Array to store the start and end times of each chunk
//         const chunks = [];

//         // Split the video into chunks
//         for (let i = 0; i < numChunks; i++) {
//             // Calculate the start and end times for the current chunk
//             const startTime = i * chunkDuration;
//             const endTime = Math.min((i + 1) * chunkDuration, totalDuration.durationMillis);

//             // Add the start and end times to the chunks array
//             chunks.push({ startTime, endTime });
//         }

//         downloadChunks(details.videoUri, chunks, details);
//     } catch (error) {
//         console.error('Error splitting video into chunks:', error);
//         return [];
//     } finally {
//       // Unload the video from the playback object
//         await playbackObject.unloadAsync();
//     }
//   }

// async function downloadChunk(videoUrl, chunkIndex, startTime, endTime) {
//     try {
//       // Construct a unique filename for the chunk
//         const fileName = `chunk_${chunkIndex}.mp4`;
    
//         // Download the chunk using the start and end times
//         const downloadOptions = {
//             fromUrl: videoUrl,
//             toFile: `${FileSystem.documentDirectory}${fileName}`,
//             headers: {
//             Range: `bytes=${startTime}-${endTime}`, // Specify the byte range for the chunk
//             },
//         };
//         const downloadResult = await FileSystem.downloadAsync(videoUrl, downloadOptions.toFile, downloadOptions);
//         if (downloadResult.status === 206) {
//             console.log('Chunk downloaded successfully:', fileName);
//             return downloadResult.uri; // Return the URI of the downloaded chunk
//         } else {
//             console.error('Chunk download failed:', fileName);
//             return null;
//         }
//     } catch (error) {
//         console.error('Error downloading chunk:', error);
//         return null;
//     }
// }

// async function downloadChunks(videoUrl, chunks, details) {
//     const downloadedChunks = [];
  
//     for (let i = 0; i < chunks.length; i++) {
//         const { startTime, endTime } = chunks[i];
//         const downloadedChunk = await downloadChunk(videoUrl, i, startTime, endTime);
    
//         if (downloadedChunk) {
//             downloadedChunks.push(downloadedChunk);
//         }
//     }
//     combineChunks(downloadedChunks, details)

// }

// async function combineChunks(downloadedChunks, details) {
//     try {
//       // Read the containers of each chunk and concatenate them into a single buffer
//         const combinedContent = await Promise.all(downloadedChunks.map(chunkUri => FileSystem.readAsStringAsync(chunkUri)));
    
//         // Combine the containers of all chunks into a single string
//         const combinedContentString = combinedContent.join('');
    
//         // Write the combined containers to a new file
//         const combinedFilePath = `${FileSystem.documentDirectory}combinedVideo.mp4`;
//         await FileSystem.writeAsStringAsync(combinedFilePath, combinedContentString, { encoding: FileSystem.EncodingType.UTF8 });
    
//         console.log('Chunks combined successfully into:', combinedFilePath);

//         const storedArrayString = await AsyncStorage.getItem('downloads');
//         let newItem = {
//             type : details.type, 
//             title: details.title, 
//             videoUri: combinedFilePath, 
//             downloadDate: new Date().getFullYear().toString() + '-' + new Date().getMonth().toString() + '-' + new Date().getDate().toString(),
//         }
//         let storedArray = storedArrayString ? JSON.parse(storedArrayString) : [];

//         storedArray.push(newItem);
//         const updatedArrayString = JSON.stringify(storedArray);
//         await AsyncStorage.setItem('downloads', updatedArrayString);
//         // return combinedFilePath; 
//     } catch (error) {
//         console.error('Error combining chunks:', error);
//         return null;
//     }
// }
export {getDownloadable, downloadText, deleteContent, loadHistory};
 