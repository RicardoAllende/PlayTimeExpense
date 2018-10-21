import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';

import { View, Button, Icon, SwipeRow } from 'native-base';

import AchievementItem from '@components/ExpenseItem/AchievementItem';
import categoryColors from '@theme/categoryColors';

import styles from './styles';

class AchievementsList extends Component {
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
    console.log('AchievementsList this.props.achievements', this.props.achievements)
    return (
      <View
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#F4F4F4' }}>
        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          data={this.props.achievements}
          initialNumToRender={7}
          renderItem={({ item, index }) => 
          // console.log("AchievementsList.js ", item)
          (
            // console.log(item)
            // return;
            <SwipeRow
              rightOpenValue={-85}
              disableRightSwipe={true}
              style={styles.item.container}
              body={
                <AchievementItem
                  item={item}
                  // style={{}}
                  color={categoryColors[index % categoryColors.length]}
                  // _onPress={ console.log('Click desde AchievementsList.js ') }
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

export default AchievementsList;
