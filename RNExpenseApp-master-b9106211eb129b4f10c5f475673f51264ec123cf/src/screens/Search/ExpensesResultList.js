import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SectionList } from 'react-native';
import { Spinner, View } from 'native-base';

import ExpenseLine from './ExpenseLine';
import ExpensesSectionHeader from './ExpensesSectionHeader';

import theme from '@theme/variables/myexpense';
class ExpensesResultList extends Component {
  static propTypes = {
    expensesList: PropTypes.array,
    expensesLoading: PropTypes.bool,
  };

  static defaultProps = {
    expensesList: [],
    expensesLoading: true,
  };

  render() {
    const { expensesList, expensesLoading } = this.props;
    return (
      <View style={{ backgroundColor: '#F4F4F4' }}>
        {expensesLoading && <Spinner color={theme.brandPrimary} />}
        <SectionList
          sections={expensesList}
          renderItem={({ ...props }) => <ExpenseLine {...props} />}
          renderSectionHeader={({ ...props }) => (
            <ExpensesSectionHeader {...props} />
          )}
          keyExtractor={expense => expense.id}
          initialNumToRender={12}
        />
      </View>
    );
  }
}

export default ExpensesResultList;
