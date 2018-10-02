import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Container, Content, Text, Button, Card, Footer } from 'native-base';
import Carousel from 'react-native-snap-carousel';

import {api} from './../../../api/playTimeApi'

import { Asset, AppLoading, Font } from 'expo';

import { entries } from './config';

import styles from './styles';

const deviceWidth = Dimensions.get('window').width;

const illustration = require('@assets/images/walkthrough3.png');

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state ={
      ready: false,
    }
    this.renderSlide = this.renderSlide.bind(this);
  }

  renderSlide({ item, index }) {
    console.log("Item rendering")
    return (
      <Card style={styles.slide.container}>
        <View>
          <Image source={illustration} style={styles.slide.illustration} />
          <Text style={styles.slide.title}>{item.name}</Text>
          <Text numberOfLines={4} style={styles.slide.subtitle}>
            {item.description}
          </Text>
          <Button
            transparent
            onPress={() => this._goToCourse(item.id)}
            style={styles.slide.btnWrapper}>
            <Text style={styles.slide.btnText}>Dashboard</Text>
          </Button>
        </View>
      </Card>
    );
  }

  _goToCourse = (courseId) => {
    this.props.navigation.navigate('Quizz', {
      courseId: courseId
    })
  }
  
  // {index < this.state.coursesLength ? (
  //   <Button
  //     transparent
  //     onPress={() => this.carousel.snapToNext()}
  //     style={styles.slide.btnWrapper}>
  //     <Text style={styles.slide.btnText}>Siguiente</Text>
  //   </Button>
  // ) : (
  //   <Button
  //     transparent
  //     onPress={() => this.carousel.snapToPrev()}
  //     style={styles.slide.btnWrapper}>
  //     <Text style={styles.slide.btnText}>Anterior</Text>
  //   </Button>
  // )}

  loadQuestions = () => {
      // console.warn("Loading questions");
      // console.log(apiGetCourses);
      // () => {
      // if( this.state.isLoggedIn == false ){
        // console.warn(this.props.navigation.state.params.userData.access_token)
          fetch(api.getCourses, { 
              method: 'GET', 
              headers: {
                  "Authorization": 'Bearer ' + this.props.navigation.state.params.userData.access_token ,
                  Accept: 'application/json',
                  "Content-Type": "application/json"
              }
          })
          .then((response) => response.json())
          .then((response) => {
                // console.log(response)
                  this.setState( { courses: response.data.courses, coursesLength: response.data.courses.length - 1, ready: true}, () => {
                  // this.setState({loaded: true});
                  // console.warn(this.state.coursesLength);
                //   jsonResult = this.state.courses
                  // console.log(jsonResult)
              }) 
            }
          ).catch((error) => {
              console.error(error);
          })
      // }
  }

  componentDidMount(){
    if( ! this.state.ready ){
      this.loadQuestions()
    }
  }

  render() {
    // console.log(this.props.navigation.state.params.userData)
    if(this.state.ready){
      return (
        <Container>
          <StatusBar
            barStyle="light-content"
            translucent={true}
            backgroundColor={'transparent'}
          />
          <ImageBackground
            source={require('@assets/images/background2.png')}
            style={styles.background}>
            <Content>
              <Carousel
                ref={c => (this.carousel = c)}
                data={this.state.courses}
                renderItem={this.renderSlide}
                sliderWidth={deviceWidth}
                itemWidth={deviceWidth - 50}
                hasParallaxImages={true}
                containerCustomStyle={styles.slider}
              />
            </Content>
            <Footer>
              <Button
                large
                primary
                block
                style={styles.skipBtn}
                onPress={() => this.props.navigation.navigate('Drawer')}
                // onPress={() => this.props.navigation.navigate('Quizz', {
                //   courseId: -1
                // })}
                >
                {/* <Text> Get Started </Text> */}
                <Text> Modo Aleatorio </Text>
              </Button>
            </Footer>
          </ImageBackground>
        </Container>
      );
    }else{
      // this.loadQuestions()
      return (
        <AppLoading
          
        />
      );
    }
  }
}

export default Walkthrough;
