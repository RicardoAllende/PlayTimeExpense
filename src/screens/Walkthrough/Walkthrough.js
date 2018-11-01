import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Container, Content, Text, Button, Card, Footer } from 'native-base';
import Carousel from 'react-native-snap-carousel';

import {shouldShowTutorial} from '../../../api/session'
import AppIntroSlider from 'react-native-app-intro-slider';

import {api} from './../../../api/playTimeApi'

import { Asset, AppLoading, Font } from 'expo';

import { entries } from './config';

import styles from './styles';

import {session, getUserData} from './../../../api/session'
import { AsyncStorage } from "react-native"

import ModalSelector from 'react-native-modal-selector'

const deviceWidth = Dimensions.get('window').width;

const illustration = require('@assets/images/walkthrough3.png');

const modalSelectorData = [
  { key: 0, section: true, label: 'Escoja el nivel a jugar' },
  { key: 1, label: 'Fácil', value: 1 },
  { key: 2, label: 'Medio', value: 2 },
  { key: 3, label: 'Difícil', value: 3 },
  { key: 4, label: 'Aleatorio', value: 'random' }
]

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state ={
      bearerReady: false,
      ready: false,
      showTutorial: false,
    }
    this.renderSlide = this.renderSlide.bind(this);
  }

  shouldShowTutorial = () => {
    shouldShowTutorial().then((viewed) => {
      if(viewed){
        this.setState({
          showTutorial: true,
        })
      }else{

      }
    })
  }

  showImageDialog = () => {
    openCameraDialog([], () => console.log('success') , () => console.log('error') )
    console.log('showImageDialog');
  }

  renderSlide({ item, index }) {
    // console.log("Item rendering")
    if(this.state.showTutorial){

    }else{
      return (
        <Card style={styles.slide.container}>
          <View>
            <Image source={illustration} style={styles.slide.illustration} />
            <Text style={styles.slide.title}>{item.name}</Text>
            <Text numberOfLines={4} style={styles.slide.subtitle}>
              {item.description}
            </Text>
            {/* <Button
              transparent
              onPress={() => this._goToCourse(item.id)}
              style={styles.slide.btnWrapper}>
              <Text style={styles.slide.btnText}>Jugar</Text>
            </Button> */}
            <ModalSelector
                key={'mdlStr' + index}
                data={modalSelectorData}
                initValue="Select something yummy!"
                supportedOrientations={['landscape']}
                accessible={true}
                childrenContainerStyle={ styles.slide.btnWrapper }
                // styles={}
                scrollViewAccessibilityLabel={'Scrollable options'}
                cancelButtonAccessibilityLabel={'Cancel Button'}
                onChange={(option)=>{ this._goToCourse( item.id, option.value ) }}>
              {/* <View  > */}
                <Text
                  style={styles.slide.btnText}
                  >
                  Jugar
                </Text>
              {/* </View> */}

            </ModalSelector>
            {
              item.id != -1 &&
              <Button
                transparent
                onPress={() => this._goToCourseOverview(item.id)}
                style={styles.slide.btnWrapper}>
                <Text style={styles.slide.btnText}>Información del curso</Text>
              </Button>
            }
            {/* <Button
              transparent
              onPress={() => this.showImageDialog()}
              style={styles.slide.btnWrapper}>
              <Text style={styles.slide.btnText}>Image Picker</Text>
            </Button> */}
          </View>
        </Card>
      );
    }
  }

  _goToCourse = (courseId, level) => {
    let props = {
      courseId,
      level
    }
    console.log(props);
    this.props.navigation.navigate('Quizz', props)
  }

  _goToCourseOverview = (courseId) => {
    this.props.navigation.navigate('CourseOverview', {
      courseId: courseId
    })
  }

  loadUserData = async() => {
    getUserData().then(
        (userData) => {this.setState({bearerToken: userData.bearerToken, bearerReady: true, userData: userData}, 
          () => { // bearerToken is setted
            // console.log("Waklthrough.js, imprimiendo bearerToken", this.state.bearerToken)
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
                  session.setCourses(response.data.courses);
              }
            ).catch((error) => {
                console.error(error);
            })
          }
        )
      }
    );
  }

  componentDidMount(){
    this.loadUserData();
  }

  _onDone = () => {
    // alert('Cambiando el estado');
    this.setState({
      showTutorial: false,
    })
  }

  loadingQuestions = true;
  loadingBearer = true;
  render() {
    if(this.state.showTutorial){
      return <AppIntroSlider slides={slides} onDone={this._onDone} />;
    }else{
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
                onPress={
                  () => {
                    this.props.navigation.navigate('ModalPickerExample')
                  }
                }
                // onPress={() => this.props.navigation.navigate('Drawer', {
                //   userData: this.state.userData
                // })}
                >
                <Text> Saltar </Text>
              </Button>
            </Footer>
          </ImageBackground>
        </Container>
      );  
    }
  }
}

const tutorialStyles = StyleSheet.create({
  image: {
      width: 320,
      height: 320,
  }
});

const slides = [
  {
      key: 'tut_1',
      title: '¿Qué es Playtime?',
      text: 'Playtime es una aplicación que le ayudará a asimilar sus conocimientos...',
      image: require('@assets/images/Tutorial/1.jpg'),
      imageStyle: tutorialStyles.image,
      backgroundColor: '#59b2ab',
  },
  {
      key: 'tut_2',
      title: 'Selecciona un curso',
      text: 'Navegue entre los distintos cursos a los cuales está inscrito, de clic en jugar para comenzar, o en estadísticas para conocer quiénes son los mejores en el juego',
      image: require('@assets/images/Tutorial/2.jpg'),
      imageStyle: tutorialStyles.image,
      backgroundColor: '#febe29',
  },
  {
      key: 'tut_3',
      title: '¿Cómo jugar?',
      text: 'Una vez comenzado el curso, usted debe seleccionar la respuesta correcta',
      image: require('@assets/images/Tutorial/3.jpg'),
      imageStyle: tutorialStyles.image,
      backgroundColor: '#22bcb5',
  },
  {
    key: 'tut_4',
    title: 'Terminar el intento',
    text: 'Para terminar el intento, presione el botón',
    image: require('@assets/images/Tutorial/3.jpg'),
    imageStyle: tutorialStyles.image,
    backgroundColor: '#22bcb5',
}
];

export default Walkthrough;
