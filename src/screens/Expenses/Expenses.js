// Listado de cursos

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import moment from 'moment';
import {
  Container,
  Content,
  Tabs,
  Tab,
  Text,
  Icon,
  Fab,
  Spinner,
  View,
} from 'native-base';
import { connect } from 'react-redux';
import {session, getUserData, getCourses} from '../../../api/session'

import ExpensesList from './ExpensesList';
import AppHeader from '@components/AppHeader';

import * as actions from './behaviors';
import * as expensesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

import {api} from '../../../api/playTimeApi'
import { AsyncStorage } from "react-native"

class Expenses extends Component {

  static defaultProps = {
    expensesLoading: false,
    expensesError: false,
  };

  state = {
    headerTitle: moment().format('dddd,'),
    headerTitleSuffix: moment().format('MMM DD'),
    coursesLoading: true
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.props.getExpenses();
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

  loadData = async () => {
    getCourses().then((courses) => {
      courses = JSON.parse(courses)
      nuevoArreglo = [];
      console.log('Antes del map', courses.length)
      courses.forEach(course => {
        if(course.id != -1){
          return course;
        }
      });
      console.log('Después del map', courses.length);
      // console.log('Expenses loadData stringify', courses)
      this.setState({
        courses: courses, coursesLoading: false
      })
      // console.log(courses);
      // console.log(JSON.parse(courses))
    });
  }

  // loadCoursesInAsyncStorage = async () => {
  //   console.log('Consultando los cursos desde asyncstorage');
  //   getCourses().then((courses) => {
  //     console.log(JSON.parse(courses))
  //     console.log(courses);
  //   });
  // }

  _showCourse = () => {
    navigation.navigate('NewExpense')
  }

  init = false

  render() {
    if( ! this.init ){
      this.loadData();
      this.init = true;
    }
    const { navigation, expenses, deleteExpense, expensesLoading } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.container}>
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
            {!this.state.coursesLoading &&
              this.state.courses.length > 0 && (
                <ExpensesList
                  expensesList={this.state.courses}
                  navigation={navigation}
                  handleDelete={deleteExpense}
                  _onPress={
                    (courseId, courseName) => navigation.navigate('Quizz', {
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
}

const mapStateToProps = state => ({
  expenses: expensesSelectors.getExpenses(state),
  // expensesLoading: expensesSelectors.getExpensesLoadingState(state),
  expensesError: expensesSelectors.getExpensesErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(Expenses);