import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';
import { ImageBackground } from 'react-native';
import { Container, Content, View, Spinner, Text } from 'native-base';
import { connect } from 'react-redux';
import AppHeader from '@components/AppHeader';
import Notification from '@components/Notification';
import theme from '@theme/variables/myexpense';
import ExpensesResultList from './ExpensesResultList';

import * as actions from './behaviors';
import * as searchSelectors from './selectors';

import styles from './styles';

class ExpenseSearch extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    doSearch: PropTypes.func.isRequired,
    searchResult: PropTypes.array,
    searching: PropTypes.bool.isRequired,
    searchError: PropTypes.bool.isRequired,
    doExport: PropTypes.func.isRequired,
    exporting: PropTypes.bool.isRequired,
    exportError: PropTypes.bool.isRequired,
    exportSuccess: PropTypes.bool.isRequired,
  };

  state = {
    expenses: [],
  };

  static defaultProps = {
    searching: false,
    searchError: false,
    exporting: false,
    exportError: false,
    exportSuccess: false,
  };

  static getDerivedStateFromProps(props) {
    if (!props.searching && !props.searchError) {
      const expensesGroupedByDate = groupBy(props.searchResult, 'date');
      const expensesWithDate = Object.keys(expensesGroupedByDate).map(date => ({
        date,
        isDate: true,
        id: date,
        data: expensesGroupedByDate[date],
      }));
      return {
        expenses: expensesWithDate,
      };
    }
    return null;
  }

  componentDidMount() {
    this.initialize();
  }

  initialize = (initialize = false) => {
    if (
      this.props.searchResult === undefined ||
      this.props.searchResult.length === 0
    ) {
      this.props.doSearch('data', initialize);
    }
  };

  render() {
    const { navigation, searching, exportSuccess } = this.props;
    const { expenses } = this.state;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.container}>
          <AppHeader
            displayAvatar={false}
            displaySearch={true}
            navigation={navigation}
            onSearch={this.props.doSearch}
            onExport={this.props.doExport}
          />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={{ backgroundColor: '#fff' }}>
            {exportSuccess && (
              <Notification
                message="Data successfully exported"
                duration={3000}
                buttonText="Ok"
                position="bottom"
                type="info"
              />
            )}
            {searching && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {!searching &&
              expenses.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMsg}>No expenses found</Text>
                </View>
              )}
            {!searching &&
              expenses.length > 0 && (
                <ExpensesResultList
                  expensesList={expenses}
                  expensesLoading={searching}
                />
              )}
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  searchResult: searchSelectors.getSearchResultState(state),
  searching: searchSelectors.getSearchingState(state),
  searchError: searchSelectors.getSearchErrorState(state),
  exporting: searchSelectors.getExportingState(state),
  exportSuccess: searchSelectors.getExportSuccessState(state),
  exportError: searchSelectors.getExportErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(ExpenseSearch);
