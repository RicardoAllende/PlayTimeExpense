import React, { Component } from "react";
import {
    Dimensions,
    View,
    Image,
    ImageBackground,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage
} from "react-native";

import { Container, Content, Text, Button, Card, Footer } from "native-base";
import Carousel from "react-native-snap-carousel";

import { shouldShowTutorial, setTutorialShowed } from "../../../api/session";
import AppIntroSlider from "react-native-app-intro-slider";

import { api, modalLevels } from "./../../../api/playTimeApi";

import Modal from "react-native-modal";

import { entries } from "./config";

import styles from "./styles";

import { session, getUserData, setExpoPushToken } from "./../../../api/session";

import ModalSelector from "react-native-modal-selector";

import LevelModalSelector from "../../components/ModalSelector/LevelModalSelector";
import Spinner from "react-native-loading-spinner-overlay";

const deviceWidth = Dimensions.get("window").width;

const illustration = require("@assets/images/walkthrough3.png");

import { Asset, AppLoading, Font, Audio, Video } from "expo";
const introSoundPath = require("@assets/sounds/intro.mp3");
const correctSoundPath = require("@assets/sounds/correct.mp3");
const wrongSoundPath = require("@assets/sounds/wrong.mp3");
const lowVolume = 0.25;
const mediumVolume = 0.5;

const initialRoute = "Settings";

