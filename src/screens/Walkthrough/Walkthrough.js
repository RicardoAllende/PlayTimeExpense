// import React, { Component } from "react";
// import {
//   ProgressBarAndroid,
//   AppRegistry,
//   StyleSheet,
//   View
// } from "react-native";

// export default class App extends Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <ProgressBarAndroid />
//         <ProgressBarAndroid styleAttr="Horizontal" />
//         <ProgressBarAndroid styleAttr="Horizontal" color="#2196F3" />
//         <ProgressBarAndroid
//           // style={{ backgroundColor: '#e9e9e9', color: 'black' }}
//           style={{ 
//             height: '50%',
//             width: '50%',
//            }}
//           color='green'
//           styleAttr="Horizontal"
//           indeterminate={false}
//           progress={0.8}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-evenly",
//     padding: 10
//   }
// });






















// import React, { Component } from 'react';

// import { StyleSheet, Text, View } from 'react-native';

// import * as Progress from 'react-native-progress';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     paddingVertical: 20,
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   circles: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   progress: {
//     margin: 10,
//   },
// });

// export default class Example extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       progress: 0,
//       indeterminate: true,
//     };
//   }

//   componentDidMount() {
//     this.animate()
//   }

//   animate() {
//     setInterval(() => {
//       progress = this.state.progress + .10
//       if(progress <= 1){
//         this.setState({
//           progress
//         })
//       }
//     }, 500)
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>Progress Example</Text>
//         <Progress.Bar
//           style={styles.progress}
//           progress={this.state.progress}
//         />
//       </View>
//     );
//   }
// }


// /**
//  * Example usage of react-native-modal
//  * @format
//  */

// import React, { Component } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import Modal from "react-native-modal";

// export default class Example extends Component {
//   state = {
//     visibleModal: null
//   };

//   renderButton = (text, onPress) => (
//     <TouchableOpacity onPress={onPress}>
//       <View style={styles.button}>
//         <Text>{text}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   renderModalContent = () => (
//     <View style={styles.modalContent}>
//       <Text>Hello!</Text>
//       {this.renderButton("Close", () => this.setState({ visibleModal: null }))}
//     </View>
//   );

//   handleOnScroll = event => {
//     this.setState({
//       scrollOffset: event.nativeEvent.contentOffset.y
//     });
//   };

//   handleScrollTo = p => {
//     if (this.scrollViewRef) {
//       this.scrollViewRef.scrollTo(p);
//     }
//   };

//   render() {
//     return (
//       <View style={styles.container}>
//         {this.renderButton("Default modal", () =>
//           this.setState({ visibleModal: 1 })
//         )}
//         {this.renderButton("Sliding from the sides", () =>
//           this.setState({ visibleModal: 2 })
//         )}
//         {this.renderButton("A slower modal", () =>
//           this.setState({ visibleModal: 3 })
//         )}
//         {this.renderButton("Fancy modal!", () =>
//           this.setState({ visibleModal: 4 })
//         )}
//         {this.renderButton("Bottom half modal", () =>
//           this.setState({ visibleModal: 5 })
//         )}
//         {this.renderButton("Modal that can be closed on backdrop press", () =>
//           this.setState({ visibleModal: 6 })
//         )}
//         {this.renderButton("Swipeable modal", () =>
//           this.setState({ visibleModal: 7 })
//         )}
//         {this.renderButton("Scrollable modal", () =>
//           this.setState({ visibleModal: 8 })
//         )}
//         <Modal isVisible={this.state.visibleModal === 1}>
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 2}
//           animationIn="slideInLeft"
//           animationOut="slideOutRight"
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 3}
//           animationInTiming={2000}
//           animationOutTiming={2000}
//           backdropTransitionInTiming={2000}
//           backdropTransitionOutTiming={2000}
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 4}
//           backdropColor={"red"}
//           backdropOpacity={1}
//           animationIn="zoomInDown"
//           animationOut="zoomOutUp"
//           animationInTiming={1000}
//           animationOutTiming={1000}
//           backdropTransitionInTiming={1000}
//           backdropTransitionOutTiming={1000}
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 5}
//           style={styles.bottomModal}
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 6}
//           onBackdropPress={() => this.setState({ visibleModal: null })}
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 7}
//           onSwipe={() => this.setState({ visibleModal: null })}
//           swipeDirection="left"
//         >
//           {this.renderModalContent()}
//         </Modal>
//         <Modal
//           isVisible={this.state.visibleModal === 8}
//           onSwipe={() => this.setState({ visibleModal: null })}
//           swipeDirection="down"
//           scrollTo={this.handleScrollTo}
//           scrollOffset={this.state.scrollOffset}
//           scrollOffsetMax={400 - 300} // content height - ScrollView height
//           style={styles.bottomModal}
//         >
//           <View style={styles.scrollableModal}>
//             <ScrollView
//               ref={ref => (this.scrollViewRef = ref)}
//               onScroll={this.handleOnScroll}
//               scrollEventThrottle={16}
//             >
//               <View style={styles.scrollableModalContent1}>
//                 <Text>Scroll me up</Text>
//               </View>
//               <View style={styles.scrollableModalContent1}>
//                 <Text>Scroll me up</Text>
//               </View>
//             </ScrollView>
//           </View>
//         </Modal>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   button: {
//     backgroundColor: "lightblue",
//     padding: 12,
//     margin: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 4,
//     borderColor: "rgba(0, 0, 0, 0.1)"
//   },
//   modalContent: {
//     backgroundColor: "white",
//     padding: 22,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 4,
//     borderColor: "rgba(0, 0, 0, 0.1)"
//   },
//   bottomModal: {
//     justifyContent: "flex-end",
//     margin: 0
//   },
//   scrollableModal: {
//     height: 300
//   },
//   scrollableModalContent1: {
//     height: 200,
//     backgroundColor: "orange",
//     alignItems: "center",
//     justifyContent: "center"
//   },
//   scrollableModalContent2: {
//     height: 200,
//     backgroundColor: "lightgreen",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });







