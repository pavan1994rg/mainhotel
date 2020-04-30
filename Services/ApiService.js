import React from 'react'
const axios = require('axios');
import {Text,View,StyleSheet, Alert,Dimensions,Image,AsyncStorage,Linking} from "react-native";

export default class ApiService extends React.Component {
  constructor() {
      super();

  }

   URL ="http://192.168.0.105:3002/";

  getMenuCategories(){
    console.log(URL+'getCategories');
    return axios.get(this.URL+'getCategories');
  }


  checkInternt = () => {
   return Linking.canOpenURL(this.URL)
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
  console.log(order);
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


getOrders(phone){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
    params.append('contact',phone);
  return axios.post(this.URL+'getOrders',params,config)
}

getRestaurants(cateId){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
    params.append('cateId',cateId);
  return axios.post(this.URL+'getrestaurant',params,config)
}
getHotelCategories(){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
  return axios.post(this.URL+'getCategories',params,config)
}
getFoodItems(resId){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      params.append('restId',resId);
  return axios.post(this.URL+'getfoodbyreshot',params,config) 
}

getsearch(text){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      params.append('searchText',text);
  return axios.post(this.URL+'getsearch',params,config) 
}

getHotelsbyLocation(lat,long){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      let location = {
        lat : lat,
        lon: long
      }
      params.append('location',JSON.stringify(location));
  return axios.post(this.URL+'gethotelsnearby',params,config) 
}

validate(cardInfo){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      let card ={
        number:cardInfo.number,
        month:cardInfo.month,
        year:cardInfo.year,
        cvc:cardInfo.cvc

      }
      console.log(JSON.stringify(card))
      params.append('card',JSON.stringify(card));
  return axios.post(this.URL+'createToken',params,config) 
}
charge(charge){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      let chargeInfo ={
        amount:charge.amount,
        token:charge.token

      }
      console.log(JSON.stringify(chargeInfo))
      params.append('charge',JSON.stringify(chargeInfo));
  return axios.post(this.URL+'chargepayment',params,config) 
}

submitRating(rating){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      const params = new URLSearchParams();
      let ratingInfo ={
        value:rating.value,
        rest_id:rating.rest_id,
        order_id:rating.order_id
      }
      console.log(JSON.stringify(ratingInfo))
      params.append('rating',JSON.stringify(ratingInfo));
  return axios.post(this.URL+'rating',params,config) 
}

selectRating(){
  const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
      
  return axios.get(this.URL+'selectrating')
}

}
