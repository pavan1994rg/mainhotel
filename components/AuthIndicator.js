import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

class AuthLoadingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
      backgroundColor: '#FFA500',
    },
    title:'',
    headerShown: false,
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    };
  }
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const {navigation} = this.props
    AsyncStorage.getItem('phone').then((value) => {
        if(value !== null ){
         const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Home' })],
                });
          navigation.dispatch(resetAction);
        }
        else{
         const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Login' })],
                });
                  navigation.dispatch(resetAction);
        }
   })
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={style.loading}>
        <ActivityIndicator size='large' color="#ffa500"/>
      </View>
    );
  }
}

const style = StyleSheet.create({
  loading: {
   position: 'absolute',
   left: 0,
   right: 0,
   top: 0,
   bottom: 0,
   alignItems: 'center',
   justifyContent: 'center'
 }
})

export default AuthLoadingScreen;
