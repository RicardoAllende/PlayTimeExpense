import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import moment from 'moment';
import {
  Container, Content,  Tabs,  Tab,  Text,  Icon,  Fab,  Spinner,  View,
} from 'native-base';
import { connect } from 'react-redux';

import RankingList from './RankingList';
import AppHeader from '@components/AppHeader';

import * as actions from './behaviors';
import * as expensesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

import {api} from './../../../api/playTimeApi'
import {session, getUserData} from './../../../api/session'
import { AsyncStorage } from "react-native"


class CourseRanking extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    getExpenses: PropTypes.func.isRequired,
    expensesLoading: PropTypes.bool.isRequired,
    expensesError: PropTypes.bool.isRequired,
    expenses: PropTypes.array,
    deleteExpense: PropTypes.func,
  };

  loadData = () => {
    getUserData().then(
      
      this.setState({ bearerToken: userData.bearerToken, bearerReady: true, userData: userData }, () => {
        () => { // BearerToken ready
          url = api.getCourseOverView(this.props.navigation.state.params.courseId);
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
              console.log('CourseRanking.js cargando Overview')
              this.setState({
                  ranking: jsonResponse.data.ranking.users, times: jsonResponse.data.ranking.times, 
                  medals: jsonResponse.data.medal_ranking, ready: true
                }, 
                ()=>{
                    console.log('Carga de elementos terminada')
                }
              )
          }
          ).catch((error) => { console.error(error); })
        }
      })
    )
  }

  static defaultProps = {
    expensesLoading: false,
    expensesError: false,
  };

  state = {
    headerTitle: moment().format('dddd,'),
    headerTitleSuffix: moment().format('MMM DD'),
    ready: false
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    // this.props.getExpenses();
  };

  switchPeriod(i) {
    var m = moment();
    let title = '';
    let period = '';
    switch (i) {
      case 0:
        title = m.format('dddd,');
        period = m.format('MMM DD');
        break;
      case 1:
        title =
          m.startOf('week').format('DD') +
          ' - ' +
          m.endOf('week').format('DD,');
        period = m.format('MMM, YYYY');
        break;
      case 2:
        title = m.format('MMMM, ');
        period = m.format('YYYY');
        break;
    }

    this.setState({ headerTitle: title, headerTitleSuffix: period });
  }

  render() {
    const { navigation,  deleteExpense, expensesLoading } = this.props;
    // console.log(JsonExpenses)
    return (
      <Container>
        <ImageBackground
          source={{ uri: 'https://koenig-media.raywenderlich.com/uploads/2014/01/sunny-background.png', cache: 'only-if-cached', }}
          // source={require('@assets/images/header-bg.png')}
          style={styles.container}>
          <AppHeader
            navigation={navigation}
            title={this.state.headerTitle}
            titleSuffix={this.state.headerTitleSuffix}
          />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={styles.content}>
            { ! this.state.ready && (
              //expensesLoading && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {
              this.state.ready &&
              (
                <Tabs
                  tabContainerStyle={{
                    elevation: 0,
                  }}
                  locked
                  onChangeTab={({ i, ref, from }) =>
                    this.switchPeriod(i, ref, from)
                  }>
                  <Tab heading="Avances del curso">
                    <RankingList
                      expensesList={jsonExp}
                      handleDelete={deleteExpense}
                    />
                  </Tab>
                  <Tab heading="Ranking del curso">
                    <RankingList
                      expensesList={JsonExpenses}
                      handleDelete={deleteExpense}
                    />
                  </Tab>
                  <Tab heading="Logros en el curso">
                    <RankingList
                      expensesList={JsonExpenses}
                      handleDelete={deleteExpense}
                    />
                  </Tab>
                </Tabs>
              )}
            <Fab
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: theme.brandPrimary }}
              position="bottomRight"
              onPress={() => navigation.navigate('NewExpense')}>
              <Icon type="Feather" name="plus" />
            </Fab>
          </Content>
        </ImageBackground>
      </Container>
    );
  }

}

const mapStateToProps = state => ({
  expenses: expensesSelectors.getExpenses(state),
  expensesLoading: expensesSelectors.getExpensesLoadingState(state),
  expensesError: expensesSelectors.getExpensesErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(CourseRanking);


const JsonExpenses = [
  {
      "firstname": "Lenna Baumbach",
      "lastname": "Tabitha Brekke",
      "gender": "female",
      "hits": 3,
      "correct_answers": 3,
      "tries": 3,
      "rank": 1
  },
  {
      "firstname": "Crystel Lowe",
      "lastname": "Prof. Cody Ledner MD",
      "gender": "male",
      "hits": 3,
      "correct_answers": 3,
      "tries": 3,
      "rank": 2
  },
  {
      "firstname": "Grace Hoppe",
      "lastname": "Prof. Elva Brakus PhD",
      "gender": "female",
      "hits": 3,
      "correct_answers": 3,
      "tries": 3,
      "rank": 3
  },
  {
      "firstname": "Ricardo",
      "lastname": "Allende",
      "gender": "male",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 4
  },
  {
      "firstname": "Krystina Leffler",
      "lastname": "Dr. Scot Langosh",
      "gender": "male",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 5
  },
  {
      "firstname": "Prof. Lizzie Orn V",
      "lastname": "Damien Purdy",
      "gender": "male",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 6
  },
  {
      "firstname": "Miss Kailyn Brekke",
      "lastname": "Theresia Prosacco",
      "gender": "male",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 7
  },
  {
      "firstname": "Natalia Pacocha",
      "lastname": "Evalyn Reilly",
      "gender": "female",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 8
  },
  {
      "firstname": "Dr. Casper Lockman",
      "lastname": "Prof. Austin Gerlach",
      "gender": "male",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 9
  },
  {
      "firstname": "Gage Bashirian",
      "lastname": "Rosalyn Doyle",
      "gender": "female",
      "hits": 2,
      "correct_answers": 2,
      "tries": 2,
      "rank": 10
  }
]