import 'react-native-gesture-handler';
import { View, Platform, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import icons
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

//import js scripts
import MainPage from './Script/Pages/MainPage';
import Downloads from './Script/Pages/Downloads';
import History from './Script/Pages/History';
import styles from './Script/styles';
import VideoP from './Script/VideoP';
import VideoOptions from './Script/VideoOptions';
import Donations from './Script/Pages/Donations';
import Bible from './Script/Pages/Bible';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    bckground: '#fff'
  }
}

const HomePage = () => {
  return(
    <Tab.Navigator 
    initialRouteName='MainPage' 
    screenOptions={screenOptions}>
      <Tab.Screen 
        name="MainPage" 
        component={MainPage}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.bottomTabStyleSide}>
                  <Entypo name="home" size={24} color={focused ? 'blue' : 'black'}/>
                <Text style={{color: focused ? 'blue' : 'black'}}>Home</Text>
              </View>
            )
          }
        }} 
      />
      <Tab.Screen 
        name="Donations" 
        component={Donations} 
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.bottomTabStyleSide}>
                <Entypo name="wallet" size={24} color={focused ? 'blue' : 'black'} />
                <Text style={{color: focused ? 'blue' : 'black'}}>Donations</Text>
              </View>
            )
          }
        }}
      />
      <Tab.Screen 
        name="History" 
        component={History} 
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.bottomTabStyleSide}>
                <MaterialCommunityIcons name="history" size={24} color={focused ? 'blue' : 'black'}/>
                <Text style={{color: focused ? 'blue' : 'black'}}>History</Text>
              </View>
            )
          }
        }} 
      />
      <Tab.Screen 
        name="Bible" 
        component={Bible} 
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.bottomTabStyleSide}>
                <FontAwesome5 name="bible" size={24} color={focused ? 'blue' : 'black'} />
                <Text style={{color: focused ? 'blue' : 'black'}}>Bible</Text>
              </View>
            )
          }
        }}
      />
      <Tab.Screen 
        name="Downloads" 
        component={Downloads} 
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <View style={styles.bottomTabStyleSide}>
                <FontAwesome name="download" size={24} color={focused ? 'blue' : 'black'} />
                <Text style={{color: focused ? 'blue' : 'black'}}>Downloads</Text>
              </View>
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerTintColor : 'white',
        headerTransparent : true,
        headerTitle: '',
        headerLeftContainerStyle : {
          paddingLeft : 20,
        },
        initialRouteName : 'HomePage',
      }}>
        <Stack.Screen 
          name='HomePage' 
          component={HomePage} 
        />
        {/* <Stack.Screen 
          name='Register' 
          component={Register} 
          options={{ headerTitle: 'Create a new account' }}
        />
        <Stack.Screen 
          name='LogIn' 
          component={LogIn} 
          options={{ headerTitle: 'log in to account' }}
        />
        <Stack.Screen 
          name='Profile' 
          component={Profile} 
          options={{ headerTitle: 'Profile' }}
        /> */}
        {/* <Stack.Screen 
          name='UploadPage' 
          component={UploadPage}
        /> */}
        <Stack.Screen
          name='VideoP'
          component={VideoP}
        />
        <Stack.Screen
          name='VideoOptions'
          component={VideoOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


