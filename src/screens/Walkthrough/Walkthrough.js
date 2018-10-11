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

import {session, getUserData} from './../../../api/session'
import { AsyncStorage } from "react-native"

const deviceWidth = Dimensions.get('window').width;

const illustration = require('@assets/images/walkthrough3.png');

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state ={
      bearerReady: false,
      ready: false,
    }
    this.renderSlide = this.renderSlide.bind(this);
  }

  renderSlide({ item, index }) {
    // console.log("Item rendering")
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
            <Text style={styles.slide.btnText}>Jugar</Text>
          </Button>
          {
            item.id != -1 &&
            <Button
              transparent
              onPress={() => this._goToCourseOverview(item.id)}
              style={styles.slide.btnWrapper}>
              <Text style={styles.slide.btnText}>Información del curso</Text>
            </Button>
          }
        </View>
      </Card>
    );
  }

  _goToCourse = (courseId) => {
    this.props.navigation.navigate('Quizz', {
      courseId: courseId
    })
  }

  _goToCourseOverview = (courseId) => {
    this.props.navigation.navigate('CourseOverview', {
      courseId: courseId
    })
  }
  
  loadCourses = () => {
      // console.warn("Loading questions");
      // console.log(apiGetCourses);
      // () => {
      // if( this.state.isLoggedIn == false ){
        // console.log('Cargando los cursos con el siguiente token:', this.state.bearerToken)
          fetch(api.getCourses, { 
              method: 'GET', 
              headers: {
                  "Authorization": 'Bearer ' + this.state.bearerToken,
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
                // jsonResult = this.state.courses
                // console.log(jsonResult)
              }) 
            }
          ).catch((error) => {
              console.error(error);
          })
      // }
  }

  loadUserData = async() => {
    getUserData().then(
        (userData) => {this.setState({bearerToken: userData.bearerToken, bearerReady: true, userData: userData}, 
          () => { // bearerToken is setted
            fetch(api.getCourses, { 
                method: 'GET', 
                headers: {
                    "Authorization": 'Bearer ' + this.state.bearerToken,
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((response) => {
                  this.setState( { courses: response.data.courses, coursesLength: response.data.courses.length - 1, ready: true}, () => {
                }) 
              }
            ).catch((error) => {
                console.error(error);
            })
          }
        )
      }
    );
  }

  loadingQuestions = true;
  loadingBearer = true;
  loadingUserData = true;
  render() {
    if(this.loadingUserData){
      this.loadUserData()
      // getUserData().then(response => this.setState({userData: response, bearerReady: true}));
      // console.log('Recuperando la información', getUserData())
      this.loadingUserData = false;
    }
    // if(this.loadingBearer){
    //   this.loadUserData();
    //   this.loadingBearer = false;
    // }
    // if(this.state.bearerReady){
      // if(this.loadingQuestions){
      //   this.loadCourses()
      //   this.loadingQuestions = false;
      // }
      // if(this.state.ready){
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
                { this.state.ready &&
                  <Carousel
                    ref={c => (this.carousel = c)}
                    data={this.state.courses}
                    renderItem={this.renderSlide}
                    sliderWidth={deviceWidth}
                    itemWidth={deviceWidth - 50}
                    hasParallaxImages={true}
                    containerCustomStyle={styles.slider}
                  />
                }
              </Content>
              <Footer>
                <Button
                  large
                  primary
                  block
                  style={styles.skipBtn}
                  onPress={() => this.props.navigation.navigate('Drawer', {
                    userData: this.state.userData
                  })}
                  // onPress={() => this.props.navigation.navigate('Quizz', {
                  //   courseId: -1
                  // })}
                  >
                  {/* <Text> Get Started </Text> */}
                  <Text> Saltar </Text>
                </Button>
              </Footer>
            </ImageBackground>
          </Container>
        );
      // }
      
    // }
    // return (
    //   <AppLoading />
    // );    
  }
}

export default Walkthrough;
