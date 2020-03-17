import React,{ Component} from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList,AsyncStorage, Alert} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card,ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import ApiService from '../Services/ApiService';
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient'
import ProductComponent from './reusables/ProductComponent'
import NumericInput from 'react-native-numeric-input'
import Counter from "react-native-counters";
import InputSpinner from "react-native-input-spinner";
import Loader from "react-native-modal-loader";
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import { getDistance, getPreciseDistance } from 'geolib';

export default class Orders extends Component{
    static navigationOptions = ({ navigation }) => {
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
      <Image style={{width:40,height:40,margin:20}} source={{uri:'http://35.223.39.14:3002/?url=/home/akshatag145/slv.png'
      }}/>
      </View>)
        };
      }
    constructor(){
        super();
        this.reorder= this.reorder.bind(this)

    }

    state={
        'orders':[]
    }
     api = new ApiService();

     reorder(item){
        console.log(item);
        let orders = JSON.parse(item.cartorder)
        let orderItem = JSON.parse(orders);
        console.log("order items"+JSON.stringify(orderItem));
       
   try {    
            AsyncStorage.getItem('cart').then((value) => {
              console.log("value"+value);
                if(value !== null){
                      let parsed = JSON.parse(value);
                      let added = false;
                       Alert.alert(
                                'Duplicate Items',
                                'An Order is already in cart , do you want to add / replace ?',
                                [
                                  // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                                  {
                                    text: 'Cancel',
                                    onPress: () => this.setState({
                                      'loading':false
                                    }),
                                    style: 'cancel',
                                  },
                                  {text: 'Yes', onPress: () => {
                                    
                                    orderItem.forEach((order)=>{
                                         added = false;
                                    parsed.forEach(function(product){
                                        if(product.value>0){
                    
                                        }
                                        if(product.product_id === order.product_id){
                                          product.value = order.value
                                          added = true;
                                      }
                                      })
                                      if(added === false){
                                          parsed.push(order);
                    
                                      }
                                    })
                                      console.log("parsed"+JSON.stringify(parsed));
                                     AsyncStorage.setItem('cart', JSON.stringify(parsed));
                                

                                  }
                                  
                                }
                                ],
                                {cancelable: false},
                              );  
                          
                        //   else{
                        //     parsed.forEach(function(product){
                        //         if(product.value>0){
            
                        //         }
                        //         if(product.product_id === order.product_id){
                        //           console.log('number === === === == == = = ='+num);
                        //           product.value = order.value
                        //           added = true;
                        //       }
                        //       })
                        //       if(added === false){
                        //           parsed.push(order);
            
                        //       }
                        //      AsyncStorage.setItem('cart', JSON.stringify(parsed));
                        //     AsyncStorage.setItem(item.cartid,item.cartid);
                        //   }
                      
                     
                     
                }
                else{
                  let productArray = []
                  orderItem.forEach((order)=>{
                    productArray.push(order)
                    
                    })
                   
                    AsyncStorage.setItem('cart', JSON.stringify(productArray));
                  
                }
    
            })
    
     } catch (error) {
       // Error saving data
     }
        
     
     }
    componentWillMount(){
        AsyncStorage.getItem('phone').then((value) => {
            console.log('phone ==== ===== ===== '+ value);
            this.api.getOrders(value).then(res=>{
                if(res.data != undefined){
                    console.log(res.data);
                    this.setState({'orders':res.data});
                }
            })
            // if(value !== null){
            //     order.phone = value;
            //     this.setState({
            //       'loading':true
            //     })
            //   }
            })
     
    }
    renderItem(item){
        let orders = JSON.parse(item.cartorder)
        let orderItem = JSON.parse(orders);
        let text =""
       console.log("order length"+orderItem.length);
        return (
            <View>
                <Grid style={{flex:1,margin:10}} >
                  <Row>
                { !! orderItem.length>0 ? orderItem.map((order)=>{
                  text = text + order.product_name  + "("+"\u20B9 "+ order.product_price +")" + " : " +order.product_quantity +" x " + order.value+" || "

      }) : null   
                }
                <Text> {text} </Text>
                </Row>
                <Row style={{marginTop:7,width:"100%"}}>
                <Button
             title="Reorder"
             type="outline"
               color="#FFA500"
               onPress={() => this.reorder(item) }
         />
                </Row>
                <Row style={{borderBottomColor: '#DCDCDC',borderBottomWidth: 1,marginBottom:10,marginTop:30}}></Row>
             </Grid>
            </View>
      
        )
      }

     render(){
         return (
            <View>
            <FlatList
        keyExtractor={(order)=>order.cartid}
        data={this.state.orders}
        renderItem={({ item }) => this.renderItem(item)}
         />
            </View>

         )
     }


}
const styles = StyleSheet.create ({
    container: {
       padding: 10,
       marginTop: 3,
       backgroundColor: '#d9f9b1',
       alignItems: 'center',
    },
    text: {
       color: '#4f603c'
    }
 })

