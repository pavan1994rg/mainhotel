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
export default class SearchScreen extends Component{
    static navigationOptions = ({ navigation }) => {
        return {
          headerStyle: {
          backgroundColor: '#FFA500',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        };
    }
    constructor(props){
        super(props)
        this.search = this.search.bind(this);
        this.searchFilterFunction= this.searchFilterFunction.bind(this);
        this.renderItem = this.renderItem.bind(this);
        this.onPress = this.onPress.bind(this);
    }
    state={
        'search':'',
        'restaurant':[]
    }
    searchFilterFunction = text => {  
        console.log(text); 
        this.setState({ search:text }); 
      
      };
    search=()=>{
        let api = new ApiService();
        api.getsearch(this.state.search).then(result=>{
            console.log(JSON.stringify(result.data.hits));
            this.setState({
                'restaurant':result.data.hits.hits
            })
        })
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
        item.id = item._source.id;
            AsyncStorage.setItem('restaurant',JSON.stringify(item));
            this.removeItemValue('cart');
            this.props.navigation.navigate('table')
      }
    renderItem=(item)=>{
        console.log(item);
        return (
          <TouchableHighlight
      onPress={() => this.onPress(item) }
      style={{flex:1}}>
       <Card
                            title={item._source.name}
                            image={{ uri: item._source.image }}>
                           
                          </Card> 
      </TouchableHighlight>
                            
        
        )
      }
    render(){
        return(
            <View style={{flex:1}}>
                <Grid>
                    <Row>
                        <Col  size={5}>
                                    <SearchBar
                            placeholder="Type Here..."
                            lightTheme        
                            round
                            autoCorrect={false}
                            onChangeText={(text) => this.searchFilterFunction(text)}
                            value = {this.state.search}
                            />
                        </Col>
                        <Col size={1} >
                            <Icon style={{color:'#FFA500',margin:10, }} name="search" size={30} onPress={() => this.search()} />
                        </Col>
                    </Row>
                </Grid>
                <FlatList
                  keyExtractor={(product)=>product.id}
                  data={this.state.restaurant}
                  renderItem={({item}) => this.renderItem(item)}
                   />
            </View>
        )
    }

}
