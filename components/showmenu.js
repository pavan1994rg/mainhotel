import React,{ Component } from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList,AsyncStorage,ToastAndroid,TouchableOpacity} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card,ListItem,SearchBar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import ApiService from '../Services/ApiService';
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient'
import ProductComponent from './reusables/ProductComponent'
import NumericInput from 'react-native-numeric-input'
import Counter from "react-native-counters";
import InputSpinner from "react-native-input-spinner";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

export default class ShowMenu extends Component{
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

  constructor(){
    super();
    this.state = {
      'products':[],
      'cartCount':0,
      'isreloaded':false,
        'loading':false,
          'checkinternet':false,
          'search': '',
          'food':[],
          'menu':[]
    }
    this.getmenu = this.getmenu.bind(this);
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
      const itemData = `${item.product_name.toUpperCase()}`;
      
       const textData = text.toUpperCase();
       console.log("f"+itemData);
       console.log("s"+textData);
       return itemData.indexOf(textData) > -1;    
    });
      
    this.setState({ food: newData });  
  };
  getmenu(){
    const { navigation } = this.props;
    this.setState({
      'loading':true
    })
   
    
    navigation.addListener('willFocus', () => {
          console.log('componenet ==================================================  ==========')
     
      const api = new ApiService();
      let products;
      let menuItems = [];       
      api.getMenuCategories().then(result=>{
           this.setState({'menu':result.data})
           AsyncStorage.getItem('restaurant').then((value)=>{
             console.log(value);
            if(value!== null){
              api.getFoodItems(JSON.parse(value).id).then(result=>{
                console.log(JSON.stringify(result.data));
                result.data.forEach((row)=>{
                  row.product_image = row.product_image.replace("localhost", "192.168.0.105");
                })
                    this.setState({'food':result.data,'isreloaded':true})
                    AsyncStorage.getItem('cart').then((value) => {
                      console.log("noew"+value);
                        if(value!==null){
                          products = JSON.parse(value)
                          result.data.forEach(function(row){
            
                            row.value = 0;
                              products.forEach(function(product){
                                if(product.product_id === row.product_id){
                                  console.log("value ======= ======= ======"+product.value)
                                  row.value = product.value
                                }
                              })
                          })
                        }
            
                        this.setState({
                            'food':[],
                            'loading':false
                          })
                        this.setState({
                            'food':result.data,
                            'isreloaded':true
                          })
                          this.arrayholder = this.state.products;
                          console.log('products+++++'+JSON.stringify(this.state.products));
                  })
                    this.arrayholder = result.data;
              })
            }
          })
           
      })                                              
      
     


      // api.getproducts(navigation.getParam('catId')).then(res=>{
      //   console.log('result+++++'+res.data);
      //   res.data.forEach(function(row){
      //    row.product_image = row.product_image.replace('localhost','192.168.0.104');
      //   })
       


      // })
    })
  }
  componentWillMount(){

    this.getmenu();

  }

  
  renderItem(item){
    console.log('item'+item.product_image);
    console.log(this.state.menu.filter(row =>row.catId == item.product_category))
        return (
          <View>
          <Grid style={{flex:1,margin:10}} >
          <Row >
              <Col style={{width:60,marginRight:10}}>
                  <Image style={{width:50,height:75,marginRight:10}} source={{uri:item.product_image}} />
              </Col>
              <Col >
                    <Row>
                          <Text style={{color:'orange',fontWeight: 'bold', fontSize: 15}}>
                              {item.product_name} ({this.state.menu.filter(row =>row.catId == item.product_category)[0].category_name})
                          </Text>
                    </Row>
                    <Row>
                        <View>
                          <Text style={{ fontSize: 30,color:"black"}}>
                             {'\u20B9'}{item.product_price}
                          </Text>
                        </View>
  
                        <Text style={{ fontSize:15,color:"black" }}>
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
        </View>
        
        )
      }
      onPress = () => this.props.navigation.navigate('table')
      render(){
      console.log('render+++')
      console.log("res"+JSON.stringify(this.state.food))
  
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
             
                <RcIf if={this.state.food.length>0}>
                  <FlatList
                  keyExtractor={(product)=>product.product_id}
                  data={this.state.food}
                  renderItem={({item}) => this.renderItem(item)}
                   />

               </RcIf>,
              <RcIf if={this.state.food.length == 0}>
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

const style = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: "space-around"
    }
});