import React from 'react'
const axios = require('axios');
import {Text,View,StyleSheet, Alert,Dimensions,Image,AsyncStorage,Linking} from "react-native";

export default class ApiService extends React.Component {
  constructor() {
      super();

  }

   URL ="http://35.223.39.14:3002/";

  getCategories(){
    console.log(URL+'getCategories');
    return axios.get(this.URL+'getCategories');
  }


  checkInternt = () => {
   return Linking.canOpenURL('http://35.223.39.14:3002/')
};


  getproducts(categoryID){
    console.log(categoryID);
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const params = new URLSearchParams();
        params.append('catID',categoryID);
    return axios.post(this.URL+'getProductsByCategory',params,config)
  }

  addToCart(order){
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  const params = new URLSearchParams();
        params.append('cart',order);
    return axios.post(this.URL+'insertCart',params,config)
  }
  sendOtp(number){
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
    params.append('user',number);
return axios.post(this.URL+'sendOTP',params,config)
  }

sendToken(token,authyId){
  const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
let tokenPayload = {}
tokenPayload.authyId = authyId;
tokenPayload.token = token
console.log(JSON.stringify(tokenPayload))
    const params = new URLSearchParams();
  params.append('token',JSON.stringify(tokenPayload));
return axios.post(this.URL+'requestToken',params,config)
}
}
