import { View, Text, SafeAreaView, Button, Alert, TextInput, Linking, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'

import styles from '../styles'
import { StripeProvider, useStripe } from '@stripe/stripe-react-native'
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Donations() {

  // const [donationsFor, setDonationsFor] = useState([])

  
  const openBrowser = () => {
    Linking.openURL('https://buy.stripe.com/test_dR6cNLaM079W1uU288');
  };
  
  // useEffect(() => {
  //   const donations = async () => {
  //     try {
  //       const donationsFor = await AsyncStorage.getItem('donations')
  //       let storedArray = donationsFor ? JSON.parse(donationsFor) : [];
  //       setDonationsFor(storedArray)
  //       console.log(storedArray)
  //     }
  //     catch (error){
  //       console.error(error)
  //     }
  //   };
  //   donations()
  // }, [])

  return (
    <SafeAreaView style={[styles.screenContainer, {paddingBottom: 60, justifyContent: 'center'}]}>
      <View style={{justifyContent: 'center', width: '80%', alignSelf:'center', alignItems: 'center'}}>
        <View style={{alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
          <Entypo name="wallet" size={150} color='black'/>
        </View>
        {/* <FlatList
          data={donationsFor}
          renderItem={
            ({
              item
            }) => donationsFor.length > 0 && (
              <Text style={{color:'black'}}>{item.donationFor}</Text>
            )}
        /> */}

        <Button
          variant="primary"
          title="Donate"
          onPress={openBrowser}
        />
      </View>
    </SafeAreaView>
  )
}