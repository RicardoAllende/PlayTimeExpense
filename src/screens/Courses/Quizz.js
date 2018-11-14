import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert, View, ToastAndroid, Image, BackHandler, StyleSheet, TouchableOpacity, } from 'react-native';
import { Asset, AppLoading, Font, Audio } from 'expo';
import {
  Container, Content, Fab, Icon,  Text,  Spinner, Left, Right, Thumbnail, Body, Button, Header
} from 'native-base';

import HeaderDrawerButton from '../../components/AppHeader/HeaderDrawerButton';
const correctImage = "http://www.pngmart.com/files/7/Check-PNG-Transparent-Image.png"
import CountdownCircle from 'react-native-countdown-circle'

import { connect } from 'react-redux';
import { formatAmount } from '@utils/formatters';

import AppHeader from '@components/AppHeader';
import Option from './Option';
import categoryColors from '@theme/categoryColors';

import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';

import styles from './styles';
import headerStyles from '@components/AppHeader/styles'
import theme from '@theme/variables/myexpense';

const defaultTime = 10;
const num_questions_per_medal = 12

import {api} from './../../../api/playTimeApi'
import {session, getBearerTokenCountdownSeconds, getAvatar} from './../../../api/session'
import { AsyncStorage } from "react-native"
import Notification from '@components/Notification';
import Modal from 'react-native-modal'

const defaultNotificationTime = 1200 // 1000 equals a second
const defaultDelayToShowQuestion = defaultNotificationTime + 0

const correctSoundPath = require('@assets/sounds/correct.mp3')
const wrongSoundPath = require('@assets/sounds/wrong.mp3')
const lowVolume = 0.15
const mediumVolume  = 0.5

class Quizz extends Component {

    constructor(props){
        super(props)
        this.state = {
            ready: false,
            categories: [],
            corrects: 0,
            answers: 0,
            questions: [],
            currentQuestion: false,
            seconds: defaultTime,
            skippedQuestions: [],
            timerVisibility: true,
            avatarReady: false,
            currentIndex: 0,
            showSuccessNotification: false,
            showErrorNotification: false, 
            feedback: "",
            exampleNotification: true,
            hits: 0,
            maxHits: 0,
        }
    }

