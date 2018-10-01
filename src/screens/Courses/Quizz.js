// console.log(this.props.navigation.state.params.userData)

import React, { Component } from 'react';
import { 
    Text, View, Button, ToastAndroid, Alert, StyleSheet,
    Image, ImageBackground, Animated, TouchableOpacity
} from 'react-native';

import preguntas from '../data/questions.json';

import { apiSendAnswers } from './config/config'

import AchievementModal from './AchievementModal'

import Icon from 'react-native-vector-icons/Ionicons'

import CountdownCircle from 'react-native-countdown-circle'

import { apiGetQuestions, apiSetMedalQuestions } from './config/config'

import * as Animatable from 'react-native-animatable';

import { Actions } from 'react-native-router-flux';

const defaultTime = 10 // props.defaultTime
  
const background = require('./img/background.png')
const icon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png'

export default class Quizz extends Component {
    constructor(props){
        super(props)
        this.state = {
            numPressed: 0,
            questions: preguntas,
            index: 0,
            maxIndex: preguntas.length,
            corrects: 0, // counter
            answers: 0, // counter
            // correctAnswers: '',
            // wrongAnswers: '',
            currentQuestion: preguntas[0],
            achievementModalVisibility: false,
            init: false,
            ready: false,
            seconds: defaultTime,
            skippedQuestions: []
        }
        // this.gradeAnswer = this.gradeAnswer.bind(this)
        this.redirectToResults = this.redirectToResults.bind(this)
        // this.beginQuizz = this.beginQuizz.bind(this)
    }

    handleNextAnswer = () => {
        this.setState({ seconds: defaultTime }, () => {
                console.log('Segundos establecidos', this.state.seconds)
                currentIndex = this.state.index
                currentIndex++
                if(currentIndex == this.state.maxIndex){
                    ToastAndroid.show("Ya no hay más preguntas", ToastAndroid.SHORT)
                    this.redirectToResults()
                }else{
                    // ToastAndroid.show("Cambio a siguiente pregunta", ToastAndroid.SHORT)
                    newQuestion = this.state.questions[currentIndex]
                    this.setState({
                        index : currentIndex,
                        currentQuestion: newQuestion,
                    })
                }
            }
        );
    }

    _deliverMedalQuestions = () => {
        uri = apiSetMedalQuestions(this.props.courseId);
        // console.warn(uri);po
        fetch(uri, {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + this.props.bearerToken,
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
            seconds: 0
        })
        var data = JSON.stringify({
                question_id: questionId,
                option_id: optionId,
                session: this.props.sessionToken
            })
        fetch(apiSendAnswers, {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + this.props.bearerToken,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        }).then(
            // Enviando retroalimentación
            response => {
                // console.log(response)
            }
        ).catch(error => {
            // console.log(error)
        });

        if(is_correct){
            correctas = this.state.corrects;
            correctas ++;
            if(correctas == this.props.settings.num_questions_per_medal){
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
                    {text: 'Terminar', onPress: () => this.redirectToResults() , style: 'cancel'},
                    {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
                ]
            )
        }else{
            Alert.alert(
                this.state.currentQuestion.feedback,
                '¿Deseas continuar?',
                [
                    {text: 'Terminar', onPress: () => this.redirectToResults() , style: 'cancel'},
                    {text: 'Siguiente', onPress: () => this.handleNextAnswer(), style: 'default' },
                ]
            )
        }
    }

    navegar(){
        ToastAndroid.show("Navegando a otra página", ToastAndroid.SHORT)
        Actions.example()
    }

    redirectToResults(){
        Actions.Results({
            corrects : this.state.corrects,
            answers : this.state.answers
        })
    }

    _achievementCallback = () => 
        this.setState({achievementModalVisibility: false})
    
    loadQuestions = () => {
        uri = apiGetQuestions(this.props.courseId)
        // console.warn(uri)
        fetch(uri, { 
            method: 'GET', 
            headers: {
                "Authorization": 'Bearer ' + this.props.bearerToken ,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((response) => this.setState( { questions: response.data.questions, maxIndex: response.data.questions.length, currentQuestion: response.data.questions[0], ready: true}, ()=>console.log(''))
        ).catch((error) => { console.error(error); })
    }

    componentDidMount(){

    }

    nextAnswerByTime = () => {
        skippedQuestion = this.state.currentQuestion;
        skippedQuestions = this.state.skippedQuestions
        skippedQuestions.push(skippedQuestion)
        this.setState({
            skippedQuestions: skippedQuestions
        }, () => console.log('Pregunta saltada', this.state.skippedQuestion))
        this.handleNextAnswer()
    }

    render(){
        // console.log('Número de preguntas necesarias para la medalla', this.props.settings.num_questions_per_medal);
        console.log('El contador de segundos está actualmente en: ' + this.state.seconds)
        if(this.state.ready){
            return (
                <View style={styles.container}>
                    <ImageBackground source={ background } style={{width: '100%', height: '100%'}}>
                        <View style={styles.artistBox}>
                            {/* <Image style={styles.image} source={{ uri: icon}} /> */}
                            <CountdownCircle
                                seconds={ this.state.seconds }
                                radius={30}
                                borderWidth={8}
                                color="#3F7FD9"
                                // bgColor="#fff"
                                style={{ padding: 3 }}
                                // textStyle={{ fontSize: 20 }}
                                onTimeElapsed={ () => this.nextAnswerByTime() }
                            />
                            <View style={styles.info}>
                                <Text style={styles.name}>{this.state.currentQuestion.content}</Text>
                            </View>
                        </View>
                        <View style={ styles.contenedorPreguntas }>
                            {
                            this.state.currentQuestion.options.map( (option) => {
                                    return <TouchableOpacity onPress={ () => this.gradeAnswer(this.state.currentQuestion.id, option.id, option.is_correct) } key={'o' + option.id} >
                                            <Animatable.Text style={styles.option} animation="bounceInLeft"
                                            iterationCount={1} direction="alternate" wait={5} >
                                            { option.content }
                                            </Animatable.Text>
                                        </TouchableOpacity>;
                            })
                            }
                        </View>
                    </ImageBackground>
                    <AchievementModal isModalVisible={this.state.achievementModalVisibility} text={'Text'} callback={this._achievementCallback}/>
                </View>
            );
        }else{
            this.loadQuestions()
            return (<Text>Cargando</Text>);
        }
    }
}

const Body = <Text></Text>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
        //   flexDirection: 'column',
        //   justifyContent: 'center',
        //   alignItems: 'center',
        //   backgroundColor: 'lightgray',
        //   paddingTop: 20,
    },
    info: {
      // backgroundColor: 'blue',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
    //   alignItems: 'center',
    },
    artistBox: {
    //   backgroundColor: '#e9e9e9',
        paddingTop: 25,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    image: {
      width:100,
      height: 100,
    },
    name: {
      fontSize: 20,
      flexWrap: 'wrap',
      color: 'white'
    },
    contenedorPreguntas: {
        flex: 1,
        padding:8,
        justifyContent: 'space-between',
        paddingBottom: 100,
        paddingTop: 30,
        // backgroundColor: 'red',
    },
    pregunta: {
        justifyContent: "space-between",
        padding: 15,
    },
    option: {
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: '#3498db',
    }
})


    {/* <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="¿"
        message="I have a message for you!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
        this.hideAlert();
        }}
        onConfirmPressed={() => {
        this.hideAlert();
        }}
    />
    <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="AwesomeAlert"
        message="I have a message for you!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
        this.hideAlert();
        }}
        onConfirmPressed={() => {
        this.hideAlert();
        }}
    /> */}