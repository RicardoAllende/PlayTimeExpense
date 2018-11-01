import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert, ToastAndroid, Image, BackHandler } from 'react-native';
import { Asset, AppLoading, Font } from 'expo';
import {
  Container, Content, Fab, Icon,  Text,  View,  Spinner, TouchableOpacity, Left, Right, Thumbnail, Body, Button, Header
} from 'native-base';

import HeaderDrawerButton from '../../components/AppHeader/HeaderDrawerButton';
const avatar = require('@assets/images/default_avatar.png');
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

const logo = require('@assets/images/header-logo.png');
const defaultNotificationTime = 1200 // 1000 equals a second
const defaultDelayToShowQuestion = defaultNotificationTime + 0

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
            retro: "",
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

    showErrorNotification = () => {
        this.setState({ showErrorNotification: false, showSuccessNotification: false }, () => {
            this.setState({ showErrorNotification: true, showSuccessNotification: false })
        })
    }

    initialize = () => {
        this.props.getCategories();
    };


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

    _askToEndQuizz = () => {
        // console.log("Función para finalizar el curso")
        Alert.alert(
            '¿Desea terminar intento?',
            '¿Desea terminar el intento actual?',
            [
            // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
            {text: 'Continuar', onPress: () => this._continueQuizz, style: 'cancel'},
            {text: 'Sí, terminar', onPress: () => this._goToResults },
            ],
            { cancelable: false }
        )
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

    _continueQuizz = () => {
        console.log("Se eligió continuar con el curso");
        this._continueTimer()
    }

    restartTimer = () => {
        this.setState({seconds: 0}, () => { this.setState({ timerVisibility: true, seconds: this.state.countdownSeconds }, 
                () => {
                    // console.log('Quizz.js', 'Restarting timer', this.state.seconds)
                }   
            ) // end setState this.state.countdownSeconds
        })
    }

    componentDidMount(){
        this.loadData();
    }
    
    init = false
    render() {
        const navigation = this.props.navigation;
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
                    message={this.state.retro}
                    duration={defaultNotificationTime}
                    position="bottom"
                    type="danger"
                />
            }
            return (
            <Container>
                <ImageBackground
                source={require('@assets/images/header-bg.png')}
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
                                        style={styles.avatar} />
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
                    onPress={ this.goToSessionScreen }>
                    <Icon type="Ionicons" name="exit" />
                </Fab>
                {notification}
                </ImageBackground>
            </Container>
            );
        }else{
            return (<AppLoading></AppLoading>);
        }
    }

    turnOffCountdownTimer = () => {
        this.setState({ seconds: 0 });
    }

    goToSessionScreen = () => {
        this.props.navigation.navigate('SessionResults', {
            session: this.state.session,
            num_questions_given: this.state.maxIndex,
            course_id: this.props.navigation.state.params.courseId,
        });
    }

    goToCourseOverview = () =>{
        this.props.navigation.navigation.navigate('CourseOverview', {
            course_id: this.props.navigation.state.params.courseId,
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
        if(this.state.currentIndex == this.state){

        }
    }

    isSkippedQuestionAvailable = () => {
        // if(this.state.currentIndex + 1 < this.state.maxIndex){
        //     return true;
        // }
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

    gradeAnswer = (questionId, optionId, is_correct) => {
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
                return response.json();
                console.log("Retro")
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
            this.setState({retro: this.state.currentQuestion.feedback, hits: 0}, () => {
                // console.log('Estableciendo la retroalimentación en: ', this.state.retro)
                this.showErrorNotification()
                this.next = true
                setTimeout(() => {
                    if(this.next){
                        this.handleNextAnswer()
                        this.next = false;
                    }
                }, defaultDelayToShowQuestion)
            })
            // Alert.alert(
            //     this.state.currentQuestion.feedback,
            //     '¿Deseas continuar?',
            //     [
            //         {text: 'Terminar', onPress: () => this._goToResults() , style: 'cancel'},
            //         {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
            //     ]
            // )
        }
    }

    next = false;

    loadData = async () => {
        alert(this.props.navigation.state.params.level);
        getBearerTokenCountdownSeconds().then(
            (data) => {this.setState({bearerToken: data.bearerToken, bearerReady: true, countdownSeconds: data.countdownSeconds, seconds: data.countdownSeconds}, 
                    ()=>{
                        url = api.getQuestions(this.props.navigation.state.params.courseId, this.props.navigation.state.params.level);
                        fetch(url, { 
                            method: 'GET', 
                            headers: {
                                "Authorization": 'Bearer ' + this.state.bearerToken,
                                Accept: 'application/json',
                                "Content-Type": "application/json"
                            }
                        })
                        .then((response) => response.json())
                        .then((response) => {
                            if(response.data.questions.length == 0){
                                alert('No existen Preguntas')
                                this.goToCourseOverview()
                            }
                            this.setState( {
                                questions: response.data.questions, session: response.data.session, index: 0, maxIndex: response.data.questions.length, 
                                currentQuestion: response.data.questions[0], ready: true}, 
                                ()=>{
                                    console.log('Quizz.js session', this.state.session)
                                    console.log('');
                                }
                            )
                        }
                        ).catch((error) => { console.error(error); })
                    }
                )
            }
        );
    }

}

const mapStateToProps = state => ({
  categories: categoriesSelectors.getCategories(state),
  categoriesLoading: categoriesSelectors.getCategoriesLoadingState(state),
  categoriesError: categoriesSelectors.getCategoriesErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(Quizz);
