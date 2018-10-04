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

import ExpensesList from './ExpensesList';
import AppHeader from '@components/AppHeader';

import * as actions from './behaviors';
import * as expensesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

class Expenses extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    getExpenses: PropTypes.func.isRequired,
    expensesLoading: PropTypes.bool.isRequired,
    expensesError: PropTypes.bool.isRequired,
    expenses: PropTypes.array,
    deleteExpense: PropTypes.func,
  };

  static defaultProps = {
    expensesLoading: false,
    expensesError: false,
  };

  state = {
    headerTitle: moment().format('dddd,'),
    headerTitleSuffix: moment().format('MMM DD'),
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
    console.log(expenses)
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
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
            {expensesLoading && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {!expensesLoading &&
              expenses.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMsg}>No expenses found</Text>
                </View>
              )}
            {!expensesLoading &&
              expenses.length > 0 && (
                <Tabs
                  tabContainerStyle={{
                    elevation: 0,
                  }}
                  locked
                  onChangeTab={({ i, ref, from }) =>
                    this.switchPeriod(i, ref, from)
                  }>
                  <Tab heading="Today">
                    <ExpensesList
                      expensesList={expenses}
                      handleDelete={deleteExpense}
                    />
                  </Tab>
                  <Tab heading="This Week">
                    <ExpensesList
                      expensesList={expenses}
                      handleDelete={deleteExpense}
                    />
                  </Tab>
                  <Tab heading="This Month">
                    <ExpensesList
                      expensesList={expenses}
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
)(Expenses);


const expenses = [
  {
      "title": "Ricardo",
      "date": "Allende",
      "gender": "male",
      "amount": 4,
      "correct_answers": 4,
      "tries": 4,
      "id": 1,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Eileen O'Keefe",
      "date": "Andrew Schumm",
      "gender": "male",
      "amount": 4,
      "correct_answers": 4,
      "tries": 4,
      "id": 2,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Alanna Gerlach",
      "date": "Skylar Ryan I",
      "gender": "male",
      "amount": 4,
      "correct_answers": 4,
      "tries": 4,
      "id": 3,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Ms. Liliana Haley",
      "date": "Quinten Hamill",
      "gender": "female",
      "amount": 4,
      "correct_answers": 4,
      "tries": 4,
      "id": 4,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Prof. Joey Gerhold",
      "date": "Frederik Murphy",
      "gender": "female",
      "amount": 3,
      "correct_answers": 3,
      "tries": 3,
      "id": 5,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Jamar Satterfield",
      "date": "Miss Fabiola Cremin",
      "gender": "female",
      "amount": 3,
      "correct_answers": 3,
      "tries": 3,
      "id": 6,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Letitia Carroll III",
      "date": "Mr. Wiley Lind",
      "gender": "female",
      "amount": 3,
      "correct_answers": 3,
      "tries": 3,
      "id": 7,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Isaiah Schmeler",
      "date": "Lexie Kilback",
      "gender": "female",
      "amount": 3,
      "correct_answers": 3,
      "tries": 3,
      "id": 8,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Abdul Bauch",
      "date": "Prof. Alexane Bosco",
      "gender": "male",
      "amount": 2,
      "correct_answers": 2,
      "tries": 2,
      "id": 9,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  },
  {
      "title": "Elisa Trantow",
      "date": "Prof. Stephen Mueller V",
      "gender": "female",
      "amount": 2,
      "correct_answers": 2,
      "tries": 2,
      "id": 10,
      "type": 'Credit card',
      "category": 'General',
      "categoryIcon": 'ios-cash-outline'
  }
];