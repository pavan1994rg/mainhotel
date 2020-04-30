import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './components/home';
import RestaurantScreen from './components/restaurants';
import  CartButton  from './components/common/cartButton';
import CartScreen from './components/cart';
import LoginScreen from './components/login';
import Otpscreen from './components/token'
import AuthLoadingScreen from './components/AuthIndicator'
import AboutScreen from './components/about'
import Orders from './components/orders'
import HotelComponent   from './components/hotelcomponent';
import TableViewComponent  from "./components/tableview";
import ShowMenu from "./components/showmenu";
import SearchScreen  from './components/search';
let prop;
const navigator = createStackNavigator(
  {
    Auth:AuthLoadingScreen,
    Home: HomeScreen,
    Restaurant:RestaurantScreen,
    Cart:CartScreen,
    Login:LoginScreen,
    token:Otpscreen,
    About:AboutScreen,
    Orders:Orders,
    Hotel:HotelComponent,
    table:TableViewComponent,
    show:ShowMenu,
    search:SearchScreen
  },
  {
    initialRouteName: 'Auth',
  }
);


const AppContainer = createAppContainer(navigator);
export default AppContainer;
