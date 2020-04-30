import React,{ Component } from "react";
import {Text,View,StyleSheet, Alert,Dimensions,AsyncStorage,Image} from "react-native";
import { Button } from 'react-native-elements';
import { TextInput } from "react-native-gesture-handler";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import RcIf, {RcElse} from 'rc-if';
import ApiService from '../Services/ApiService';
import OTPTextView from 'react-native-otp-textinput';
import { StackActions, NavigationActions } from 'react-navigation';

export default class Otpscreen extends React.Component{
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
  {/* <Image style={{width:40,height:40,margin:20}} source={{uri:api.URL+"?url=/home/ubuntu/SlvStoreServer/Server/uploads/slv.jpeg"
 }}/> */}
</View>)

    };
  }
  constructor(props){
    super(props);
    this.state = {
      'phone':0,
      'isenabled':true,
      'authyId':0
    }
    this.sendOtp=  this.sendOtp.bind(this);
    this.sendToken = this.sendToken.bind(this);

  }
  componentWillMount(){
    const { navigation } = this.props;
      navigation.addListener('willFocus', () => {
        console.log("nav"+navigation.getParam('phone'))
      })
    this.sendOtp(navigation.getParam('phone'));
    this.setState({
      'phone':navigation.getParam('phone')
    })
  }
      state={
        text1:"",
        text2:"",
        text3:"",
        text4:"",
        text5:"",
        text6:"",
        text7:"",
      }
      alertText = () => {
        const {text1="",text2="",text3="",text4="",text5="",text6="",text7=""}=this.state;
        Alert.alert(this.state.text1)
      }
      sendOtp(phone){
        const showAlert = (message) =>{
          Alert.alert(
          message
           )
          }
         const service = new ApiService();
         service.sendOtp(phone).then(res=>{
           console.log(res);
           if(res.data.authyId !== undefined){
            showAlert("SMS was Sent")
            this.setState({
              'authyId':res.data.authyId
            })
           }
           else{
             showAlert("something wrong with the number or check the internet");
           }
         })
      }
      sendToken(){
          const showAlert = (message) =>{
            Alert.alert(
            message
             )
            }
            console.log("token");
            const api = new ApiService();
            const { navigatior } = this.props;
            console.log(this.state.text1)
            if(this.state.text1 !== undefined){
              if(this.state.text1.length !== 7){
                  showAlert('Please Enter Complete Token');
                  return
              }
            }
            if(this.state.text1 === undefined){
              showAlert('Please Enter Complete Token');
              return
            }
            api.sendToken(this.state.text1,this.state.authyId).then(res=>{
            console.log(res.data);
            if(res.data.success){
              AsyncStorage.setItem('phone',this.state.phone);
              console.log('phone'+ this.state.phone);
              const resetAction = StackActions.reset({
               index: 0,
               actions: [NavigationActions.navigate({ routeName: 'Home' })],
                     });
              this.props.navigation.dispatch(resetAction);
            }
            else{
                showAlert('Something went wrong please try registering again');
            }
            })
      }
    render(){
      return(
        <View style={Style.container}>
        <Text style={Style.instructions}>enter the otp</Text>
          <OTPTextView
            containerStyle={Style.textInputContainer}
            handleTextChange={text => this.setState({ text1: text })}
            inputCount={7}
            keyboardType="numeric"
          />
        <Text>{"\n"}</Text>
        <Button title="submit"
          onPress ={this.sendToken}

           />
        </View>

      )
    }
  }
  const Style = StyleSheet.create(
  {
    container : {
      flex: 1,
    justifyContent:"center",
    marginTop: 40,
    alignItems: 'center',
    margin:10,
    backgroundColor: '#ffffff',

  },
  wordBold: {
    fontWeight: 'bold',
    color: 'black',
    fontSize:10
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
roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },
footer:{
  position:'absolute',
  top:HEIGHT-100,
  left:0,
  right:0,
}
}
);
