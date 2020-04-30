import React,{ Component } from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList,AsyncStorage,ToastAndroid,TouchableOpacity} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card,ListItem,SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import ApiService from '../Services/ApiService';
import Accordion from 'react-native-collapsible/Accordion';
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient'
import ProductComponent from './reusables/ProductComponent'
import NumericInput from 'react-native-numeric-input'
import Counter from "react-native-counters";
import InputSpinner from "react-native-input-spinner";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

export default class RestaurantScreen extends Component{
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    const { params = {} } = navigation.state;
    const api = new ApiService();
    const navigate = () => {
      let cartCount = 0 ;
      AsyncStorage.getItem('cart').then((value) => {
        console.log(value);
        if(value !== null){
              let parsed = JSON.parse(value);
              let added = false;
              parsed.forEach(function(product){
                    if(product.value>0){
                      cartCount = cartCount+1
                    }
                     })
              console.log(value);

        }
        if(cartCount>0)
        {navigation.navigate('Cart')}
        else {ToastAndroid.show('Please Add Items to Cart', ToastAndroid.SHORT)}
      }).catch((e) =>{
        console.log("error" + e);
      })
      }
    return {
      headerStyle: {
      backgroundColor: '#FFA500',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
        headerRight:(<View><Icon style={{color:'#fff',marginRight:15, }} name="cart-plus" size={30} onPress={() => navigate()} /></View>),

      title:'',
      headerLeft:(<View style={{flexDirection:'row', flexWrap:'wrap'}}>
      {/* <Image style={{width:40,height:40,margin:20}} source={{uri:api.URL+"?url=/home/ubuntu/SlvStoreServer/Server/uploads/slv.jpeg"
     }}/> */}
      </View>)
    };
}
api = new ApiService();

  constructor(){
    super();
    this.state = {
      'products':[],
      'cartCount':0,
      'isreloaded':false,
        'loading':false,
          'checkinternet':false,
          'search': '',
          'menu':[]
    }
    this.getproducts = this.getproducts.bind(this);
    this.updateSearch = this.updateSearch.bind(this);

    this.searchFilterFunction = this.searchFilterFunction.bind(this);
    this.onPress = this.onPress.bind(this);
  
  }
  arrayholder = [];
async setProduct(item,num){
      console.log(item);
      try {
        console.log(num);
        AsyncStorage.getItem('cart').then((value) => {
          console.log("value"+value);
            if(value !== null){
                  let parsed = JSON.parse(value);
                  let added = false;
                  parsed.forEach(function(product){
                    if(product.value>0){

                    }
                    if(product.product_id === item.product_id){
                      console.log('number === === === == == = = ='+num);
                      product.value = num
                      added = true;
                  }
                  })
                  if(added === false){
                      item.value = num;
                      parsed.push(item);

                  }
                  AsyncStorage.setItem('cart', JSON.stringify(parsed));
            }
            else{
              let productArray = []
              item.value = num;
              productArray.push(item)
              AsyncStorage.setItem('cart', JSON.stringify(productArray));
            }

        })

 } catch (error) {
   // Error saving data
 }

  }
  updateSearch = search => {
    this.setState({ search });
  };

  searchFilterFunction = text => {  
    console.log(text); 
    this.setState({ search:text }); 
    const newData = this.arrayholder.filter(item => {      
      const itemData = `${item.restaurant_name.toUpperCase()}`;
      console.log(text);
       const textData = text.toUpperCase();
       return itemData.indexOf(textData) > -1;    
    });
      console.log(JSON.stringify(newData));
    this.setState({ products: newData });  
  };
  getproducts(){
    const { navigation } = this.props;
    this.setState({
      'loading':true
    })
    this.api.getRestaurants(navigation.getParam('catId')).then(res=>{
      console.log('result+++++'+res.data);
      this.setState({
        'products':res.data,
        'isreloaded':true
      })
      
    })
    navigation.addListener('willFocus', () => {
      
    })
  }
  componentWillMount(){

    this.getproducts();

  }

  
  renderItem(item){
    console.log(item.address);
    return (
      <TouchableHighlight
  onPress={() => this.onPress(item) }
  style={{flex:1}}>
   <Card
                        title={item.name}
                        image={{ uri: item.image }}>
                        <Text style={{marginBottom: 10}}>
                          Location : {JSON.parse(item.address).location}
                        </Text>
                        <Text style={{fontWeight:'bold'}}>{item.rating}   <Icon style={{color:'#000',marginRight:15, }} name="star" size={10} />  </Text>
                      </Card> 
  </TouchableHighlight>
                        
    
    )
  }
      async removeItemValue(key) {
        try {
          await AsyncStorage.removeItem(key);
          return true;
        }
        catch(exception) {
          return false;
        }
      }
      onPress = (item) =>{
        console.log(item);
            AsyncStorage.setItem('restaurant',JSON.stringify(item));
            this.removeItemValue('cart');
            this.props.navigation.navigate('table')
      } 
    render(){
      console.log('render+++')
      console.log("res"+JSON.stringify(this.state.products))
  
      if (!this.state.isreloaded) {
            return null
         }
         console.log("loading"+this.state.loading);
              return([
                 <SearchBar
                 placeholder="Type Here..."
                 lightTheme        
                 round
                 onChangeText={(text) => this.searchFilterFunction(text)}
                 autoCorrect={false}
                 value = {this.state.search}
                />,
                <RcIf if={this.state.products.length>0}>
                  <FlatList
                  keyExtractor={(product)=>product.id}
                  data={this.state.products}
                  renderItem={({item}) => this.renderItem(item)}
                   />

               </RcIf>,
              <RcIf if={this.state.products.length == 0}>
                 <View style={{
             position: 'absolute',
           top: 0, left: 0,
          right: 0, bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'}}>
                <Text> No Products to show </Text>
                </View>
              </RcIf>,
              <View style={{
          position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'}}>
                <RcIf if={this.state.checkinternet}>
                  <View styles={{flex:1}}>
                    <Text style={{color:'white',backgroundColor:'orange',fontWeight: 'bold', fontSize: 15}}> Please check the internet connection</Text>
                      <Button
                    title="Retry"
                    color="#90A4AE"
                    onPress={() => this.getproducts}/>
                  </View>
                </RcIf>
              </View>

              ]
              )


    }

}
