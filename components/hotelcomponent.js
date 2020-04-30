import React,{ Component } from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,ToastAndroid,AsyncStorage} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import ApiService from '../Services/ApiService';
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient';
import CartButton from './common/cartButton'
import { SplashScreen } from 'expo';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class HotelComponent extends Component {
    constructor(props){
        super(props);
        this.onPress = this.onPress.bind(this);
    }

    state={
        'hotels':[]
    }
    UNSAFE_componentWillMount(){
      
    }
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
        let api = new ApiService();
        api.getHotelsbyLocation(latitude,longitude).then(result=>{
            console.log(result.data);
            this.setState({
                hotels:result.data
            })
        })
    
      };
    componentWillMount(){
      this._getLocationAsync();
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
            console.log(this.props);
            this.props.props.navigation.navigate('table')
      } 
  render(){
      console.log("hote;s"+this.state.hotels);
      return(
        <View style={{flex:1}}>
            <ScrollView horizontal={true}>
                {
                    this.state.hotels.map((hotel)=>[
                        <TouchableHighlight
  onPress={() => this.onPress(hotel) }
  style={{flex:1}}>
                        <View style={{margin:5}}>
                        <Card
                        title={hotel.name}
                        image={{ uri: hotel.image.trim()}}>
                        <Text style={{marginBottom: 10}}>
                          Location : {JSON.parse(hotel.address).location}
                        </Text>
                        <Text style={{fontWeight:'bold'}}>{hotel.rating}   <Icon style={{color:'#000',marginRight:15, }} name="star" size={10} />  </Text>
                      </Card>
                        </View>
                        </TouchableHighlight>
                       
                    ])
                }
            </ScrollView>
        </View>

      )
  }
}

