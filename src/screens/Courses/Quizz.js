import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert } from 'react-native';
import {
  Container,
  Content,
  Fab,
  Icon,
  Text,
  View,
  Spinner,
  TouchableOpacity,
} from 'native-base';
import { connect } from 'react-redux';
import { formatAmount } from '@utils/formatters';

import AppHeader from '@components/AppHeader';
import Option from './Option';
import categoryColors from '@theme/categoryColors';

import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

const url = "http://192.168.0.111:8000/categories"
const defaultTime = 10;
const num_questions_per_medal = 12

import {api} from './../../../api/playTimeApi'

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
            options: [],
            skippedQuestions: [],
            timerVisibility: true,
            currentSecond: defaultTime,
            secondsInCountdown: defaultTime,
            currentIndex: 0
        }
    }

  static propTypes = {
    navigation: PropTypes.any,
    getCategories: PropTypes.func.isRequired,
    categoriesLoading: PropTypes.bool.isRequired,
    categoriesError: PropTypes.bool.isRequired,
    categories: PropTypes.array,
  };


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

    

    _renderOption = (element) => {
        const { navigation } = this.props;
        console.log("Rendering option")
        index = element.index
        category = element.item
        // category = element.item
        return (
            <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Expenses')}>
            <View style={styles.categoryBox}>
                <Icon name={category.iconName} style={styles.categoryIcon} />
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryAmount}>
                {' '}
                {formatAmount(category.amount)}
                </Text>
                <View
                style={styles.categoryLine}
                borderColor={categoryColors[index % categoryColors.length]}
                />
            </View>
            </TouchableOpacity>
        );
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

    _onTimeElapsed = () => {
        console.log("Se terminó el tiempo onTimeElapsed")
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

    render() {
        const navigation = this.props.navigation;
        if(!this.init){
            this.init = true;   
            this.loadData();
        }
        return (
        <Container>
            <ImageBackground
            source={require('@assets/images/header-bg.png')}
            style={styles.background}>
            <AppHeader
                hasTabs
                timer={true}
                timerVisibility={this.state.timerVisibility}
                seconds={this.state.seconds}
                _onTimeElapsed={this._onTimeElapsed}
                setCurrentSecond={this.setCurrentSecond}
                navigation={navigation}
                title={ this.state.ready ? this.state.currentQuestion.name : "-" }
                subTitle="_"
            />
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
                    renderItem={({ ...props }) => (
                        <Option showAlert={this.showAlert} gradeAnswer={this.gradeAnswer} questionId={this.state.currentQuestion.id} navigation={navigation} {...props} />
                    )}
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
                        seconds: defaultTime,
                    })
                }
            // }
        // );
    }

    _deliverMedalQuestions = () => {
        uri = api.setMedalQuestions(this.props.courseId);
        // console.warn(uri);po
        fetch(uri, {
                method: 'POST',
                headers: {
                    "Authorization": 'Bearer ' + this.props.navigation.state.params.accessToken,
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
                "Authorization": 'Bearer ' + this.props.navigation.state.params.accessToken,
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

    loadData = () => {
        console.log("Loading questions");
        url = api.getQuestions(this.props.navigation.state.params.courseId);
        fetch(url, { 
            method: 'GET', 
            headers: {
                "Authorization": 'Bearer ' + this.props.navigation.state.params.accessToken,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((response) => {
            // console.log(response)
            this.setState( {
                questions: response.data.questions, session: response.data.session, index: 0, maxIndex: response.data.questions.length, 
                currentQuestion: response.data.questions[0], options: response.data.questions[0].options , ready: true}, 
                ()=>console.log('')
            )
        }
        ).catch((error) => { console.error(error); })
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
