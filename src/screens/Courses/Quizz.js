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

class Categories extends Component {

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
        this.initialize();
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
        // this.setState({ timerVisibility: false });
        // this.showAlert()
    }

    init = false

    _askToEndQuizz = () => {
        // console.log("Función para finalizar el curso")
        // this._pauseTimer();
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

    _pauseTimer = () => {
        this.setState({ timerVisibility: false });
    }

    _continueTimer = () => {
        this.setState({ seconds: this.state.seconds, timerVisibility: true })
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
                            <CountdownCircle
                              seconds={this.state.seconds}
                              radius={25}
                              borderWidth={8}
                              color="#ff003f"
                              bgColor="#fff"
                              textStyle={{ fontSize: 20 }}
                              onTimeElapsed={() => console.log('')}
                            />
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
                        <Text style={headerStyles.titles.text}>Título de la pregunta</Text>
                        </View>
                    </View>
                </View>

                { /* Termina Appheader */ }
                {/* <AppHeader
                    hasTabs
                    timer={true}
                    timerVisibility={this.state.timerVisibility}
                    seconds={this.state.seconds}
                    _onTimeElapsed={this._onTimeElapsed}
                    _handleNextAnswer={this.handleNextAnswerByTime}
                    _questionId={this.state.currentQuestion.id}
                    setCurrentSecond={this.setCurrentSecond}
                    navigation={navigation}
                    title={ this.state.ready ? this.state.currentQuestion.name : "-" }
                    subTitle="_"
                /> */}
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
                </ImageBackground>
            </Container>
            );
        }else{
            return (<AppLoading></AppLoading>);
        }
    }

    handleNextAnswer = () => {
        // this.setState({ seconds: defaultTime }, () => {
        //         console.log('Segundos establecidos', this.state.seconds)
        currentIndex = this.state.index
        currentIndex++
        if(currentIndex == this.state.maxIndex){
            ToastAndroid.show("Ya no hay más preguntas", ToastAndroid.SHORT)
            console.warn('Ya no existen más preguntas')
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
        this.shouldRestartTimer = true;
        this.initCoundown();
            // }
        // );
    }

    handleNextAnswerByTime = () => {
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

    _deliverMedalQuestions = () => {
        uri = api.setMedalQuestions(this.props.courseId);
        // console.warn(uri);po
        fetch(uri, {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + this.props.navigation.state.params.bearerToken,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data
            }
        ).then(
            // Enviando retroalimentación
            response => {
                // console.log(response)
            }
            ).catch(error => {
                // console.log(error)
            }
        );
                
        // console.warn('Delivering 10 questions medal');
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
            console.log("error")
        });

        if(is_correct){
            correctas = this.state.corrects;
            correctas ++;
            if(correctas == num_questions_per_medal){
                this._deliverMedalQuestions(this.props.courseId)
                correctas = 0;
            }
            this.setState({
                corrects : correctas,
                // seconds: defaultTime,
            })
            Alert.alert(
                '¡Acertaste!',
                'Respuesta correcta',
                [
                    {text: 'Terminar', onPress: () => this._goToResults() , style: 'cancel'},
                    {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
                ]
            )
        }else{
            Alert.alert(
                this.state.currentQuestion.feedback,
                '¿Deseas continuar?',
                [
                    {text: 'Terminar', onPress: () => this._goToResults() , style: 'cancel'},
                    {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
                ]
            )
        }
    }

    loadData = async () => {
        getUserData().then(
            (userData) => {this.setState({bearerToken: userData.bearerToken, bearerReady: true, userData: userData}, 
                    ()=>{
                        console.log("Loading questions");
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
                                    this.shouldRestartTimer = true;
                                    this.initCoundown();
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
)(Categories);
