import React, { Component } from 'react';

import { StyleSheet, View, Text, Image,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
export default class CartButton extends Component {
  state ={
    'prop':{}
  }
  constructor (props) {
        super(props);

          console.log(this.props)
          this.setState({
            'prop':props
          })

    }


  render() {
  const navigate = ()=>{
        this.props.navigation.navigate('Cart')
        console.log('props'+JSON.stringify(this.props))
    }

    return ([
      <View style={{ flexDirection: 'row',margin:10 }}>
      <TouchableOpacity onPress={() => navigate() }>
      <Icon
        name="cart-plus"
        size={40}
        color="white"
      />
      </TouchableOpacity>
      </View>
    ]);
  }
}