import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';

import { Container, Content, Text, Button, Card, Footer } from 'native-base';
import Carousel from 'react-native-snap-carousel';

import {shouldShowTutorial, setTutorialShowed} from '../../../api/session'
import AppIntroSlider from 'react-native-app-intro-slider';

import {api, modalLevels} from './../../../api/playTimeApi'

import Modal from 'react-native-modal'

import { entries } from './config';

import styles from './styles';

import {session, getUserData} from './../../../api/session'

import ModalSelector from 'react-native-modal-selector'

import LevelModalSelector from '../../components/ModalSelector/LevelModalSelector'

// import LevelModalSelector from '@components/ModalSector/LevelModalSelector'

const deviceWidth = Dimensions.get('window').width;

const illustration = require('@assets/images/walkthrough3.png');

import { Asset, AppLoading, Font, Audio, Video } from 'expo';
const introSoundPath = require('@assets/sounds/intro.mp3')
const correctSoundPath = require('@assets/sounds/correct.mp3')
const wrongSoundPath = require('@assets/sounds/wrong.mp3')
const lowVolume = 0.25
const mediumVolume  = 0.5

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.state ={
      bearerReady: false,
      ready: false,
      showTutorial: false,
      exampleNotification: false,
    }
    this.renderSlide = this.renderSlide.bind(this);
  }

  shouldShowTutorial = async () => {
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
    // if(this.state.showTutorial){

    // }else{
      return (
        <Card style={styles.slide.container}>
          <View>
            <Image source={illustration} style={styles.slide.illustration} />
            <Text style={styles.slide.title}>{item.name}</Text>
            <Text numberOfLines={4} style={styles.slide.subtitle}>
              {item.description}
            </Text>
            <LevelModalSelector
              childrenContainerStyle={ styles.slide.btnWrapper }
              content={
                <Text
                  style={styles.slide.btnText}
                  >
                  Jugar
                </Text>
              }
              courseId={ item.id }
              onPress={
                this._goToCourse
              }
              key={'mdl' + index}
            ></LevelModalSelector>
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
    // }
  }

  _goToCourse = (courseId, level) => {
    let props = {
      courseId,
      level
    }
    this.props.navigation.navigate('Quizz', props)
  }

  _goToCourseOverview = (courseId) => {
    // this.playCorrectSound()
    // return false;
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

  async componentDidMount(){
    this.loadUserData();
    showTuto = await shouldShowTutorial()
    if(showTuto){
      this.setState({
        showTutorial: true,
      })
    }
    // this.playBackgroundMusic()
  }
  
  playBackgroundMusic = async () => {
    appMusic = new Expo.Audio.Sound();
    try { // Playing app music
      await appMusic.loadAsync( introSoundPath, {
        volume: lowVolume,
        isLooping: true,
        shouldPlay: true,
      })
      console.log('Se terminó de cargar la canción')
    } catch (error) {
      console.log('Error al cargar sonido, Walkthrough', error)
    }  
  }

  _onDone = () => {
    setTutorialShowed()
    this.setState({
      showTutorial: false,
    })
  }

  render() {
    if(this.state.showTutorial){
      return <AppIntroSlider
       slides={slides} 
       onDone={this._onDone} 
       onSkip={this.onDone}
       skipLabel="Saltar tutorial"
       doneLabel="Comenzar"
       nextLabel="Siguiente"
       prevLabel="Anterior"
       />;
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
                    // AsyncStorage.removeItem('tutorial_showed').then(() => {
                    //   console.log('Se eliminó la sesión en la cual se mostraba el tutorial')
                    // })
                    this.props.navigation.navigate('Profile')
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
      width: 240,
      height: 240,
  }
});

const slides = [
  {
      key: 'tut_1',
      title: '¿Qué es Playtime?',
      text: 'Playtime es una aplicación que le ayudará a reforzar los conocimientos adquiridos en su capacitación...',
      image: require('@assets/images/Tutorial/1.jpg'),
      imageStyle: tutorialStyles.image,
      backgroundColor: '#59b2ab',
  },
  {
      key: 'tut_2',
      title: 'Selecciona un curso',
      text: 'Seleccione un curso en el que esté inscrito, de clic en <jugar> para comenzar, o en <estadísticas> para conocer quiénes son los mejores en el juego',
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
    image: require('@assets/images/Tutorial/2.jpg'),
    imageStyle: tutorialStyles.image,
    backgroundColor: '#febe29',
  },
  {
    key: 'tut_5',
    title: '¿Estás listo?',
    text: '',
    image: require('@assets/images/play-button.png'),
    imageStyle: tutorialStyles.image,
    backgroundColor: '#FF3366',
  }
];

export default Walkthrough;
