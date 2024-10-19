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
    Alert} from 'react-native'
import styles from './styles'

const displayVideo = (item) => {
    return (
      <View style={styles.videoContainerStyle}>
        <Image
          style={styles.videoImage}
          source={{uri: item.imageUri}}/>
      </View>
    )
  }
  const displayText = (item) => {
    return(
      <View style={[styles.videoContainerStyle, {padding: 10}]}>
        <Text style={{fontWeight:'bold', paddingBottom:5}}>{item.title}</Text>
        <Text style={{height:'90%', paddingLeft: 10}}>{item.scripture}</Text>
      </View>
    )
  }

  const searchDisplayVideo = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10}}>
          <View style={{width:100, height:100}}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10}}
              source={{uri: item.imageUri}}/>
          </View>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.title}</Text>
            <Text style={{fontSize: 15, color:'white'}}>Other information</Text>
            <Text style={{fontSize: 15, color:'white'}}>Other information</Text>
          </View>
        </View>
      </View>
    )
  }

  const searchDisplayText = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10}}>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.title}</Text>
            <Text style={{fontSize: 15, color:'white'}}>O{item.scripture}</Text>
          </View>
        </View>
      </View>
    )
  }

  const searchDisplayVideoH = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10}}>
          <View style={{width:100, height:100}}>
            <Image
              style={{width: '100%', height: '100%', borderRadius: 10}}
              source={{uri: item.imageUri}}/> 
          </View>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.name}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.dateWatched}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.timeWatched}</Text>
          </View>
        </View>
      </View>
    )
  }

  const searchDisplayTextH = (item) => {
    return (
      <View style={{backgroundColor:'grey', margin: 10, borderRadius: 10}}>
        <View style={{flexDirection: 'row', marginVertical: 10, marginLeft: 10}}>
          <View style={{marginLeft: 20}}>
            <Text style={{fontSize: 20, color:'white'}}>{item.name}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.dateWatched}</Text>
            <Text style={{fontSize: 15, color:'white'}}>{item.timeWatched}</Text>
          </View>
        </View>
      </View>
    )
  }

export{ displayText, displayVideo, searchDisplayText, searchDisplayVideo, searchDisplayTextH, searchDisplayVideoH };