class Walkthrough extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bearerReady: false,
            ready: false,
            showTutorial: false,
            exampleNotification: false
        };
        this.renderSlide = this.renderSlide.bind(this);
    }

    shouldShowTutorial = async () => {
        shouldShowTutorial().then(viewed => {
            if (viewed) {
                this.setState({
                    showTutorial: true
                });
            } else {
            }
        });
    };

    showImageDialog = () => {
        openCameraDialog(
            [],
            () => console.log("success"),
            () => console.log("error")
        );
        console.log("showImageDialog");
    };

    renderSlide({ item, index }) {
        // if(this.state.showTutorial){

        // }else{
        return (
            <Card style={styles.slide.container}>
                <View>
                    <Image
                        source={illustration}
                        style={styles.slide.illustration}
                    />
                    <Text style={styles.slide.title}>{item.name}</Text>
                    <Text numberOfLines={4} style={styles.slide.subtitle}>
                        {item.description}
                    </Text>
                    <LevelModalSelector
                        childrenContainerStyle={styles.slide.btnWrapper}
                        content={
                            <Text style={styles.slide.btnText}>Jugar</Text>
                        }
                        courseId={item.id}
                        onPress={this._goToCourse}
                        key={"mdl" + index}
                    />
                    {item.id != -1 && (
                        <Button
                            transparent
                            onPress={() => this._goToCourseOverview(item.id)}
                            style={styles.slide.btnWrapper}
                        >
                            <Text style={styles.slide.btnText}>
                                Información del curso
                            </Text>
                        </Button>
                    )}
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
        };
        this.props.navigation.navigate("Quizz", props);
    };

    _goToCourseOverview = courseId => {
        // this.playCorrectSound()
        // return false;
        this.props.navigation.navigate("CourseOverview", {
            courseId: courseId
        });
    };

    loadUserData = async () => {
        getUserData().then(userData => {
            this.setState(
                {
                    bearerToken: userData.bearerToken,
                    bearerReady: true,
                    userData: userData
                },
                () => {
                    // bearerToken is setted
                    // console.log("Waklthrough.js, imprimiendo bearerToken", this.state.bearerToken)
                    fetch(api.getCourses, {
                        method: "GET",
                        headers: {
                            Authorization: "Bearer " + this.state.bearerToken,
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        }
                    })
                        .then(response => response.json())
                        .then(response => {
                            this.setState(
                                {
                                    courses: response.data.courses,
                                    coursesLength:
                                        response.data.courses.length - 1,
                                    ready: true
                                },
                                () => {}
                            );
                            session.setCourses(response.data.courses);
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            );
        });
    };

    async componentDidMount() {
        // console.log('Componentdidmount was called')
        this.loadUserData();
        // showTuto = await shouldShowTutorial()
        // if(showTuto){
        //   this.setState({
        //     showTutorial: true,
        //   })
        // }
        // this.registerForPushNotificationsAsync()
        setExpoPushToken();
        // this.playBackgroundMusic()
    }

    playBackgroundMusic = async () => {
        appMusic = new Expo.Audio.Sound();
        try {
            // Playing app music
            await appMusic.loadAsync(introSoundPath, {
                volume: lowVolume,
                isLooping: true,
                shouldPlay: true
            });
            console.log("Se terminó de cargar la canción");
        } catch (error) {
            console.log("Error al cargar sonido, Walkthrough", error);
        }
    };

    _onDone = () => {
        setTutorialShowed();
        this.setState({
            showTutorial: false
        });
    };

    redirected = false;
    goToInitialScreen = () => {
        // console.log('', this.redirected)
        // if( ! this.redirected ){
        console.log("Redirecting to " + initialRoute);
        this.props.navigation.navigate(initialRoute);
        // this.redirected = true
        // }else{
        //   console.log('gotoinitialscreen else')
        // }
    };

    mustRedirect = false;
    render() {
        if (this.state.showTutorial) {
            return (
                <AppIntroSlider
                    slides={slides}
                    onDone={this._onDone}
                    onSkip={this.onDone}
                    skipLabel="Saltar tutorial"
                    doneLabel="Comenzar"
                    nextLabel="Siguiente"
                    prevLabel="Anterior"
                />
            );
        } else {
            return (
                <Container>
                    <Spinner
                        visible={ ! this.state.ready}
                        textContent={"Cargando..."}
                        textStyle={{ color: 'white' }}
                    />
                    <StatusBar
                        barStyle="light-content"
                        translucent={true}
                        backgroundColor={"transparent"}
                    />
                    <ImageBackground
                        source={{
                            uri:
                                "https://koenig-media.raywenderlich.com/uploads/2014/01/sunny-background.png",
                            cache: "only-if-cached"
                        }}
                        // source={require('@assets/images/background2.png')}
                        style={styles.background}
                    >
                        <Content>
                            {this.state.ready && (
                                <Carousel
                                    ref={c => (this.carousel = c)}
                                    data={this.state.courses}
                                    renderItem={this.renderSlide}
                                    sliderWidth={deviceWidth}
                                    itemWidth={deviceWidth - 50}
                                    hasParallaxImages={true}
                                    containerCustomStyle={styles.slider}
                                />
                            )}
                        </Content>
                        <Footer>
                            <Button
                                large
                                primary
                                block
                                style={styles.skipBtn}
                                onPress={this.goToInitialScreen}
                            >
                                <Text> Saltar </Text>
                            </Button>
                        </Footer>
                    </ImageBackground>
                </Container>
            );
        }
    }

    showNotificationWithDelay = () => {
        delaySeconds = 3;
        delaySeconds *= 1000;
        console.log("Se dio clic en mostrar notificación");
        setTimeout(() => {
            const localNotification = {
                title: "Título de la notificación",
                body: "Texto de la notificación",
                data: "Data adjunta  a la notificación",
                android: {
                    icon:
                        "https://cdn4.iconfinder.com/data/icons/flat-shaded-2/512/Notification-512.png"
                }
            };
            Notifications.presentLocalNotificationAsync(localNotification).then(
                () => {
                    console.log("Se mostró la notificación");
                }
            );
        }, delaySeconds);
    };
}

const tutorialStyles = StyleSheet.create({
    image: {
        width: 240,
        height: 240
    }
});

const slides = [
    {
        key: "tut_1",
        title: "¿Qué es Playtime?",
        text:
            "Playtime es una aplicación que le ayudará a reforzar los conocimientos adquiridos en su capacitación...",
        image: require("@assets/images/Tutorial/1.jpg"),
        imageStyle: tutorialStyles.image,
        backgroundColor: "#59b2ab"
    },
    {
        key: "tut_2",
        title: "Selecciona un curso",
        text:
            "Seleccione un curso en el que esté inscrito, de clic en <jugar> para comenzar, o en <estadísticas> para conocer quiénes son los mejores en el juego",
        image: require("@assets/images/Tutorial/2.jpg"),
        imageStyle: tutorialStyles.image,
        backgroundColor: "#febe29"
    },
    {
        key: "tut_3",
        title: "¿Cómo jugar?",
        text:
            "Una vez comenzado el curso, usted debe seleccionar la respuesta correcta",
        image: require("@assets/images/Tutorial/3.jpg"),
        imageStyle: tutorialStyles.image,
        backgroundColor: "#22bcb5"
    },
    {
        key: "tut_4",
        title: "Terminar el intento",
        text: "Para terminar el intento, presione el botón",
        image: require("@assets/images/Tutorial/2.jpg"),
        imageStyle: tutorialStyles.image,
        backgroundColor: "#febe29"
    },
    {
        key: "tut_5",
        title: "¿Estás listo?",
        text: "",
        image: require("@assets/images/play-button.png"),
        imageStyle: tutorialStyles.image,
        backgroundColor: "#FF3366"
    }
];

export default Walkthrough;
