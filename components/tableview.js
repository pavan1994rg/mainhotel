import React,{ Component } from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,ToastAndroid,AsyncStorage,Picker} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import ApiService from '../Services/ApiService';
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient';
import CartButton from './common/cartButton'
import { SplashScreen } from 'expo';

export default class TableViewComponent extends Component {
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
            // headerRight:(<View><Icon style={{color:'#fff',marginRight:15, }} name="cart-plus" size={30} onPress={() => navigate()} /></View>),
    
          title:'',
          headerLeft:(<View style={{flexDirection:'row', flexWrap:'wrap'}}>
          {/* <Image style={{width:40,height:40,margin:20}} source={{uri:api.URL+"?url=/home/ubuntu/SlvStoreServer/Server/uploads/slv.jpeg"
         }}/> */}
          </View>)
        };
    }
    constructor(props){
        super(props);
        this.setSelectedValue = this.setSelectedValue.bind(this);
        this.submit = this.submit.bind(this);
    }

    state={
        'hotels':[],
        selectedValue:'2',
        image:"https://cdn4.iconfinder.com/data/icons/real-estate-vol-2-3/52/41-512.png"
    }
    // UNSAFE_componentWillMount(){
    //     let hotelData =[];
    //     hotelData.push({id:'HOT111',name:'Slv Swadista',location:"Banashankari 2nd Stage",image:'https://content3.jdmagicbox.com/comp/bangalore/a5/080pxx80.xx80.130419152555.e7a5/catalogue/slv-swadistha-banashankari-2nd-stage-bangalore-home-delivery-restaurants-2q4reme.jpg', rate : 4.5})
    //     hotelData.push({id:'HOT112',name:'AnnaKuteera',location:"Banashankari 3rd Stage",image:'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRZAl2dk9dal6KMSF8iUOnGk7ktak6q-mizOAPN3sdyjjPrc12T', rate : 4.5})
    //     hotelData.push({id:'HOT113',name:'Mane Thindi',location:"Banashankari 3rd Stage",image:'https://media-cdn.tripadvisor.com/media/photo-s/02/fa/50/a2/mane-thindi.jpg', rate : 4.5})
    //     this.setState({
    //         hotels:hotelData
    // //     })
    // }

    submit()
    {
      
      console.log('herhe');
     AsyncStorage.setItem('table',this.state.selectedValue);
      this.props.navigation.navigate('show')

    }

    setSelectedValue(itemValue){
        console.log(itemValue);
        this.setState({
            selectedValue:itemValue
        })
        if(itemValue == "2"){
            this.setState({
                image:"https://cdn4.iconfinder.com/data/icons/real-estate-vol-2-3/52/41-512.png"
            })
        }
        else if(itemValue == "4"){
            this.setState({
                image:"https://us.123rf.com/450wm/alekseyvanin/alekseyvanin1804/alekseyvanin180400449/98767707-stock-vector-dining-table-and-four-chairs-top-view-vector-icon-filled-flat-sign-for-mobile-concept-and-web-design.jpg?ver=6"
            })
        }
        else{
            this.setState({
                image:"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT3kqN1-q3RdWxj7xoOin6iixVepRB31XlMipEVpkobc337GNaC&usqp=CAU"
            })
        }
    }
  render(){
      console.log("hote;s"+this.state.hotels);
     
      return([

        <View style={styles.container}>
        <Image style={{width:100,height:100,margin:20}} source={{uri:this.state.image}}/>
            <Text style={{fontWeight:'bold',fontSize:20, color:'#FFA500'}}>Select the Number of Seats</Text>
        <Picker
          selectedValue={this.state.selectedValue}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => this.setSelectedValue(itemValue)}
        >
          <Picker.Item label="2 Seats" value="2" />
          <Picker.Item label="4 Seats" value="4" />
          <Picker.Item label="10 Seats" value="10" />
        </Picker>
        
      </View>,
<View>
<Button
  title="Submit"
  color="#90A4AE"
  onPress={this.submit}
/>

</View>
      ])
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40,
      alignItems: "center"
    }
  });