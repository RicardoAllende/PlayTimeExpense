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

  render() {
    const { navigation, expenses, deleteExpense, expensesLoading } = this.props;
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
