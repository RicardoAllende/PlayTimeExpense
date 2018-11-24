import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert, View, ToastAndroid, Image, BackHandler, StyleSheet, TouchableOpacity, } from 'react-native';
import { Asset, AppLoading, Font, Audio } from 'expo';
import CountDown from 'react-native-countdown-component';
import {
  Container, Content, Fab, Icon,  Text,  Spinner, Left, Right, Thumbnail, Body, Button, Header
} from 'native-base';

import HeaderDrawerButton from '../../components/AppHeader/HeaderDrawerButton';
const correctFeedback = require('@assets/images/feedback/correct.gif') // "http://www.pngmart.com/files/7/Check-PNG-Transparent-Image.png"
const wrongFeedback = require('@assets/images/feedback/wrong.png')
const yellowPostIt = require('@assets/images/feedback/yellow-post-it-medium.png')
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
import ConfirmModal from '@components/Modals/ConfirmModal'

const defaultFeedbackTime = 800 // 1000 equals a second
const defaultDelayToShowQuestion = defaultFeedbackTime + 0
const animationTime = defaultFeedbackTime - 30
// const animationIn =

const correctSoundPath = require('@assets/sounds/correct.mp3')
const wrongSoundPath = require('@assets/sounds/wrong.mp3')
const lowVolume = 0.15
import * as Progress from 'react-native-progress';
import CountDownText from './CountDownText'
const mediumVolume  = 0.5

class Quizz extends Component {