    optionIndex = 0

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.loadAvatar();
    }

    loadAvatar = () => {
        getAvatar().then((avatar) => {
          this.setState({
            avatar,
            avatarReady: true,
          })
        });
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        this.goToSessionScreen();
        return true;
    }

    showSuccessNotification = () => {
        this.setState({ showSuccessNotification: false, showErrorNotification: false }, () => {
            this.setState({ showSuccessNotification: true, showErrorNotification: false })
        })
    }

    showExampleNotification = () => {
        this.setState({
            exampleNotification: true,
        }, () => {
            // setTimeout(() => {
            //     this.setState({
            //         exampleNotification: false,
            //     })
            // }, defaultNotificationTime);
        })
    }

    showErrorNotification = () => {
        this.setState({ showErrorNotification: false, showSuccessNotification: false }, () => {
            this.setState({ showErrorNotification: true, showSuccessNotification: false })
        })
    }

    itemSeparatorComponent = () => {
        return (<View style = {{height: 10,width: '100%',}} />)
    }

    showAlert = () => {
        Alert.alert(
            '¿Desea terminar intento?',
            '¿Desea terminar el intento actual?',
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }

    playSound = async (correct) => {
        var sound = new Expo.Audio.Sound()
        var playStatus = { volume: mediumVolume, shouldPlay: true, }
        if(correct){
            await sound.loadAsync(correctSoundPath, playStatus)
        }else{
            await sound.loadAsync(wrongSoundPath, playStatus)
        }
    }

    _goToResults = () => {
        console.log("Yendo a los resultados del curso")
        Alert.alert(
            'Terminando el curso',
            'Usted está terminando el curso',
            [
            {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            { cancelable: false }
        )
    }

    restartTimer = (restart) => {
        if(typeof(restart) === 'boolean'){ restart = this.currentSecond; console.log('Quizz restartTimer, restart:', restart) } else { restart = this.state.countdownSeconds; console.log('Quizz restartTimer, no existe la variable de segundos'); }
        this.setState({seconds: 0}, () => { this.setState({ timerVisibility: true, seconds: restart }, 
                () => {
                    // console.log('Quizz.js', 'Restarting timer', this.state.seconds)
                }   
            ) // end setState this.state.countdownSeconds
        })
    }

    componentDidMount(){
        this.loadData();
    }

    currentSecond = 0
    _updateText = (elapsedSecs, totalSecs) => {
        current = totalSecs-elapsedSecs
        if(current != totalSecs){
            console.log('Segundos actuales', current)
            this.currentSecond = current
        }
        return (totalSecs - elapsedSecs).toString()
    } 

    render() {
        const navigation = this.props.navigation;
        console.log('exampleNotification', this.state.exampleNotification)
        if(this.state.ready){
            let notification;
            if(this.state.showSuccessNotification){
                notification = <Notification
                    message="¡Respuesta correcta!"
                    duration={defaultNotificationTime}
                    position="bottom"
                    type="success"
                  />
            }
            if(this.state.showErrorNotification){
                notification = <Notification
                    message={this.state.feedback}
                    duration={defaultNotificationTime}
                    position="bottom"
                    type="danger"
                />
            }
            return (
            <Container>
                <ImageBackground
                source={require('@assets/images/header-bg.png')}
                // source={{ uri: 'http://192.168.0.106:8000/storage/default_images/default_background.png' }}
                style={styles.background}>
                { /* Inicia Appheader */ }
                <View>
                    <Header transparent hasTabs>
                        <Left style={{ flex: 1 }}>
                            <HeaderDrawerButton navigation={navigation} />
                        </Left>
                        <Body style={{ flex: 1, alignItems: 'center' }}>
                            {
                                this.state.timerVisibility &&
                                    <CountdownCircle
                                      seconds={this.state.seconds}
                                      radius={25}
                                      borderWidth={8}
                                      color="#ff003f"
                                      bgColor="#fff"
                                      updateText={this._updateText}
                                      textStyle={{ fontSize: 20 }}
                                      onTimeElapsed={ this.handleNextAnswerByTime }
                                    />
                            }
                        </Body>
                        <Right style={{ flex: 1 }}>
                            {this.props.displayAvatar && (
                            <TouchableOpacity
                                onPress={() => {
                                this.props.navigation.navigate('Profile');
                                }}>
                                {
                                    this.state.avatarReady &&
                                    (
                                        <Thumbnail 
                                          source={{
                                            uri: this.state.avatar,
                                            cache: 'only-if-cached',
                                          }}
                                        // style={styles.avatar} 
                                        />
                                    )
                                }
                            </TouchableOpacity>
                            )}
                            {this.props.displaySearch && (
                            <Button
                                transparent
                                onPress={() => {
                                this.setState(() => ({
                                    displaySearchBar: !this.state.displaySearchBar,
                                }));
                                }}>
                                <Icon active name="ios-search" style={{ fontSize: 34 }} />
                            </Button>
                            )}
                        </Right>
                    </Header>
                    
                    <View style={headerStyles.titles.container}>
                        <View style={headerStyles.titles.content}>
                        <Text style={headerStyles.titles.text}>{ this.state.currentQuestion.name }</Text>
                        </View>
                    </View>
                </View>
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}
                    style={styles.content}>
                    {!this.state.ready && (
                    <View style={styles.emptyContainer}>
                        <Spinner color={theme.brandPrimary} />
                    </View>
                    )}
                    {this.state.ready &&
                    this.state.questions.length > 0 && (
                        <FlatList
                        data={ this.state.currentQuestion.options }
                        renderItem={ ({ ...props }) => {
                            if(this.optionIndex == 4){
                                this.optionIndex = 0;
                            }else{
                                this.optionIndex = this.optionIndex + 1
                            }
    
                            return (<Option showAlert={this.showAlert}
                                 itemIndex={this.optionIndex} gradeAnswer={this.gradeAnswer}
                                 questionId={this.state.currentQuestion.id} navigation={navigation} {...props} />)
                        }
                    }
                        keyExtractor={category => "question" + category.id}
                        initialNumToRender={5}
                        style={styles.flatList}
                        ItemSeparatorComponent={this.itemSeparatorComponent}
                        />
                    )}
                </Content>
                <Fab
                    direction="up"
                    containerStyle={{}}
                    style={{ backgroundColor: theme.brandPrimary }}
                    position="bottomRight"
                    onPress={ this.shouldGoToSessionScreen }>
                    <Icon type="Ionicons" name="exit" />
                </Fab>
                {notification}
                    <Modal
                        isVisible={this.state.exampleNotification}
                        animationIn="slideInLeft"
                        animationOut="slideOutRight"
                    >
                        <View
                        style={{
                            backgroundColor: "white",
                            padding: 22,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4,
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            flexDirection: "column",
                        }}
                        >
                        <Text>Acertaste en tu respuesta</Text>
                            <Image style={ retroStyles.imageRetro } source={{ uri: correctImage }} />
                            <View style={{ flexDirection: 'row' }} >
                                <TouchableOpacity>
                                    <View 
                                    style={{
                                        backgroundColor: "lightblue",
                                        padding: 12,
                                        margin: 16,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 4,
                                        borderColor: "rgba(0, 0, 0, 0.1)"
                                    }}
                                    >
                                        <Text>Continuar</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <View 
                                    style={{
                                        backgroundColor: "lightblue",
                                        padding: 12,
                                        margin: 16,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 4,
                                        borderColor: "rgba(0, 0, 0, 0.1)"
                                    }}
                                    >
                                        <Text>Terminar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </Container>
            );
        }else{
            return (<AppLoading></AppLoading>);
        }
    }

    shouldGoToSessionScreen = () => {
        this.setState({
            timerVisibility: false
        }, () => {
            Alert.alert(
                'Saliendo del curso',
                '¿Desea terminar el intento?',
                [
                    {text: 'Continuar', onPress: () => this.continueQuizz()},
                    {text: 'Salir', onPress: () => this.goToSessionScreen(), style: 'cancel'},
                    // {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
            )
        })
    }

    continueQuizz = () => {
        this.restartTimer(true)
    }

    goToSessionScreen = () => {
        this.props.navigation.navigate('SessionResults', {
            session: this.state.session,
            num_questions_given: this.state.maxIndex,
            course_id: this.props.navigation.state.params.courseId,
            level: this.props.navigation.state.params.level,
        });
    }

    goToCourseOverview = () =>{
        this.props.navigation.navigate('CourseOverview', {
            courseId: this.props.navigation.state.params.courseId,
        })
    } 

    dropSkippedQuestion = (index) => {
        skippedQuestions = this.state.skippedQuestions
        skippedQuestions.shift()
        this.setState({skippedQuestions})
        return true;
    }

    nextSkippedQuestion = () => {
        skippedQuestions = this.state.skippedQuestions
        if(skippedQuestions.length == 0){
            return false;
        }
        return skippedQuestions[0]
    }

    getNextSkippedQuestion = () => {
        return this.state.skippedQuestions[0];
    }

    isSkippedQuestionAvailable = () => {
        if(this.state.skippedQuestions.length == 0){
            return false;
        }
        return true;
    }

    queueSkippedQuestion = (callback) => {
        skippedQuestions = this.state.skippedQuestions
        question = skippedQuestions[0]
        skippedQuestions.shift();
        skippedQuestions.push(question)
        this.setState({skippedQuestions}, callback)
    }

    handleNextAnswer = () => {
        // this.setState({ seconds: this.state.countdownSeconds }, () => {
        //         console.log('Segundos establecidos', this.state.seconds)
        currentIndex = this.state.index
        currentIndex++
        this.setState({
            timerVisibility: false,
        }, () => {
            if(currentIndex == this.state.maxIndex){
                // ToastAndroid.show("Ya no hay más preguntas", ToastAndroid.SHORT)
                if(this.isSkippedQuestionAvailable()){
                    console.log('Quizz handleNextAnswer showing skipped question')
                    nextQuestion = this.getNextSkippedQuestion()
                    this.showingSkippedQuestions = true;
                    this.setState({
                        currentQuestion: nextQuestion
                    })
                }else{
                    console.log('Yendo a la página de resultados de la sesión')
                    this.goToSessionScreen()
                }
            }else{
                // ToastAndroid.show("Cambio a siguiente pregunta", ToastAndroid.SHORT)
                newQuestion = this.state.questions[currentIndex]
                this.setState({
                    index : currentIndex,
                    currentQuestion: newQuestion,
                    // seconds: this.state.countdownSeconds,
                })
            }
            this.restartTimer()
        })
            // }
        // );
    }

    showingSkippedQuestions = false
    handleNextAnswerByTime = () => {
        if(this.state.timerVisibility){
            if(this.showingSkippedQuestions){ // Moving skipped question to the end in the array
                this.queueSkippedQuestion(this.handleNextAnswer());
            }else{
                currentQuestion = this.state.currentQuestion;
                skippedQuestions = this.state.skippedQuestions;
                skippedQuestions.push(currentQuestion);
                this.setState({
                    skippedQuestions
                }, () => {
                    console.log('Quizz.js', 'skippedQuestions', this.state.skippedQuestions.length)
                    this.handleNextAnswer()
                })
            }
        }
    }

    sendMaxHits = (maxHits, courseId) => {
        url = api.setHitsInCourse(courseId);
        console.log("Quizz sendMaxHits: maxHits", maxHits, ' -- Course_id', courseId, ' Url', url)
        var data = JSON.stringify({
            max_hits: maxHits,
            level: this.props.navigation.state.params.level,
        })
        fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + this.state.bearerToken,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }).then(
            // Enviando retroalimentación
            response => {
                return response.json();
                console.log("Retro")
            }
        ).then(
            jsonResponse => console.log(jsonResponse)
        ).catch(error => {
            console.log("error")
        });
    }

    showFinalRetro = () => {

    }

    showCorrectRetro = () => {

    }

    gradeAnswer = (questionId, optionId, is_correct) => {
        this.playSound(is_correct)
        // console.warn(apiSendAnswers)
        currentAnswers = this.state.answers + 1
        this.setState({
            answers: currentAnswers,
            // seconds: 0
        })
        var data = JSON.stringify({
                question_id: questionId,
                option_id: optionId,
                course_id: this.props.navigation.state.params.courseId,
                session: this.state.session,
                level: this.props.navigation.state.params.level,
            })
        fetch(api.sendAnswers, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + this.state.bearerToken,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }).then(
            // Enviando retroalimentación
            response => {
                // return response.json();
                // console.log("Retro")
            }
        ).then(
            // jsonResponse => console.log(jsonResponse)
        ).catch(error => {
            console.log("error grade Answer")
        });

        if(is_correct){
            hits = this.state.hits;
            hits++;
            this.setState({
                hits
            }, () => {
                if(this.state.hits > this.state.maxHits){
                    this.setState({
                        maxHits: hits
                    })
                    this.sendMaxHits(hits, this.props.navigation.state.params.courseId);
                }
            })
            this.showSuccessNotification()
            this.next = true;
            setTimeout(() => {
                if(this.next){
                    this.handleNextAnswer()
                    this.next = false;
                }
            }, defaultDelayToShowQuestion)
        }else{
            this.setState({feedback: this.state.currentQuestion.feedback, hits: 0}, () => {
                this.showErrorNotification()
                this.next = true
                setTimeout(() => {
                    if(this.next){
                        this.handleNextAnswer()
                        this.next = false;
                    }
                }, defaultDelayToShowQuestion)
            })
        }
    }

    next = false;

    loadData = async () => {
        console.log('Ingresando a Quizz.js')
        getBearerTokenCountdownSeconds().then(
            (data) => {this.setState({bearerToken: data.bearerToken, bearerReady: true, countdownSeconds: data.countdownSeconds, seconds: data.countdownSeconds}, 
                    ()=>{
                        url = api.getQuestions(this.props.navigation.state.params.courseId, this.props.navigation.state.params.level);
                        uriHeaders = {
                                "Authorization": 'Bearer ' + this.state.bearerToken,
                                Accept: 'application/json',
                                "Content-Type": "application/json"
                            }
                        // console.log('Uri headers', uriHeaders)
                        fetch(url, { 
                            method: 'GET', 
                            headers: uriHeaders
                        })
                        .then((response) => response.json())
                        .then((response) => {
                            // console.log('Quizz response', response)
                            // console.log('Quizz response lenght', response.data.questions.length)
                            if(response.data.questions.length == 0){
                                // alert('No existen Preguntas')
                                this.goToCourseOverview()
                            }else{
                                this.setState( {
                                    questions: response.data.questions, session: response.data.session, index: 0, maxIndex: response.data.questions.length, 
                                    currentQuestion: response.data.questions[0], ready: true}, 
                                    ()=>{
                                        this.showExampleNotification()
                                        // console.log('Quizz.js session', this.state.session)
                                        // console.log('');
                                    }
                                )
                            }
                        }
                        ).catch((error) => { console.error(error); })
                    }
                )
            }
        );
    }

}

const retroStyles = StyleSheet.create({
    imageRetro: {
        // position: 'absolute',
        // bottom:0,
        // left:0,
        width: 100,
        height: 100,
        // zIndex: 12,
        // bottom: '3%',
        // right: 0,
    },
})

export default Quizz;