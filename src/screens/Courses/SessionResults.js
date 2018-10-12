import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert, ToastAndroid, Image, BackHandler } from 'react-native';
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
import {session, getBearerToken} from './../../../api/session'
import { AsyncStorage } from "react-native"
import Notification from '@components/Notification';

const logo = require('@assets/images/header-logo.png');
const defaultNotificationTime = 1200 // 1000 equals a second
const defaultDelayToShowQuestion = defaultNotificationTime + 0

class SessionResults extends Component {

    constructor(props){
        super(props)
        this.state = {
          coursesLoading: false,
          courses: [],
            ready: false,
            categories: [],
            corrects: 0,
            answers: 0,
            questions: [],
            currentQuestion: false,
            seconds: defaultTime,
            skippedQuestions: [],
            timerVisibility: true,
            // optionIndex: 0, 
            currentIndex: 0,
            showSuccessNotification: false,
            showErrorNotification: false, 
            retro: "",
            hits: 0,
            maxHits: 0,
        }
    }

    optionIndex = 0

    static defaultProps = {
        categoriesLoading: false,
        categoriesError: false,
        categories: [],
    };

    componentDidMount() {
        this.loadData()
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress = () => {
        console.warn('Botón atrás presionado');
        return true;
        this.goBack(); // works best when the goBack is async
        return true;
    }

    
    render() {
      // console.warn(this.props.navigation.state.params)
      if(this.state.ready) {
        console.warn(this.state)
      }
      // if( ! this.init ){
      //   this.loadCourses();
      //   this.init = true;
      // }
      const { navigation, expenses, deleteExpense, expensesLoading } = this.props;
      return (
        <Container>
          <ImageBackground
            source={require('@assets/images/header-bg.png')}
            style={styles.background}>
            <AppHeader
              navigation={navigation}
              title="Mis cursos"
            />
            <Content
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flex: 1 }}
              style={styles.content}>
              {this.state.coursesLoading && (
                <View style={styles.emptyContainer}>
                  <Spinner color={theme.brandPrimary} />
                </View>
              )}
              {!this.state.coursesLoading &&
                this.state.courses.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyMsg}>No expenses found</Text>
                  </View>
                )}

              {this.state.ready && (
                  <View style={styles.emptyContainer}>
                    <Text>{ this.state.numAnswers }</Text>
                    <Text>{ this.state.numQuestionGiven }</Text>
                    <Text>{ this.state.numCorrectAnswers }</Text>
                    <Text>{ this.state.finishedInASession }</Text>
                    <Text>{ this.state.randomMode }</Text>
                    <Text>{ this.state.courseCompleted }</Text>
                    <Text>{ this.state.time } segundos</Text>

                  </View>
                )
                
                /**
                  numAnswers:  jsonResponse.data.num_answers,
                  numQuestionGiven: jsonResponse.data.num_questions_given,
                  numCorrectAnswers: jsonResponse.data.num_correct_answers,
                  finishedInASession: jsonResponse.data.finished_in_a_session,
                  randomMode: jsonResponse.data.random_mode,
                  courseCompleted: jsonResponse.data.course_completed, // Time is returned in seconds
                  time: jsonResponse.data.time,
                  ready: ready,
                 */
                }
              {!this.state.coursesLoading &&
                this.state.courses.length > 0 && (
                  <ExpensesList
                    expensesList={this.state.courses}
                    navigation={navigation}
                    handleDelete={deleteExpense}
                    _onPress={
                      (courseId, courseName) => navigation.navigate('CourseOverview', {
                        courseId: courseId, courseName
                      })
                    }
                  />
                )}
              {/* <Fab
                direction="up"
                containerStyle={{}}
                style={{ backgroundColor: theme.brandPrimary }}
                position="bottomRight"
                onPress={() => navigation.navigate('NewExpense')}>
                <Icon type="Feather" name="plus" />
              </Fab> */}
            </Content>
          </ImageBackground>
        </Container>
      );
    }

    loadData = async () => {
      getBearerToken().then(
        (bearerToken) => {
          this.setState({ bearerToken }, () => {
            url = api.getSessionStats;
            data = JSON.stringify({
              session: this.props.navigation.state.params.session,
              num_questions: this.props.navigation.state.params.num_questions_given,
              course_id: this.props.navigation.state.params.course_id,
            });
            
            fetch(url, {
              method: 'POST', 
              headers: {
                "Authorization": 'Bearer ' + this.state.bearerToken,
                Accept: 'application/json',
                "Content-Type": "application/json"
              },
              body: data
            }).then(
              response => {
                return response.json();
              }
            ).then(
              jsonResponse => {
                console.log(jsonResponse)
                this.setState({
                  numAnswers:  jsonResponse.data.num_answers,
                  numQuestionGiven: jsonResponse.data.num_questions_given,
                  numCorrectAnswers: jsonResponse.data.num_correct_answers,
                  finishedInASession: jsonResponse.data.finished_in_a_session,
                  randomMode: jsonResponse.data.random_mode,
                  courseCompleted: jsonResponse.data.course_completed, // Time is returned in seconds
                  time: jsonResponse.data.time,
                  ready: true,
                })
              }
            )

          })
        }
      )
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
)(SessionResults);
