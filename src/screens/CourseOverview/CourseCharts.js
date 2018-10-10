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
import ExpensesList from './ExpensesList'
import {
  getFormattedCurrentWeek,
  getFormattedCurrentMonth,
} from '@utils/formatters';
import Ranking from './Ranking'

import styles from './styles';

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
                this.setState({
                    usersRanking: jsonResponse.data.ranking.users, times: jsonResponse.data.ranking.times, 
                    medalRanking: jsonResponse.data.medal_ranking, advance: jsonResponse.data.advance, 
                    approvalPercentage: jsonResponse.data.pie_chart, medals: jsonResponse.data.medals,
                    achievements: jsonResponse.data.achievements, ready: true
                  }, 
                  ()=>{
                      console.log('CoursCharts Carga de elementos terminada')
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
          style={styles.container}>
          <AppHeader
            navigation={this.props.navigation}
            title={this.props.navigation.state.params.courseName}
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
                <Tab heading="Ranking de usuarios">
                  <CourseCarousel
                    categories={categories}
                    gaugeChart
                    pieChart
                    approvalPercentage={this.state.approvalPercentage}
                    barChart
                    chashFlowChart
                    coursePercentage={this.state.advance}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Estadísticas del curso">
                  <Ranking
                    gaugeChart
                    showList
                    users={this.state.usersRanking}
                    gaugeData={this.state.advance}
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Logros en el curso">
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