    constructor(props){
        super(props)
        this.state = {
            ready: false, categories: [], corrects: 0, answers: 0, questions: [], showProgressBar: false,
            currentQuestion: false, seconds: defaultTime, skippedQuestions: [], timerVisibility: false,
            avatarReady: false, currentIndex: 0, showSuccessNotification: false, showErrorNotification: false, 
            feedback: "Retroalimentación por default", hits: 0, maxHits: 0, percentage: 0.5,
            errors: 0, showFeedback: false, loadDataReady: false, showConfirmModal: false,
        }
        console.log('Nivel del curso', this.props.navigation.state.params.level)
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

    showFeedbackView = (is_correct) => {
        feedback = "Respuesta contestada correctatemente"
        if(is_correct){
            this.setState({ showSuccessNotification: true, showErrorNotification: false, showFeedback: true, feedback })
        }else{
            this.setState({ showSuccessNotification: false, showErrorNotification: true, feedback: this.state.currentQuestion.feedback, hits: 0, showFeedback: true })
        }
    }

    itemSeparatorComponent = () => {
        return (<View style = {{height: 10,width: '100%',}} />)
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

    restartTimer = (restart) => {
        if(typeof(restart) === 'boolean'){ restart = this.currentSecond; } else { restart = this.state.countdownSeconds; }
        if(this.mounted){
            this.setState({seconds: 0}, () => { this.setState({ timerVisibility: true, seconds: restart }) })
        }
    }

    componentDidMount(){
        this.mounted = true
        this.loadData();
    }

    componentWillUnmount(){
        this.mounted = false
    }

    currentSecond = 0
    _updateText = (elapsedSecs, totalSecs) => {
        current = totalSecs-elapsedSecs
        if(current != totalSecs){
            // console.log('Segundos actuales', current)
            this.currentSecond = current
        }
        return (totalSecs - elapsedSecs).toString()
    } 

    startQuizz = () => {
        this.setState({
            ready: true, timerVisibility: true, showProgressBar: true,
        })
    }

    render() {
        const navigation = this.props.navigation;
        if(this.state.loadDataReady){
            let feedbackImage
            if(this.state.showSuccessNotification){    
                feedbackImage = <Image style={ retroStyles.imageRetro } source={ correctFeedback } />
            }
            if(this.state.showErrorNotification){
                feedbackImage = <Image style={ retroStyles.imageRetro } source={ wrongFeedback } />
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
                        <Body style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                            {
                                this.state.timerVisibility &&
                                    <CountdownCircle
                                      seconds={this.state.seconds}
                                      radius={25}
                                      borderWidth={8}
                                      color={theme.brandPrimary}
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
                        {
                            this.state.showProgressBar && (
                                <Progress.Bar
                                    width={null}
                                    color={theme.brandPrimary}
                                    progress={this.state.progress}
                                />
                            )
                        }
                        <View style={headerStyles.titles.content}>
                        <Text style={headerStyles.titles.text}>{ this.state.currentQuestion.name }</Text>
                        </View>
                    </View>
                </View>
                {
                    this.state.loadDataReady && ! this.state.ready &&
                    (
                        <View
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ flex: 1 }}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignContent: 'center',
                            flex: 1,
                            backgroundColor: '#e9e9e9',
                        }}>
                            <CountDownText
                                style={{
                                    flex: 1,
                                    fontFamily: 'Roboto_light',
                                    fontWeight: 'bold',
                                    fontSize: 50,
                                    color: theme.brandPrimary,
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    padding: '5%',
                                    // backgroundColor: "blue" 
                                }}
                                seconds={3}
                                callback={this.startQuizz}
                            />
                        </View>
                    )
                }
                {
                    this.state.ready && this.state.loadDataReady &&
                    (<Content
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
                            style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', flex: 1, backgroundColor: 'blue', alignSelf: 'center'}}
                            data={ this.state.currentQuestion.options }
                            renderItem={ ({ ...props }) => {
                                if(this.optionIndex == 5){
                                    this.optionIndex = 0;
                                }else{
                                    this.optionIndex = this.optionIndex + 1
                                }
                                return (<Option itemIndex={this.optionIndex} gradeAnswer={this.gradeAnswer}
                                    questionId={this.state.currentQuestion.id} navigation={navigation} {...props} />)
                            }
                        }
                            keyExtractor={category => "question" + category.id}
                            initialNumToRender={5}
                            style={styles.flatList}
                            ItemSeparatorComponent={this.itemSeparatorComponent}
                            />
                        )}
                    </Content>)
                }
                {
                    this.state.ready && this.state.loadDataReady &&
                    <Fab
                        direction="up"
                        containerStyle={{}}
                        style={{ backgroundColor: theme.brandPrimary }}
                        position="bottomRight"
                        onPress={ this.shouldGoToSessionScreen }>
                        <Icon type="Ionicons" name="exit" />
                    </Fab>
                }
                <ConfirmModal
                    confirmText="Continuar"
                    message="¿Desea terminar el curso?"
                    onConfirm={this.continueQuizz}
                    cancelText="Terminar"
                    onCancel={this.goToSessionScreen}
                    isVisible={this.state.showConfirmModal}
                />
                    <Modal
                        isVisible={this.state.showFeedback}
                        // animationIn="slideInLeft"
                        // animationOut="slideOutRight"
                        animationIn="zoomInDown"
                        animationOut="zoomOutUp"
                        animationInTiming={animationTime}
                        animationOutTiming={animationTime}
                        backdropTransitionInTiming={animationTime}
                        backdropTransitionOutTiming={animationTime}
                    >
                        <ImageBackground
                            source={yellowPostIt}
                            style={{
                                width: '100%',
                                height: '100%',
                                // backgroundColor: "white",
                                // padding: 22,
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 4,
                                // borderColor: "rgba(0, 0, 0, 0.1)",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                        <Text style={{ padding: '2%', }}>{this.state.feedback}</Text>
                            {feedbackImage}
                            <View style={{ flexDirection: 'row' }} >
                                <TouchableOpacity
                                onPress={this.goToSessionScreen}
                                >
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
                                <TouchableOpacity
                                onPress={this.handleNextAnswer}
                                >
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
                            </View>
                        </ImageBackground>
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
            timerVisibility: false, showConfirmModal: true,
        }, 
        )
    }

    continueQuizz = () => {
        this.setState({ showConfirmModal: false }, () => { this.restartTimer(true); })
    }

    goToSessionScreen = () => {
        this.setState({
            showConfirmModal: false,
        })
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
        this.calculateProgressInQuestions()
        this.setState({
            showFeedback: false,
        }, () => setTimeout(() => {
            currentIndex = this.state.index
            currentIndex++
            if(currentIndex == this.state.maxIndex){
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
                newQuestion = this.state.questions[currentIndex]
                if(this.mounted){
                    this.setState({
                        index : currentIndex,
                        currentQuestion: newQuestion,
                    })
                }
            }
            this.restartTimer()
        }, defaultFeedbackTime)
        )
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

    calculateProgressInQuestions = () => {
        numAnswers = this.state.answers
        numQuestions = this.state.maxIndex
        progress = numAnswers / numQuestions
        this.setState({
            progress
        })
    }

    gradeAnswer = (questionId, optionId, is_correct) => {
        this.setState({timerVisibility: false})
        this.playSound(is_correct)
        this.showFeedbackView(is_correct)
        // console.warn(apiSendAnswers)
        currentAnswers = this.state.answers + 1
        this.setState({
            answers: currentAnswers, // número de preguntas contestadas
            // seconds: 0
        })
        var data = JSON.stringify({
                question_id: questionId,
                option_id: optionId,
                course_id: this.props.navigation.state.params.courseId,
                session: this.state.session,
                level: this.props.navigation.state.params.level,
            })
        console.log('Quizz.js gradeAnswer Data', data)
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
        }
    }

    next = false;

    loadData = async () => {
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
                                    currentQuestion: response.data.questions[0], loadDataReady: true}, 
                                    ()=>{
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
    } // loadData ends

}

const retroStyles = StyleSheet.create({
    imageRetro: {
        width: 100,
        height: 100,
        padding: "2%",
    },
})

export default Quizz;