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
import Category from './Category';
import categoryColors from '@theme/categoryColors';

import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

const url = "http://192.168.0.111:8000/categories"
const defaultTime = 10;

import {api} from './../../../api/playTimeApi'

class Categories extends Component {

    constructor(props){
        super(props)
        this.state = {
            ready: false,
            categories: [],
            corrects: 0,
            answers: 0,
            currentQuestion: 0,
            seconds: defaultTime,
            options: [],
            skippedQuestions: []
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
        console.log(element)
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

    render() {
        const  navigation = this.props.navigation;
        // console.log(categories)
        if(!this.state.ready){
            this.loadData();
            // return (<Text>
            //         Cargando preguntas
            //     </Text>);
        }
        return (
        <Container>
            <ImageBackground
            source={require('@assets/images/header-bg.png')}
            style={styles.background}>
            <AppHeader
                hasTabs
                navigation={navigation}
                title="¿Cuál es el lugar más frío de la tierra?"
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
                {/* {this.state.ready &&
                this.state.questions.length === 0 && (
                    <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMsg}>No categories found</Text>
                    </View>
                )} */}
                {this.state.ready &&
                this.state.questions.length > 0 && (
                    <FlatList
                    //   horizontal={false}
                    //   numColumns={2}
                    data={ this.state.questions[this.state.currentQuestion].options }
                    renderItem={({ ...props }) => (
                        <Category navigation={navigation} {...props} />
                    )}
                    keyExtractor={category => category.id}
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
                onPress={() => Alert.alert(
                    '¿Desea terminar intento?',
                    '¿Desea terminar el intento actual?',
                    [
                    {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                    ],
                    { cancelable: false }
                ) }>
                <Icon type="Ionicons" name="exit" />
            </Fab>
            </ImageBackground>
        </Container>
        );
    }

    handleNextAnswer = () => {
        // this.setState({ seconds: defaultTime }, () => {
        //         console.log('Segundos establecidos', this.state.seconds)
                currentIndex = this.state.currentQuestion
                currentIndex++
                if(currentIndex == this.state.maxIndex){
                    ToastAndroid.show("Ya no hay más preguntas", ToastAndroid.SHORT)
                    console.warn('Ya no existen más preguntas')
                    // this.redirectToResults()
                }else{
                    // ToastAndroid.show("Cambio a siguiente pregunta", ToastAndroid.SHORT)
                    newQuestion = this.state.questions[currentIndex]
                    this.setState({
                        index : currentIndex,
                        currentQuestion: newQuestion,
                    })
                }
            // }
        // );
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
            // seconds: 0
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
                console.log("Retro")
            }
        ).catch(error => {
            console.log("error")
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

    loadData = () => {
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
            console.log(response)
            this.setState( {
                questions: response.data.questions, maxIndex: response.data.questions.length, 
                currentQuestion: 0, options: response.data.questions[0].options , ready: true}, 
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

const categorias = [
    {
      id: '1',
      name: '¿Cuál es el lugar más frío de la tierra?',
      iconName: 'ios-school-outline',
      percent: 75,
      amount: 375,
    },
    {
      id: '2',
      name: '¿Cuál es el río más largo del mundo?',
      iconName: 'ios-paper-outline',
      percent: 50,
      amount: 250,
    },
    {
      id: '3',
      name: '¿Dónde se originaron los juegos olímpicos?',
      iconName: 'ios-restaurant-outline',
      amount: 175,
      percent: 25,
    },
    {
      id: '4',
      name: '¿Cuándo acabó la II Guerra Mundial?',
      iconName: 'ios-game-controller-b-outline',
      percent: 23,
      amount: 145,
    },
    {
      id: '10',
      name: 'Transport',
      iconName: 'ios-car-outline',
      percent: 22,
      amount: 150,
    },
  ];
  

export default connect(
  mapStateToProps,
  actions
)(Categories);
