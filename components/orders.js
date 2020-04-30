import React,{ Component} from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList,AsyncStorage, Alert} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card,ListItem,Rating } from 'react-native-elements';
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
    constructor(){
        super();
        this.reorder= this.reorder.bind(this)
        this.ratingCompleted = this.ratingCompleted.bind(this);
        this.submit = this.submit.bind(this);

    }

    state={
        'orders':[],
        'rating':3,
        'refresh':false
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
                    this.api.selectRating().then(result=>{
                    res.data.forEach(row=>{
                      row.disabled = false;
                      result.data.forEach(order=>{
                          console.log(row.cartid === order.order_id);
                          if(row.cartid === order.order_id){
                            row.disabled = true;
                          }
                      })
                    })
                  })
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

    ratingCompleted = (value)=>{
      console.log(value);
      this.setState({'rating':value})


    }
    submit(order){
      let rating ={
        value:this.state.rating,
        rest_id:order.restaurant_id,
        order_id: order.cartid
      }
      this.api.submitRating(rating).then(result=>{
        result.data.forEach(res=>{
          this.state.orders.forEach(row=>{
            console.log(row.cartid === res.order_id);
            if(row.cartid === res.order_id){
              row.disabled = true;
              
              
            }
          })
        })
        this.setState({'refresh':!this.state.refresh})
      })
    }
    renderItem(item){
        return (
            <View>
                <Grid style={{flex:1,margin:10}} >
                <Text style={{borderRadius:10,borderWidth:2,borderColor:'#FFA500'}}> {item.token} </Text>
                  <Row>
                    <Col size={4}>
                      <RcIf if={!item.disabled}>
                      <Rating showRating onFinishRating={this.ratingCompleted} startingValue={3} />
                      </RcIf>
                    </Col>
                    <Col size={3} style={{margin:10}} >
                    <Button title="submit" onPress={() => this.submit(item)}   disabled = {item.disabled} ></Button>
                    </Col>
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
        extraData={this.state.refresh}
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

