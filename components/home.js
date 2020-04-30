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
import HotelComponent   from './hotelcomponent';
export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    const { params = {} } = navigation.state;
     api = new ApiService();
    // console.log("apiurl"+api.URL+"?url=D:\\Development\\SlvStoreServer\\Server/uploads/slv.jpeg")
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
    headerRight:(<View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <Icon style={{color:'#fff',marginRight:15, }} name="cart-plus" size={30} onPress={() => navigate()} />
        <Icon style={{color:'#fff',marginRight:15, }} name="search" size={30} onPress={() =>{navigation.navigate('search')}} />
        <Icon style={{color:'#fff',marginRight:15, }} name="history" size={30} onPress={() =>{navigation.navigate('Orders')}} />
      </View>),
      title:'',
      headerLeft:(<View style={{flexDirection:'row', flexWrap:'wrap'}}>
       
      {/* <Image style={{width:40,height:40,margin:20}} source={{uri:api.URL+"?url=/home/ubuntu/SlvStoreServer/Server/uploads/slv.jpeg"
     }}/> */}
    </View>)
    };
}
  constructor (props) {
        super(props);
        let cart = new CartButton(this.props)
        this.navigate = this.navigate.bind(this);
        this.getCategories = this.getCategories.bind(this);
    }
     api = new ApiService();
  componentWillMount() {
    console.log("hotel"+HotelComponent);
    this.state = {
      "categories_left":[],
      "categories_right":[],
      'row_length':0,
      'top_categories':[],
      'checkinternet':false
    }

    console.log("categories"+this.state.top_categories);
    
    api.checkInternt().then(connection=>{
      console.log("conn"+connection)
      if(connection){
        this.setState({
          'checkinternet': false
        })
      }
      else{
        this.setState({
          'checkinternet': true
        })
      }
    })
    this.getCategories();
    // let leftcolumns =[];
    // let rightcolumns =[];
    // api.getCategories().then((res)=>{
    //   console.log(res.data);
    //       res.data =  res.data.filter((row)=>{
    //         return (!row.cateId.includes('splcat'));
    //       })
    //   // if(res.data.length%2 === 0){
    //   //   this.state.row_length = res.data.length/2
    //   // }else{
    //   //   this.state.row_length = res.data.length+1/2
    //   // }
    //   res.data.forEach(function(row,index){
    //       console.log(index);
    //       if(index%2 == 0){
            
    //         leftcolumns.push(row)
    //       }
    //       else{
           
    //         rightcolumns.push(row)
    //       }

    //   })
    //   this.setState({
    //     'categories_left':leftcolumns,
    //     'categories_right':rightcolumns
    //   })

    // })

    }
    getCategories(){
      
     
     let category_images = [
      'E:\\Bits\\SlvStoreServer\\Server/uploads/ethnic.jpg',
      'E:\\Bits\\SlvStoreServer\\Server/uploads/family.png',
     'E:\\Bits\\SlvStoreServer\\Server/uploads/fast_cusine.png',
       'E:\\Bits\\SlvStoreServer\\Server/uploads/fastfood.png',
     'E:\\Bits\\SlvStoreServer\\Server/uploads/fine.png',
      'E:\\Bits\\SlvStoreServer\\Server/uploads/causal.jpg'
      ]
      let categories = [
        'Ethnic',
        'Family',
        'Fast Cusine',
        'Fast Food',
        'Fine',
        'Casual Dining'
      ]
      cateIds=[
        '100',
        '111',
        '112',
        '113',
        '114',
        '115'

      ]

      let categoryData = [];
       category_images.forEach((category,index)=>{
          categoryData.push({cateId:cateIds[index],category_image: category,category_name:categories[index]})
       })
       let leftcolumns =[];
       let rightcolumns =[];
       

         
      console.log("categories"+this.state.top_categories);
      const api = new ApiService();
      api.checkInternt().then(connection=>{
        console.log("conn"+connection)
        if(connection){
          this.setState({
            'checkinternet': false
          })
          categoryData.forEach(function(row,index){
            console.log(index);
            if(index%2 == 0){
              leftcolumns.push(row)
            }
            else{
              rightcolumns.push(row)
            }

        })
        this.setState({
          'categories_left':leftcolumns,
          'categories_right':rightcolumns
        })
        }
        else{
          this.setState({
            'checkinternet': true
          })
        }
      })
      
     

      
      // api.getCategories().then((res)=>{
      //   console.log(res.data);
      //       res.data =  res.data.filter((row)=>{
      //         return (!row.categoryID.includes('splcat'));
      //       })
      //   if(res.data.length%2 === 0){
      //     this.state.row_length = res.data.length/2
      //   }else{
      //     this.state.row_length = res.data.length+1/2
      //   }
      //   res.data.forEach(function(row,index){
      //       console.log(index);
      //       if(index%2 == 0){
      //         leftcolumns.push(row)
      //       }
      //       else{
      //         rightcolumns.push(row)
      //       }

      //   })
      //   this.setState({
      //     'categories_left':leftcolumns,
      //     'categories_right':rightcolumns
      //   })

      // })
    }
    navigate(catID){
        this.props.navigation.navigate('Restaurant', {
          catId:catID
        })
    }
   render(){
     const top_categories=[];
     const apiUrl = new ApiService();
     top_categories.push({'name':'Top Sold','icon':'money','id':'splcat1'})
     top_categories.push({'name':'Seasonal','icon':'cloud','id':'splcat2'})
     top_categories.push({'name':'Top Discounts','icon':'sort-numeric-desc','id':'splcat3'})
     top_categories.push({'name':'Newly Arrived','icon':'truck','id':'splcat4'})
     const images = [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
      'https://im1.dineout.co.in/images/uploads/restaurant/sharpen/6/x/w/p63342-15686142055d7f273d3bce7.jpg?tr=tr:n-medium'
    ]
      console.log("left ==="+this.state.categories_left);

   
    console.log("url"+apiUrl.URL);
const deviceWidth = Dimensions.get('window').width;
     return (
       <View style={{flex: 1}}>
         
        <ScrollView >
      <View >
       <ImageSlider
       autoPlayWithInterval={3000}
       images={images}
       style={{height:200,width:Dimensions.get('window').width,resizeMode:'stretch'}}/>
   </View>
       <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
    }}>
    {/* <ImageBackground
         style={{ width: '100%',flex:1}}
         source={{uri:apiUrl.URL+"?url=E:\\Bits\\SlvStoreServer\\Server/uploads/pattern.jpg"}}>
        <Grid style={{margin:5,backgroundColor:'#ffffff'}}>
        <ImageBackground
             style={{ width: '100%',flex:1}}
             source={{uri:apiUrl.URL+"?url=E:\\Bits\\SlvStoreServer\\Server/uploads/pattern.jpg"}}>
          <Row>
            {top_categories.map(top=>
              <Col style={{ flex: 1}}>
                <TouchableHighlight
      style={styles.submit}
      onPress={() => {console.log('hello')}}
      underlayColor='#fff'>
              <Icon
             raised
          name={top.icon}
          type='font-awesome'
           color='#f50'
           size={30}
           style={{textAlign:'center'}}
          onPress={() => this.navigate(top.id)}
           />
       </TouchableHighlight>
           <Text style={{flex:1, color:'white', alignItems: 'center', justifyContent: 'center',textAlign: 'center',fontWeight: 'bold', }}>
           {top.name}
           </Text>
              </Col>
    )}
            </Row>
            </ImageBackground>
          </Grid>
</ImageBackground> */}
<ImageBackground
         style={{ width: '100%',flex:1}}
         source={{uri:"https://lh3.googleusercontent.com/proxy/dOMiohaHeZeFkQx2ca_mW2PXGcXa1B_y2hmWVi38-TSqV5Mvn1H_wUTWl61LGSbUg_-mXrfTBKK1bZ5l3Bmx_dJUx2FFqUL0n_oID-Uj-A6892YvCtHcRg05rsGRzwMQmEmHoArv"}}>
  <Text style={{fontWeight:'bold',margin:10}}>Top Hotels</Text>
