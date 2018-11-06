// Listado de cursos
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import { View, Button, Icon, SwipeRow } from 'native-base';

import ExpenseItem from '@components/ExpenseItem';
import categoryColors from '@theme/categoryColors';

import styles from './styles';

class ExpensesList extends Component {
  // static propTypes = {
  //   expensesList: PropTypes.array,
  //   handleDelete: PropTypes.func,
  // };

  static defaultProps = {
    expensesList: [],
  };

  deleteItem(itemId) {
    this.props.handleDelete(itemId);
  }

  render() {
    const { expensesList } = this.props;

    return (
      <View
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F4F4F4' }}>
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={expensesList}
          initialNumToRender={7}
          renderItem={({ item, index }) => (
            <SwipeRow
              rightOpenValue={-85}
              disableRightSwipe={true}
              style={styles.item.container}
              body={
                <ExpenseItem
                  item={item}
                  style={{}}
                  color={categoryColors[index % categoryColors.length]}
                  _onPress={this.props._onPress}
                />
              }
              right={
                <Button
                  primary
                  style={styles.swipeBtn}
                  onPress={
                    () => this.props.navigation.navigate('CourseOverview', {
                      courseId: item.id
                    })
                  }>
                  <Icon active name="ios-stats" style={{ fontSize: 35 }} />
                </Button>
              }
            />
          )}
          keyExtractor={item => "course" + item.id}
        />
      </View>
    );
  }
}

export default ExpensesList;
