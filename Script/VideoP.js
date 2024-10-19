import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';


export default function VideoP({route}) {

  const videoRef = useRef({});
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function setFullScreen() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }

    setFullScreen();

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={{
      flex:1, 
      justifyContent:'center', 
      alignItems:'center', 
      backgroundColor:'black', 
      width:'100%', 
      height:'100%'}}>
      {!loading && (
        <View style={{ 
          top: '50%', 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center' }}>
          <ActivityIndicator size='large' color="white" />
        </View>
      )}
      <Video
        ref={videoRef}
        source={{uri : route.params.uri}}
        style={{
          width: '100%', 
          height: '100%'
        }}
        useNativeControls
        resizeMode='contain'
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded){
            setLoading(true);
          }
      }}
      />
    </View>
  );
}

// const [isPlaying, setIsPlaying] = useState(false);
// const [duration, setDuration] = useState(0);
// const [position, setPosition] = useState(0);

// const togglePlay = async () => {
//   if (videoRef.current) {
//     if (isPlaying) {
//       await videoRef.current.pauseAsync();
//     } else {
//       await videoRef.current.playAsync();
//     }
//     setIsPlaying(!isPlaying);
//   }
// };

// const handleSeek = async (value) => {
//   if (videoRef.current) {
//     await videoRef.current.setPositionAsync(value);
//   }
// };

// const formatTime = (ms) => {
//   const minutes = Math.floor(ms / 60000);
//   const seconds = ((ms % 60000) / 1000).toFixed(0);
//   return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
// };

{/* <View style={{
  flexDirection: 'row',
  bottom: 20,
  width: '100%',
  // backgroundColor:'white',
  position: 'absolute',}}>
  <Text style={{
    color: 'white',
    fontSize: 16,
  }}>{formatTime(position)}</Text>
  <View style={{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'blue',
    // alignSelf:'flex-end',
    width: '100%',
  }}>
  <TouchableOpacity onPress={() => handleSeek(position - 10000)} style={{
    marginHorizontal: 10,
    }}>
      <MaterialCommunityIcons name="rewind" size={30} color="white" />
    </TouchableOpacity>
    <TouchableOpacity onPress={togglePlay} style={{
      marginHorizontal: 10,
    }}>
      <Ionicons name={isPlaying ? 'pause' : 'play'} size={35} color="white" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleSeek(position + 10000)} style={{
      marginHorizontal: 10,
    }}>
      <MaterialCommunityIcons name="fast-forward" size={30} color="white" />
    </TouchableOpacity>
  </View>
</View> */}