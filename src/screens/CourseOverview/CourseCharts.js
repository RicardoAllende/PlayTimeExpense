import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { Container, Tabs, Tab, Spinner, View, Text } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import CourseCarousel from './CourseCarousel';
import AppHeader from '@components/AppHeader';
import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';
import theme from '@theme/variables/myexpense';
import { AsyncStorage } from "react-native"
import {api} from './../../../api/playTimeApi'
import {session, getUserData} from './../../../api/session'
import {
  getFormattedCurrentWeek,
  getFormattedCurrentMonth,
} from '@utils/formatters';
import Ranking from './Ranking'

import styles from './styles';

import AchievementsList from '@components/Achievement/AchievementsList'

import PercentageCircle from 'react-native-percentage-circle';
const brandSuccess = '#50D2C2';

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
                // console.log(jsonResponse)s
                this.setState({
                    usersRanking: jsonResponse.data.ranking.users, times: jsonResponse.data.ranking.times, 
                    medalRanking: jsonResponse.data.medal_ranking, advance: jsonResponse.data.advance, 
                    approvalPercentage: jsonResponse.data.approval_percentage, medals: jsonResponse.data.medals,
                    course: jsonResponse.data.course,
                    achievements: jsonResponse.data.achievements, totalQuestions: jsonResponse.data.ranking.total_questions, ready: true
                  }, 
                  ()=>{
                      console.log('CoursCharts Carga de elementos terminada', this.state)
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

  render() {
    const { navigation, categoriesLoading, categories } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.container}>
          <AppHeader
            navigation={this.props.navigation}
            title={ this.state.course ? this.state.course.name : "_"}
            titleSuffix='_'
          />
          { ! this.state.ready && (
            <View style={styles.emptyContainer}>
              <Spinner color={theme.brandPrimary} />
            </View>
          )}
          {/* { this.state.ready &&
            categories.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyMsg}>Error al cargar las estadísticas del curso</Text>
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
                <Tab heading="Avances">
                  <CourseCarousel
                    categories={categories}
                    totalQuestions={this.state.totalQuestions}
                    approval
                    approvalPercentage={this.state.approvalPercentage}
                    // barChart
                    // chashFlowChart
                    totalQuestions={this.state.totalQuestions}
                    coursePercentage={this.state.advance}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Ranking">
                  <Ranking
                    gaugeChart
                    showList
                    users={this.state.usersRanking}
                    gaugeData={this.state.advance}
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Logros">
                  <AchievementsList
                    achievements={this.state.achievements}
                  />
                </Tab>
                {/* <Tab heading="Tiempo">
                  <CourseCarousel
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab> */}
              </Tabs>
            )}
        </ImageBackground>
      </Container>
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
)(CourseCharts);
