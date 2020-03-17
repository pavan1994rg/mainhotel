import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './components/home';
import ProductsScreen from './components/products';
import  CartButton  from './components/common/cartButton';
import CartScreen from './components/cart';
import LoginScreen from './components/login';
import Otpscreen from './components/token'
import AuthLoadingScreen from './components/AuthIndicator'
import AboutScreen from './components/about'
import Orders from './components/orders'
let prop;
const navigator = createStackNavigator(
  {
    Auth:AuthLoadingScreen,
    Home: HomeScreen,
    Products:ProductsScreen,
    Cart:CartScreen,
    Login:LoginScreen,
    token:Otpscreen,
    About:AboutScreen,
    Orders:Orders
  },
  {
    initialRouteName: 'Auth',
  }
);


const AppContainer = createAppContainer(navigator);
export default AppContainer;
