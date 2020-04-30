import React,{ Component } from "react";
import {Text,View,StyleSheet, Alert,Dimensions,Image,AsyncStorage} from "react-native";
import { Button } from 'react-native-elements';
import { TextInput } from "react-native-gesture-handler";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import RcIf, {RcElse} from 'rc-if';
import ApiService from '../Services/ApiService';
import { StackActions, NavigationActions } from 'react-navigation';
import * as Expo from "expo";
 export default class AboutScreen extends Component{
static navigationOptions = ({ navigation }) => {
  const api = new ApiService();
  return {
    headerStyle: {
    backgroundColor: '#FFA500',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
title:'',
headerLeft:(<View style={{flexDirection:'row', flexWrap:'wrap'}}>
<Image style={{width:40,height:40,margin:20}} source={{uri:api.URL+"?url=/home/ubuntu/SlvStoreServer/Server/uploads/slv.jpeg"
}}/>
</View>)
  };
}
   constructor(props){
     super(props);
     this.state = {
       'phone':0,
       'isenabled':false,
       'isLoaded':false
     }


     this.checklenght = this.checklenght.bind(this)
     this.sendOtp = this.sendOtp.bind(this)
   }
   componentWillMount(){


   }
   checklenght(phone){
     if(phone.length == 10){
       this.setState({
         'isenabled': false
       })
       this.setState({
         'phone':phone
       })
     }
     else{
       this.setState({
         'isenabled': true
       })
     }
   }
   sendOtp(){
     console.log('pressed')
     const { navigation } = this.props;
     console.log(this.state.phone)
     navigation.navigate('token',{
       phone:this.state.phone
     })
   }

   render(){
     if(this.state.isLoaded){
       return([
         <View style={Style.container}>
           <View style={{margin:20}}>
               <Image style={{width:100,height:200}} source={require('../assets/slv.png')}/>
           </View>
           <View style={{marginBottom:10,  alignItems: 'center',
           justifyContent:"center"}}>
             <Text>{'\n'}</Text>
           </View>
        <View style={{marginBottom:100,  alignItems: 'center',
        justifyContent:"center"}}>
          <Button
          title="register"
          disabled = {this.state.isenabled}
          onPress ={this.sendOtp}
          />
        </View>
         </View>
       ]);
     }
     else{
       return([
         <View style={Style.container}>
           <View style={{margin:20}}>
               <Image style={{width:100,height:200}} source={require('../assets/slv.png')}/>
           </View>
           <View style={{marginBottom:10,  alignItems: 'center',
           justifyContent:"center"}}>
           <Text style={{bold: {fontWeight: 'bold'}}}>
            For Any Quries Please Contact
           </Text>
           </View>
           <View style={{marginBottom:10,  alignItems: 'center',
           justifyContent:"center"}}>
           <Text style={{bold: {fontWeight: 'bold'}}}>
            Phone : 9972720099
           </Text>
            </View>
          <View style={{marginBottom:100,  alignItems: 'center',
          justifyContent:"center"}}>
          </View>
          <View style={{marginBottom:10,  alignItems: 'center',
          justifyContent:"center"}}>
          <Text style={{bold: {fontWeight: 'bold'}}}>
           Powered By : RukvaaK
          </Text>
          </View>
          <View style={{marginBottom:10,  alignItems: 'center',
          justifyContent:"center"}}>
          <Text style={{bold: {fontWeight: 'bold'}}}>
          rukvaak.logicspeaks@gmail.com
          </Text>
          </View>
         </View>
       ]
     )
     }


     }
 }


const Style = StyleSheet.create(
  {
    container : {
      flex:1,
      alignItems: 'center',
    justifyContent:"center",
    marginTop: 40,
    padding: 9,
    backgroundColor: '#ffffff',

  },
  wordBold: {
    fontWeight: 'bold',
    color: 'black',
    fontSize:30
 },
 textInputContainer: {
  marginBottom: 5,
},
instructions: {
  fontSize: 20,
  fontWeight: '500',
  textAlign: 'center',
  color: '#333333',
  marginBottom: 20,
},
footer:{
  position:'absolute',
  top:HEIGHT-100,
  left:0,
  right:0,
}
}
);
