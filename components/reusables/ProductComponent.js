import React,{ Component } from 'react';
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Dimensions,Image,ImageBackground,TouchableHighlight,FlatList} from 'react-native';
import ImageSlider from 'react-native-image-slider';
import { Button,Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from "react-native-easy-grid";
import RcIf, {RcElse} from 'rc-if';
import { LinearGradient } from 'expo-linear-gradient'
import NumericInput from 'react-native-numeric-input'

export default class ProductComponent extends Component {
  constructor() {
  super();
    }
  states={
    'data':[]
  }

  render(props){
      let {product,addTocart} = this.props;
      console.log("product"+product);
      this.setState({
        'data':product
      })
    const  renderItem = (item)=>{
          return (
            <View style={{flex: 1, flexDirection: 'row'}}>
                   <View style={{width: 75, height: 75, backgroundColor: 'powderblue'}} >
                    <Image resizeMode='cover' source={{ uri:  item.product_image}}></Image>

                   </View>
                   <View style={{width:50 , height: 50, backgroundColor: 'powderblue'}}>
                            <Row>
                                <Text>{item.product_name}</Text>
                            </Row>
                            <Row>
                            <Text>{item.product_price} per {item.product_quantity}</Text>
                            </Row>
                    </View>
                    <View>
                          <Row>
                          </Row>
                          <Row>
                          <NumericInput
        value={this.state.value}
        onChange={value => console.log(value)}
        onLimitReached={(isMax,msg) => console.log(isMax,msg)}
        totalWidth={240}
        totalHeight={50}
        iconSize={25}
        step={1.5}
        valueType='real'
        rounded
        textColor='#B0228C'
        iconStyle={{ color: 'white' }}
        rightButtonBackgroundColor='#EA3788'
        leftButtonBackgroundColor='#E56B70'/>
                          </Row>
                    </View>
            </View>
          )
        }
          return(
            <FlatList
           numColumns={3}
           data={this.state.data}
           renderItem={({ item }) => this.renderItem(item)}
             />
          )
  }


}
