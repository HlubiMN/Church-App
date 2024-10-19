import { 
    View, 
    Text, 
    SafeAreaView, 
    StyleSheet, 
    TouchableOpacity, 
    Modal, 
    ActivityIndicator, 
    Alert } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AntDesign } from '@expo/vector-icons';

import styles from './styles'
import { getDownloadable } from './downloadProcess';

export default function VideoOptions({route, navigation}) {
    const videoRef = useRef({});
    const [download, setDownload] = useState(false);
    const [viewTrailer, setViewTrailer] = useState(false);
    const [finishedtrailer, setFinishedTrailer] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const toggleOrientation = async () => {
            if (viewTrailer) {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            } else {
                await ScreenOrientation.unlockAsync();
            }
        };

        toggleOrientation();

        return async () => {
            await ScreenOrientation.unlockAsync();
        };
    }, [viewTrailer]);

    // const retrieveData = async() => {
    //     try {  
    //         const value = await AsyncStorage.getItem('email_phoneNumber');
    //         if (value !== null){
    //             console.log('account');
    //             navigation.navigate('VideoP', {uri: route.params.details[0].videoUri})
    //         }
    //         else{
    //             console.log('no account');
    //             Alert.alert('Account', 'Please create an account to view the full containers', [
    //                 {
    //                   text: 'create account',
    //                   onPress: () => navigation.navigate('Register'),
    //                 },
    //                 {text: 'OK', onPress: () => console.log('OK Pressed')},
    //               ]);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const VideoBackground = () => {
        return (
            <View style={[styles.screenContainer, {justifyContent: 'center', alignItems: 'center'}]}>
                <Video
                    source={{uri : route.params.details[0].trailerUri}}
                    shouldPlay
                    isLooping
                    isMuted
                    resizeMode="cover"
                    style={StyleSheet.absoluteFillObject}
                />
                <BlurView tint="default" intensity={180} style={StyleSheet.absoluteFill} />
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <VideoBackground/>
            <View style={styles.overlayingContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('VideoP', {uri: route.params.details[0].videoUri}) }>
                    <Text style={styles.options}>Watch video</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setViewTrailer(true)}>
                    <Text style={styles.options}>Watch trailer</Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={() => [getDownloadable(route.params.details[0], route.params.details[1]), Alert.alert('Starting Download....')]}>
                    <Text style={styles.options}>Download</Text>
                </TouchableOpacity>
            </View>

            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={download}
                onRequestClose={() => {
                    setDownload(!download);
                }}>
                <View style={{ 
                    backgroundColor: '#F0F0F0' , 
                    width: '100%', 
                    height: 150,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    borderWidth:1,
                    top:'84%'
                    }}>
                    <View style={{
                        flexDirection: 'row', 
                        alignItems:'center'}}>
                        <Text style={[
                            styles.popUpTextStyle, 
                            {
                                width: '90%', 
                                fontWeight: 'bold', 
                                fontSize: 20
                            }
                        ]}>{route.params.details[0].name}</Text>
                        <TouchableOpacity onPress={() => setDownload(false)}>
                            <AntDesign name="close" size={15} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => [setDownload(false), getDownloadable(route.params.details[0], route.params.details[1]), Alert.alert('Starting Download....')]}>
                        <Text style={styles.popUpTextStyle}>Download</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.popUpTextStyle}>Schedule Download</Text>
                    </TouchableOpacity>
                </View>
            </Modal>   */}

            <Modal
                animationType="slide"
                transparent={true}
                visible={viewTrailer}
                onRequestClose={() => {
                    setViewTrailer(!viewTrailer);
                    setLoading(false);
            }}>
                <View style={{ 
                    backgroundColor: loading ? 'transparent' : '#003020', 
                    flex: 1}}>
                    {
                        !loading && (
                            <View style={styles.loading}>
                                <ActivityIndicator size='large' color="white" />
                            </View>
                        )
                    }
                    <Video
                        ref={videoRef}
                        source={{uri : route.params.details[0].trailerUri}}
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
                            if (status.didJustFinish) {
                                setFinishedTrailer(true);
                            }
                        }}
                    />    
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={finishedtrailer}
                onRequestClose={() => {
                    setFinishedTrailer(!finishedtrailer);
            }}>
                <TouchableOpacity onPress={() => 
                    [
                        setFinishedTrailer(false), 
                        setViewTrailer(false), 
                        setLoading(false), 
                        navigation.navigate('VideoP', {uri: route.params.details[0].videoUri})
                    ]}>
                    <Text style={{ 
                        alignSelf: 'center',
                        textAlign:'center', 
                        // backgroundColor:'yellow', 
                        paddingHorizontal: '3%', 
                        paddingVertical: '2%', 
                        width: '30%', 
                        fontSize: 20, 
                        borderRadius: 10, 
                        fontWeight: 'bold'
                    }}>Watch Full Video</Text>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    )
}