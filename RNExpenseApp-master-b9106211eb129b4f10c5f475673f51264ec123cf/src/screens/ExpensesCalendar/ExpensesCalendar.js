import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import { groupBy } from 'lodash';
import { Container, Content, View, Text, Spinner, Icon } from 'native-base';
import { connect } from 'react-redux';
import { Agenda } from 'react-native-calendars';
import AppHeader from '@components/AppHeader';

import ExpenseItem from '@components/ExpenseItem';

import * as actions from './behaviors';
import * as eventsSelectors from './selectors';
import categoryColors from '@theme/categoryColors';
import styles from './styles';
import theme from '@theme/variables/myexpense';

class ExpensesCalendar extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    selected: PropTypes.string,
    getEvents: PropTypes.func.isRequired,
    eventsLoading: PropTypes.bool.isRequired,
    eventsError: PropTypes.bool.isRequired,
    events: PropTypes.array,
  };

  state = {
    date: new Date(),
    selected: '',
    items: {},
  };

  static defaultProps = {
    eventsLoading: false,
    eventsError: false,
  };

  static getDerivedStateFromProps(props) {
    if (!props.eventsLoading && !props.eventsError) {
      const eventsWithColor = props.events.map((obj, index) => {
        return {
          ...obj,
          color: categoryColors[index % categoryColors.length],
        };
      });
      const eventsGroupedByDate = groupBy(eventsWithColor, 'date');
      return {
        events: eventsGroupedByDate,
      };
    }
    return null;
  }
  renderItem(item) {
    return <ExpenseItem item={item} style={styles.agenda.item} />;
  }
  renderEmptyData() {
    return (
      <View style={styles.emptyContainer}>
        {this.props.eventsLoading ? (
          <Spinner color={theme.brandPrimary} />
        ) : (
          <Text style={styles.emptyMsg}>No events found for this date</Text>
        )}
      </View>
    );
  }
  rowHasChanged(r1, r2) {
    return r1.id !== r2.id;
  }

  render() {
    const { navigation } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.container}>
          <AppHeader hasTabs navigation={navigation} />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={styles.content}>
            <Agenda
              style={styles.agenda.container}
              items={this.state.events}
              loadItemsForMonth={day => {
                this.props.getEvents(day);
              }}
              renderItem={this.renderItem.bind(this)}
              rowHasChanged={this.rowHasChanged.bind(this)}
              selected={'2018-08-11'}
              pastScrollRange={2}
              futureScrollRange={2}
              renderEmptyData={this.renderEmptyData.bind(this)}
              renderKnob={() => {
                return (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.agenda.knobText}>More dates</Text>
                    <Icon
                      style={styles.agenda.knobIcon}
                      name="ios-arrow-down-outline"
                    />
                  </View>
                );
              }}
              theme={{
                calendarBackground: '#FFF',
                textSectionTitleColor: theme.brandPrimary,
                selectedDayBackgroundColor: theme.brandPrimary,
                selectedDayTextColor: '#FFF',
                todayTextColor: theme.brandPrimary,
                textDisabledColor: '#DDD',
                dotColor: theme.brandSecondary,
                selectedDotColor: '#FFF',
                arrowColor: theme.brandPrimary,
                monthTextColor: '#000',
                agendaKnobColor: 'blue',
              }}
            />
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  events: eventsSelectors.getEvents(state),
  eventsLoading: eventsSelectors.getEventsLoadingState(state),
  eventsError: eventsSelectors.getEventsErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(ExpensesCalendar);