<HotelComponent props={this.props}/>

</ImageBackground>   
<ImageBackground
         style={{ width: '100%',flex:1}}
         source={{uri:"https://images.template.net/wp-content/uploads/2014/10/Untitled-4-copy1.jpg"}}>
<Text style={{fontWeight:'bold',color:'#fff',margin:5,fontSize:15}}>
   Restaurant Categories
</Text>  
</ImageBackground> 
    <Grid style={{height:Dimensions.get('window').height,flexDirectfion:'column' }}>

    <Col >
    {this.state.categories_left.map(res=>[
      <TouchableHighlight
  onPress={() => this.navigate(res.cateId)}
  style={{flex:1}}>
      <Row>
        <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: "#ffffff", flex: 1 }}>
        <ImageBackground
             style={{ width: '100%',flex:1}}
             source={{uri: apiUrl.URL+"?url="+res.category_image}}>
              <Text style={styles.innerText}>{res.category_name}</Text>
             </ImageBackground>
      </View>
      </Row>
      </TouchableHighlight>
    ])}
    </Col>
    <Col >
    {this.state.categories_right.map(res=>[
      <TouchableHighlight
  onPress={() => this.navigate(res.cateId) }
  style={{flex:1}}>
      <Row>
        <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: "#ffffff", flex: 1}}>
        <ImageBackground
             style={{ width: '100%',flex:1}}
             source={{uri: apiUrl.URL+"?url="+res.category_image}}>
              <Text style={styles.innerText}>{res.category_name}</Text>
             </ImageBackground>

      </View>
      </Row>
       </TouchableHighlight>
    ])}
    </Col>

    </Grid>
    </View>

       </ScrollView >
       <RcIf if={this.state.checkinternet}>
         <View styles={{flex:1}}>
           <Text style={{color:'white',backgroundColor:'orange',fontWeight: 'bold', fontSize: 15}}> Please check the internet connection</Text>
             <Button
           title="Retry"
           color="#90A4AE"
           onPress={() => this.getCategories() }
                  />
         </View>
       </RcIf>
       </View>

     );
   }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  icon: {
    marginTop: 50,
    color: "#ffffff",
    fontWeight: '900',
    fontSize: 50
  },
  innerText:{
   color:'white',
   fontSize: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'rgba(52, 52, 52, 0.5)',

 },
 submit:{
   margin:10,
  paddingTop:20,
  paddingBottom:20,
  backgroundColor:'#ffffec',
  borderRadius:10,
  borderWidth: 1,
  borderColor: '#fff'
}
});
