import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import { View, Button, Icon, SwipeRow } from 'native-base';

import RankingItem from '@components/ExpenseItem/RankingItem';
import categoryColors from '@theme/categoryColors';

import styles from './styles';

class RankingList extends Component {
  static propTypes = {
    expensesList: PropTypes.array,
    handleDelete: PropTypes.func,
  };

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
                <RankingItem
                  item={item}
                  style
                  color={categoryColors[index % categoryColors.length]}
                  _onPress={ () => console.log('elemento del ranking presionado') }
                />
              }
              right={
                <Button
                  primary
                  style={styles.swipeBtn}
                  onPress={() => alert("Yendo al curso") }>
                  <Icon active name="ios-play" style={{ fontSize: 35 }} />
                </Button>
              }
            />
          )}
          keyExtractor={item => "userRank" + item.id}
        />
      </View>
    );
  }
}

export default RankingList;
