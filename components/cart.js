import React,{ Component} from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList,AsyncStorage, Alert,Modal} from 'react-native';
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
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input"

export default class CartScreen extends Component{
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
  
  </View>)
    };
  }
  constructor(){
    super();
    this.state = {
      'products':[],
      'total':0,
      'loading':false,
      'location': null,
    'errorMessage': null,
    'outrange':false,
    'restaurant':'',
    'seats':0,
    'modalVisible': false,
    'card':{}
    }
    this.paycard = this.paycard.bind(this);
  }
  componentWillMount(){
    if (Platform.OS === 'android' && !Constants.isDevice) {
     this.setState({
       errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
     });
   } else {
     this._getLocationAsync();
   }
    const { navigation} = this.props;
    console.log(navigation.getParam('catId'))
    this.renderItem = this.renderItem.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeItemValue = this.removeItemValue.bind(this);
      let products;
      let cart=[];
      let total=0;
      AsyncStorage.getItem('restaurant').then((value)=>{
        console.log(JSON.stringify(value))
        this.setState({'restaurant':JSON.parse(value).name})
        AsyncStorage.getItem('table').then((value)=>{
          console.log(value)
          this.setState({'seats':value})
        })
      }) 
      AsyncStorage.getItem('cart').then((value) => {
        console.log(value);
          if(value!==null){
            products = JSON.parse(value)
            products.forEach(function(product){
              product.product_image = product.product_image.replace('35.232.2.21','35.223.39.14');
              console.log(product);
                  if(product.value !== 0){
                    cart.push(product)
                    if(product.selling_price !== 0){
                        total = total + (product.value * product.selling_price)
                    }
                    else{
                        total = total + (product.value * product.product_price)
                    }
                    console.log(total);
                  }
            })
          }
          else{

          }
          this.setState({
            'products':cart,
            'total':total
          })
    console.log("cart"+this.state.products)
    })
    this.addToCart = this.addToCart.bind(this);
    console.log("props === "+JSON.stringify(this.props))

  }
  _getDistance = () => {
  var dis = getDistance(
    { latitude: 20.0504188, longitude: 64.4139099 },
    { latitude: 51.528308, longitude: -0.3817765 }
  );
  alert(`Distance\n${dis} Meter\nor\n${dis / 1000} KM`);
};

