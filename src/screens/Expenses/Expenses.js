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
    coursesLoading: true,
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    getCourses().then((courses) => {
      courses = JSON.parse(courses)
      this.setState({
        courses: courses, coursesLoading: false
      })
    });
  }

  render() {
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
                  <Text style={styles.emptyMsg}>Aún no está inscrito a ningún curso, espere indicaciones de su administrador</Text>
                </View>
              )}
            {!this.state.coursesLoading &&
              this.state.courses.length > 0 && (
                <ExpensesList
                  expensesList={this.state.courses}
                  navigation={navigation}
                  handleDelete={deleteExpense}
                  _onPress={
                    (courseId, level) => navigation.navigate('Quizz', {
                      courseId, level
                    })
                  }
                />
              )}
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

export default Expenses;