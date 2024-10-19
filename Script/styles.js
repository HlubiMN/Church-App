import {Platform, StatusBar, StyleSheet, Dimensions} from "react-native";

const styles = StyleSheet.create({
    bottomTabStyleSide : {
        alignItems: 'center', 
        justifyContent: 'center'
    },

    bottomTabStyleCenter : {
        top: Platform.OS == 'ios' ? -10 : -20,
        width: Platform.OS == 'ios' ? 70 : 80,
        height: Platform.OS == 'ios' ? 70 : 80,
        borderRadius: Platform.OS == 'ios' ? 35 : 40,
        alignItems: 'center', 
        justifyContent: 'center',
    },
    
    screenContainer : {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop : 
            Platform.OS === 'android' ? 
                StatusBar.currentHeight  : 0,
    },

    searchBarAndProfileContainer : {
        paddingVertical:'3%', 
        height: Platform.OS == 'ios' ? 70 : 80, 
        flexDirection: 'row', 
        justifyContent: 'center'
    },

    searchBarContainer : {
        width:'95%', 
        left:'2%', 
        height:'80%'
    },

    profile : {
        width: Platform.OS == 'ios' ? 50 : 60, 
        height: Platform.OS == 'ios' ? 50 : 60
    },

    profileContainer : {
        borderRadius: Platform.OS == 'ios' ? 25 : 30,
        height: Platform.OS == 'ios' ? 50 : 60, 
        width:Platform.OS == 'ios' ? 50 : 60,  
        left:'15%', 
        right: '15%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },

    overlayingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginButtonStyle : {
        color: 'black', 
        backgroundColor: 'white', 
        width: Platform.OS == 'ios' ? 100 : 110, 
        height: Platform.OS == 'ios' ? 20 : 30, 
        textAlign: 'center', 
        textAlignVertical: 'center', 
        margin: Platform.OS == 'ios' ? 5 : 10, 
        fontSize: Platform.OS == 'ios' ? 20 : 25, 
        fontWeight : 'bold', 
        textShadowRadius: Platform.OS == 'ios' ? 15 : 20,
        shadowRadius: Platform.OS == 'ios' ? 15 :20, 
        borderRadius: Platform.OS == 'ios' ? 10 : 10,
        marginBottom: 15
    },
    
    registerBottonStyle : {
        color: 'black', 
        backgroundColor: 'white', 
        width: Platform.OS == 'ios' ? 70 : 80, 
        height: Platform.OS == 'ios' ? 15 : 25, 
        fontSize: Platform.OS == 'ios' ? 15 : 20,
        borderRadius: Platform.OS == 'ios' ? 10 : 10,
        fontStyle: 'italic',
        textAlign: 'center',
        textAlignVertical:'center'
    },

    flatlistViewVertical : {
        width: '100%', 
        height: Platform.OS == 'ios' ? 240 :250, 
        margin : 10, 
        marginLeft: 20
    },

    videoContainerStyle : {
        width:Platform.OS == 'ios' ? 120: 130, 
        height: '95%', 
        margin : 5, 
        marginLeft: 5,
        borderRadius: 10,
        backgroundColor: '#D3D3D3'
    },

    options : {
        backgroundColor: 'green', 
        borderRadius: 20, 
        paddingHorizontal: '20%', 
        paddingVertical: '10%', 
        marginBottom: '15%', 
        fontSize: 20, 
        color: 'white'
    },

    loading : { 
        top: '50%', 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },

    videoImage: {
        width:'100%', 
        height: '100%',
        borderRadius: 10
    },

    popUpTextStyle : {
        fontSize: 15, 
        height: 40,
        alignSelf:'flex-start',
        textAlignVertical:'center',
        paddingLeft:20, 
    },

    profilePopStyle: {
        backgroundColor:'silver', 
        width: 200, 
        height: 80, 
        alignSelf: 'flex-end', 
        alignItems: 'center', 
        flexDirection: 'row',
        right: -10,
        borderRadius:10,
        margin: 2, 
        marginTop: 12,
    },

    closeOptionProfile: {
        backgroundColor:'blue', 
        height: '100%', 
        width: 25, 
        justifyContent:'center', 
        paddingLeft: 5,
        borderTopLeftRadius: 10, 
        borderBottomLeftRadius: 10
    },
    
    optionLayout: {
        backgroundColor: 'yellow', 
        flexDirection: 'row', 
        alignItems:'center', 
        paddingLeft: 10
    },

    textInputStyle: {
        height: 50, 
        width: '80%',  
        marginLeft: 20,
        paddingLeft: 10,
        fontSize: 17
    },

    inputContainerStyle: {
        width: '80%', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems:'center', 
        marginBottom: 20, 
        borderRadius: 10,
        backgroundColor: 'silver',
        borderWidth: 1,  
    },

    textAboveInput: {
        fontSize: 15,
        alignSelf: 'flex-start',
        marginLeft: 60,
        color: 'white',
    },

    viewForUploading: {
        backgroundColor: '#E0E0E0',
        flexDirection: 'row', 
        width: 300, 
        height: 40, 
        borderWidth: 1,
        borderRadius: 10
    },

    chooseFileStyle: {
        backgroundColor: '#C0C0C0', 
        borderWidth: 1, 
        margin: 3, 
        paddingHorizontal: 20, 
        textAlign:'center', 
        textAlignVertical: 'center',
        borderWidth: 1,  
        borderRadius: 10
    },

    fileNameStyle: {
        marginLeft: 2, 
        textAlign: 'center', 
        textAlignVertical: 'center'
    },

    blurViewStyle: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },
    textNull: {
        color: 'red', 
        alignSelf: 'flex-start', 
        paddingLeft: 30
    }
});

export default styles;