_getPreciseDistance = (to ,from) => {
  var pdis = getPreciseDistance(
    from,to
  );
  
  if(pdis/1000<6){
    this.setState({
      'outrange':false
    })
  }
  else{
    this.setState({
      'outrange':true
    })
  }
};

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       errorMessage: 'Permission to access location was denied',
     });
   }

   let location = await Location.getCurrentPositionAsync({});
   this.setState({ location });
   console.log(this.state.location)
   let coord =  JSON.stringify(this.state.location)
   console.log(JSON.parse(coord));

   let latitude = JSON.parse(coord).coords.latitude
   let longitude = JSON.parse(coord).coords.longitude
   console.log(longitude)
   console.log(latitude)
   this._getPreciseDistance({'latitude':latitude,'longitude':longitude},{'latitude':12.926038325104091,'longitude':77.5442934036255});
   console.log(this.state.location)
 };
  async setProduct(item,num){
        console.log(item);
        let total=0;
        try {
          console.log(num);
          AsyncStorage.getItem('cart').then((value) => {
            console.log("value"+value);
              if(value !== null){
                    let parsed = JSON.parse(value);
                    let added = false;
                    parsed.forEach(function(product){
                      if(product.product_id === item.product_id){
                        console.log('numm ++++ '+num);
                        product.value = num
                        console.log(total);
                    }
                    if(product.value>0){
                      if(product.selling_price !== 0){
                          total = total + (product.value * product.selling_price)
                      }
                      else{
                          total = total + (product.value * product.product_price)
                      }
                    }
                    })
                    this.setState({
                      'total':total
                    })
                      AsyncStorage.setItem('cart', JSON.stringify(parsed));
              }


          })


   } catch (error) {
     // Error saving data
   }

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


 alertMessage (){
 
 }

_onChange =(form)=>{
console.log(form);
let info = {
  number:form.values.number.trim(),
  month:form.values.expiry.split('/')[0],
  year:form.values.expiry.split('/')[1],
  cvc:form.values.cvc
}
this.setState({
  'card':info
})

}
showAlert = (message) =>{
      Alert.alert(
         message
      )
}

  addToCart(token){
   
        let api = new ApiService();
        let order = {};
        let cart = [];
        const showAlert = (message) =>{
      Alert.alert(
         message
      )
   }
  
  
     AsyncStorage.getItem('phone').then((value) => {
       console.log('phone ==== ===== ===== '+ value);
       if(value !== null){
           order.phone = value;
           this.setState({
             'loading':true
           })
         }
       AsyncStorage.getItem('cart').then((product) => {
             if(product!==null){
               let parsedValue = JSON.parse(product)
                   parsedValue.forEach(function(item){
                     if(item.value !== 0){
                       cart.push(item)
                     }
                   })

             }
             order.orders = JSON.stringify(cart);
             order.total = this.state.total;
             console.log('stringify'+ JSON.stringify(order));
            //  Alert.alert( title 'Hello', body 'I am two option alert. Do you want to cancel me ?', [ {text: 'Yes', onPress: () => console.log('Yes Pressed')}, {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'}, ], { cancelable: false } //clicking out side of alert will not cancel )
          AsyncStorage.getItem('restaurant').then((restaurant)=>{
            if(restaurant){
              order.restId = JSON.parse(restaurant).id
              order.token = token
            
            }
            api.addToCart(JSON.stringify(order)).then((res)=>{
              console.log('order ===== '+JSON.stringify(res.data));
              if(res.data.accepted.length>0){
                  this.removeItemValue('cart');
                  this.removeItemValue('restaurant');

                  showAlert('Order Placed Successfully');
                  this.state.products = [];
              }
              else{
                showAlert('Something Went Wrong');
              }
              this.setState({
                'loading':false
              })
              this.props.navigation.popToTop()
          })  
          })
          
            
           
             

       })

     })
   


  }
  renderItem(item){
        return (
        <Grid style={{flex:1,margin:10}} >
        <Row >
            <Col style={{width:60,marginRight:10}}>
                <Image style={{flex:1,width:60,height:60}} source={{ uri:  item.product_image}}/>
            </Col>
            <Col >
                  <Row>
                        <Text style={{color:'orange',fontWeight: 'bold', fontSize: 15}}>
                            {item.product_name}
                        </Text>
                  </Row>
                  <Row>
                    <RcIf if={item.selling_price!=0}>
                        <View>
                          <Text style={{ fontSize: 30,color:"grey",textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>
                             {'\u20B9'}{item.product_price}
                          </Text>
                          <Text style={{ fontSize: 30,color:"black"}}>
                             {'\u20B9'}{item.selling_price}
                          </Text>
                        </View>

                    </RcIf>
                    <RcIf if={item.selling_price == 0}>
                      <View>
                        <Text style={{ fontSize: 30,color:"black"}}>
                           {'\u20B9'}{item.product_price}
                        </Text>
                      </View>

                    </RcIf>
                  <Text style={{ fontSize:15 }}>
                      <Text>{"\n"} {"   "}for {item.product_quantity} </Text>
                  </Text>
                  </Row>
            </Col>
            <Col style={{marginLeft:20}}>
            <Row>
            </Row>
            <Row>
              <InputSpinner
              max={10}
              min={0}
              step={1}
              colorMax={"#f04048"}
              colorMin={"#40c5f4"}
              value={item.value}
              fontSize={14}
              width={110}
              height={30}
              inputStyle={{margin:2}}
              buttonFontSize={20}
              buttonStyle={{width:30,height:30}}
              onChange={(num) => {
              this.setProduct(item,num)
             }}
                 />
            </Row>
            </Col>
        </Row>
        <Row style={{borderBottomColor: '#DCDCDC',borderBottomWidth: 2,marginBottom:10,marginTop:30}}>
        </Row>
        </Grid>
        )
      }
    
     toggleModal(visible) {
        this.setState({ modalVisible: visible });
     }
     paycard = ()=>{
      let api = new ApiService();
      api.validate(this.state.card).then(result=>{
        console.log(result.data);
        if(result.data.code){
          this.showAlert(result.data.code);
        }
        if(result.data.id){
          let charge ={
            token:result.data.id,
            amount:this.state.total
          }
          api.charge(charge).then(result=>{
            console.log(result.data);
            if(result.data.paid){
              this.showAlert("Payment Successfull");

              this.addToCart(charge.token)
            }
          })
        }
      })
     }
    render(){
  console.log(this.state.products);
              return(
    <View style={{flex: 1}}>
       <Text style={{color:'orange',fontWeight: 'bold',fontSize:20,margin:10 }}>Restaurant : {this.state.restaurant}</Text>
              <Text style={{color:'orange',fontWeight: 'bold',fontSize:20,margin:10 }}>Seats : {this.state.seats}</Text>
    <View style={{flex: .9}}>
      <RcIf if={!this.state.loading}>
        <FlatList
        keyExtractor={(product)=>product.product_id}
        data={this.state.products}
        renderItem={({ item }) => this.renderItem(item)}
         />
        <RcElse>
          <View style={{

      position: 'absolute',
    top: 0, left: 0,
    right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'}}>
  <Bars size={10} color="#ffa500" />
</View>
    </RcElse>
      </RcIf>
    </View>
    <View style={{flex: .1,borderWidth:2,borderColor:'grey'}} >
      <RcIf if= {this.state.outrange}>
      <Text style={{color:'orange',fontWeight: 'bold',fontSize:20,margin:10 }}> Distance out of Delivery Range </Text>
      </RcIf>
        <RcIf if={!this.state.loading && !this.state.outrange}>
      <Grid>
        <Row>
        <Col>
          <Text style={{color:'orange',fontWeight: 'bold',fontSize:20,margin:10 }}> Total Amount :</Text>
        </Col>
        <Col>
            <Text style={{fontSize:30}}> {'\u20B9'}{this.state.total} </Text>
        </Col>
        </Row>
      </Grid>
    </RcIf>
    </View>
    <View style={[{ width: "100%" }]}>
      <RcIf if={!this.state.loading}>
    <Button
  title="Place Order"
  color="#90A4AE"
  disabled = {this.state.outrange}
  onPress={() => this.toggleModal(true) }
         />
     </RcIf>
      </View>

      <View >
  <Modal animationType = {"slide"} transparent = {false}
     visible = {this.state.modalVisible}
     onRequestClose = {() => { console.log("Modal has been closed.") } }>
     
     <View style = {styles.modal}>      
        <TouchableHighlight onPress = {() => {
           this.toggleModal(!this.state.modalVisible)}}>
           <Text style = {styles.text}>Close</Text>
        </TouchableHighlight>

     </View>
     <View style={{marginBottom:30}} >
     <CreditCardInput onChange={this._onChange} />
     </View>
     <View style={[{ width: "100%" }]}>
      <RcIf if={!this.state.loading}>
    <Button
  title="Pay Card"
  color="#90A4AE"
  disabled = {this.state.outrange}
  onPress={() => this.paycard() }
         />
     </RcIf>
      </View>
  </Modal>

</View>
</View>
  

              )


    }

}

const styles = StyleSheet.create ({
   container: {
      alignItems: 'center',
      backgroundColor: '#ede3f2',
      padding: 100
   },
   modal: {
      flex: 1,
      padding:20
   },
   text: {
      color: '#3f2949',
      textAlign:'right'
   }
})
