import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, StyleSheet } from 'react-native';
import { Container, Tabs, Tab, Spinner, View, Text } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import CourseCarousel from '../CourseOverview/CourseCarousel';
import AppHeader from '@components/AppHeader';
import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';
import theme from '@theme/variables/myexpense';
import { AsyncStorage } from "react-native"
import {api} from './../../../api/playTimeApi'
import {session, getBearerToken, getUserData} from './../../../api/session'
import ExpensesList from '../CourseOverview/ExpensesList'
import {
  getFormattedCurrentWeek,
  getFormattedCurrentMonth,
} from '@utils/formatters';
import Ranking from '../CourseOverview/Ranking'

import chartStyles from './chartStyles';

class CourseCharts extends Component {
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

  state = {
    currentPeriod: getFormattedCurrentWeek(),
    showPieChart: false,
    ready: false,
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.props.getCategories();
  };

  switchPeriod(i) {
    let period = '';
    switch (i) {
      case 0:
        period = getFormattedCurrentWeek();
        break;
      case 1:
        period = getFormattedCurrentMonth();
        break;
      case 2:
        period = moment().format('YYYY');
        break;
    }

    this.setState({ currentPeriod: period });
  }

  loadData = () => {
    console.log('CourseCharts.js Cargando preguntas')
    getUserData().then(
      (userData) => {
        this.setState({ bearerToken: userData.bearerToken, bearerReady: true, userData: userData }, () => {
          // () => { // BearerToken ready
          console.log("Loading questions");
          url = api.getCourseOverView(this.props.navigation.state.params.courseId);
          // console.log(url)
          // console.log(this.state.bearerToken, url);
            fetch(url, { 
                method: 'GET', 
                headers: {
                    "Authorization": 'Bearer ' + this.state.bearerToken,
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((jsonResponse) => {
                // console.log(jsonResponse)
                // return
                // console.log(jsonResponse)
                this.setState({
                    usersRanking: jsonResponse.data.ranking.users, times: jsonResponse.data.ranking.times, 
                    medalRanking: jsonResponse.data.medal_ranking, advance: jsonResponse.data.advance, 
                    approvalPercentage: jsonResponse.data.pie_chart, medals: jsonResponse.data.medals,
                    achievements: jsonResponse.data.achievements, totalQuestions: jsonResponse.data.ranking.total_questions, ready: true
                  }, 
                  ()=>{
                      console.log('SessionResults Carga de elementos terminada')
                  }
                )
            }
            ).catch((error) => { console.error(error); })
          // }
        })
      }
    )
  }

  componentDidMount(){
    this.loadData();
  }

  init = false;
  render() {
    // if(! this.init ){
    //   this.loadData();
    //   this.init = true;
    // }
    // console.log("CourseChart.js Overview")
    const { navigation, categoriesLoading, categories } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={chartStyles.container}>
          <AppHeader
            navigation={this.props.navigation}
            title={this.state.ready ? this.state.courseName : "_"}
            titleSuffix='.'
          />
          { ! this.state.ready && (
            <View style={chartStyles.emptyContainer}>
              <Spinner color={theme.brandPrimary} />
            </View>
          )}
          {/* { this.state.ready &&
            categories.length === 0 && (
              <View style={chartStyles.emptyContainer}>
                <Text style={chartStyles.emptyMsg}>Error al cargar las estadísticas del curso</Text>
              </View>
            )} */}

          { this.state.ready &&(
              <Tabs
                tabContainerStyle={{
                  elevation: 0,
                }}
                locked
                onChangeTab={({ i, ref, from }) =>
                  this.switchPeriod(i, ref, from)
                }>
                <Tab heading="Resultados">
                  <View style={stylesTabView.container}>
                    <Text style={stylesTabView.textDescription} >Usted contestó { this.state.numAnswers } preguntas</Text>
                    <Text>Total de preguntas restantes en el curso: { this.state.numQuestionsGiven }</Text>
                    <Text style={stylesTabView.textDescription} >De las cuales, tuvo { this.state.numCorrectAnswers } correctas</Text>
                    <Text>{ this.state.finishedInASession ? 'Terminado en una sesión' : 'No terminado' }</Text>
                    <Text style={stylesTabView.textDescription} >{ this.state.randomMode ? "Se hizo en modo aleatorio" : "Se hizo en modo normal" }</Text>
                    <Text>{ this.state.courseCompleted ? "El curso está terminado" : "El curso no está terminado" }</Text>
                    <Text style={stylesTabView.textDescription} >Su tiempo fue de: { this.state.time } segundos</Text>
                  </View>
                  {/* <CourseCarousel
                    categories={categories}
                    totalQuestions={this.state.totalQuestions}
                    // pieChart
                    approvalPercentage={this.state.approvalPercentage}
                    barChart
                    chashFlowChart
                    totalQuestions={this.state.totalQuestions}
                    coursePercentage={this.state.advance}
                    navigation={navigation}
                  /> */}
                </Tab>
                <Tab heading="Avance">
                  <Ranking
                    gaugeChart
                    showList
                    users={this.state.usersRanking}
                    gaugeData={this.state.advance}
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Compartir">
                  <CourseCarousel
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab>
              </Tabs>
            )}
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
                numAnswers:  jsonResponse.data.num_answers, // Num questions the user answered
                numQuestionsGiven: jsonResponse.data.num_questions_given, // Total questions in the quizz
                numCorrectAnswers: jsonResponse.data.num_correct_answers,
                finishedInASession: jsonResponse.data.finished_in_a_session,
                randomMode: jsonResponse.data.random_mode,
                courseCompleted: jsonResponse.data.course_completed, // Time is returned in seconds
                time: jsonResponse.data.time,
                courseName: jsonResponse.data.course_name,
                ready: true,
              }, () => console.log("Elementos cargados en el estado") )
            }
          )

        })
      }
    )
  }

}

const stylesTabView = StyleSheet.create({
  container: {
    padding: "5%",
    // backgroundColor: "blue",
    flex: 1,
  },
  textDescription: {
    fontFamily: 'Roboto_light',
    fontSize: 16,
    padding: "5%", // default 30
    paddingTop: 0,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  categories: categoriesSelectors.getCategories(state),
  categoriesLoading: categoriesSelectors.getCategoriesLoadingState(state),
  categoriesError: categoriesSelectors.getCategoriesErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(CourseCharts);
