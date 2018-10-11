import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert, ToastAndroid, Image } from 'react-native';
import { Asset, AppLoading, Font } from 'expo';
import {
  Container, Content, Fab, Icon,  Text,  View,  Spinner, TouchableOpacity, Left, Right, Thumbnail, Body, Button, Header
} from 'native-base';

import HeaderDrawerButton from '../../components/AppHeader/HeaderDrawerButton';
const avatar = require('@assets/images/avatar1.png');
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

const url = "http://192.168.0.111:8000/categories"
const defaultTime = 10;
const num_questions_per_medal = 12

import {api} from './../../../api/playTimeApi'
import {session, getUserData} from './../../../api/session'
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
            currentSecond: defaultTime,
            secondsInCountdown: defaultTime,
            // optionIndex: 0, 
            currentIndex: 0,
            randomText: "Estado desde quizz",
            showSuccessNotification: false,
            showErrorNotification: false, 
            retro: "",
            hits: 0,
            maxHits: 0,
        }
    }

    static propTypes = {
        navigation: PropTypes.any,
        getCategories: PropTypes.func.isRequired,
        categoriesLoading: PropTypes.bool.isRequired,
        categoriesError: PropTypes.bool.isRequired,
        categories: PropTypes.array,
    };

    optionIndex = 0


    static defaultProps = {
        categoriesLoading: false,
        categoriesError: false,
        categories: [],
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({showErrorNotification: true})
        }, 6000)
        this.initialize();
    }

    showSuccessNotification = () => {
        this.setState({ showSuccessNotification: false, showErrorNotification: false }, () => {
            this.setState({ showSuccessNotification: true, showErrorNotification: false })
        })
    }

    showErrorNotification = () => {
        this.setState({ showErrorNotification: false, showSuccessNotification: false }, () => {
            this.setState({ showErrorNotification: true, showErrorNotification: false })
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

    _onTimeElapsed = () => {
        this.setState({ seconds: 25 }, () => /*this.setState({ seconds: defaultTime })*/ console.log('') )
        console.log("Se terminó el tiempo onTimeElapsed", "Reiniciando la cuenta regresiva")
        // this.showAlert()
    }

    init = false

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

    setCurrentSecond = (seconds) => 
    {
        this.setState({
            seconds: seconds
        }, () => console.log('El número de segundos actual es:', this.state.seconds))
    }

    restartTimer = () => {
        this.setState({seconds: 0}, () => { this.setState({ seconds: defaultTime }, 
                () => {
                    console.log('Quizz.js', 'Restarting timer', this.state.seconds)
                }   
            ) // end setState defaultTime
        })
    }

    shouldRestartTimer = false;

    setDefaultTime = () => {
        this.setState({
            seconds: defaultTime
        })
        this.shouldRestartTimer = false;
    }
    
    intervalTime = false;
    initCoundown = () => {
        return true;
        if( this.shouldRestartTimer ){
            // this.setDefaultTime();
            if( ! this.intervalTime ){ // Timer doesn't exist
                this.setState({seconds: defaultTime}, () => {
                    this.intervalTime = setInterval(() => {
                        console.log("Comienza retroceso en setInterval")
                        prevSeconds = this.state.seconds;
                        if(prevSeconds > 0){
                            this.setState({
                                seconds: prevSeconds -1
                            })
                        }else{ // counter is finished
                            clearTimeout(this.intervalTime);
                            this.intervalTime = false;
                        }
                    }, 1000);
                })
            }
            this.shouldRestartTimer = false;
        }
    }

    render() {
        const navigation = this.props.navigation;
        if(!this.init){
            this.init = true;   
            this.loadData();
        }
        if(this.state.ready){
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
                                // this.state.timerVisibility 
                                // ? 
                                    <CountdownCircle
                                      seconds={this.state.seconds}
                                      radius={25}
                                      borderWidth={8}
                                      color="#ff003f"
                                      bgColor="#fff"
                                      textStyle={{ fontSize: 20 }}
                                      onTimeElapsed={ this.handleNextAnswerByTime }
                                    />
                                // :
                                // <TouchableOpacity
                                //     onPress={() => {
                                //         this.props.navigation.navigate('Expenses');
                                //     }}>
                                //     <Image source={logo} style={headerStyles.logo} />
                                // </TouchableOpacity>
                            }
                        </Body>
                        <Right style={{ flex: 1 }}>
                            {this.props.displayAvatar && (
                            <TouchableOpacity
                                onPress={() => {
                                this.props.navigation.navigate('Profile');
                                }}>
                                <Thumbnail source={avatar} style={styles.avatar} />
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
                    onPress={ this._askToEndQuizz }>
                    <Icon type="Ionicons" name="exit" />
                </Fab>
                {this.state.showErrorNotification && (
                  <Notification
                    message={this.state.retro}
                    // buttonText="_"
                    duration={defaultNotificationTime}
                    position="bottom"
                    type="danger"
                  />
                )}
                {this.state.showSuccessNotification && (
                  <Notification
                    message="¡Respuesta correcta!"
                    // buttonText="_"
                    duration={defaultNotificationTime}
                    position="bottom"
                    type="success"
                  />
                )}
                </ImageBackground>
            </Container>
            );
        }else{
            return (<AppLoading></AppLoading>);
        }
    }

    handleNextAnswer = () => {
        console.log('Quizz.js ejecutando handelNextAnswer')
        // this.setState({ seconds: defaultTime }, () => {
        //         console.log('Segundos establecidos', this.state.seconds)
        currentIndex = this.state.index
        currentIndex++
        if(currentIndex == this.state.maxIndex){
            ToastAndroid.show("Ya no hay más preguntas", ToastAndroid.SHORT)
            this.setState({
                timerVisibility: false,
            })
            // console.warn('Ya no existen más preguntas')

            var data = JSON.stringify({
                session: this.props.session,
            })
            fetch(api.getSessionStats, {
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
                    console.log('Quizz handleNextAnswer Response before json', response)
                    return response.json();
                    console.log("Retro")
                }
            ).then(
                jsonResponse => console.log(jsonResponse)
            ).catch(error => {
                console.log("Error en la función handleNextAnswer", error);
                console.log(data, api.getSessionStats);
            });

            // this.goToResults()
        }else{
            // ToastAndroid.show("Cambio a siguiente pregunta", ToastAndroid.SHORT)
            newQuestion = this.state.questions[currentIndex]
            this.setState({
                index : currentIndex,
                currentQuestion: newQuestion,
                // seconds: defaultTime,
            })
        }
        this.restartTimer()
            // }
        // );
    }

    handleNextAnswerByTime = () => {
        if(this.state.timerVisibility){
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
            // jsonResponse => console.log(jsonResponse)
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
                hits: hits
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
                    console.log('Quizz.js invocando handelNextAnswer')
                    this.handleNextAnswer()
                    this.next = false;
                }else{
                    console.log('Quizz.js no invocado handelNextAnswer')
                }
            }, defaultDelayToShowQuestion)
            // Alert.alert(
            //     '¡Acertaste!',
            //     'Respuesta correcta',
            //     [
            //         {text: 'Terminar', onPress: () => this._goToResults() , style: 'cancel'},
            //         {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
            //     ]
            // )
        }else{
            this.setState({retro: this.state.currentQuestion.feedback, hits: 0}, () => {
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
        getUserData().then(
            (userData) => {this.setState({bearerToken: userData.bearerToken, bearerReady: true, userData: userData}, 
                    ()=>{
                        url = api.getQuestions(this.props.navigation.state.params.courseId);
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
                            this.setState( {
                                questions: response.data.questions, session: response.data.session, index: 0, maxIndex: response.data.questions.length, 
                                currentQuestion: response.data.questions[0], ready: true}, 
                                ()=>{
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
