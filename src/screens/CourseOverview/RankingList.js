import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import { View, Button, Icon, SwipeRow } from 'native-base';

import RankingItem from '@components/ExpenseItem/RankingItem';
import categoryColors from '@theme/categoryColors';

import styles from '../Expenses/styles';

class RankingList extends Component {
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
    // console.log('RankingList gaugeData', this.props.expensesList)
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
          renderItem={({ item, index }) => 
          // console.log("RankingList.js ", item)
          (
            // console.log(item)
            // return;
            <SwipeRow
              rightOpenValue={-85}
              disableRightSwipe={true}
              style={styles.item.container}
              body={
                <RankingItem
                  item={item}
                  // style={{}}
                  color={categoryColors[index % categoryColors.length]}
                  // _onPress={ console.log('Click desde RankingList.js ') }
                />
              }
              right={
                <Button
                  primary
                  style={styles.swipeBtn}
                  onPress={
                    () => console.log('Tap en elemento')
                  }>
                  <Icon active name="ios-play" style={{ fontSize: 35 }} />
                </Button>
              }
            />
          )
        }
          keyExtractor={(item, index) => "course" + index}
        />
      </View>
    );
  }
}

export default RankingList;
