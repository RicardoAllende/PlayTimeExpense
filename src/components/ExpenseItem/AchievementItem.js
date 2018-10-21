import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native'
import { View, Grid, Col, Text, Icon, Item } from 'native-base';

import { formatAmount } from '@utils/formatters';
// import {formatSeconds} from '@api/helpers'
import styles from './styles';
import { api } from '../../../api/playTimeApi';

const AchievementItem = ({ item, style, color, _onPress }) => {
  const borderColor = color ? color : item.color;

  _onPressButton = (courseId) => {
    alert("Ranking item " + courseId);
    // <Button
    //               primary
    //               style={styles.swipeBtn}
    //               onPress={
    this.props.navigation.navigate('Quizz', {
      courseId: courseId
    })
    // }>
    // <Icon active name="ios-play" style={{ fontSize: 35 }} />
    // console.log('Se presionó el elemento:', courseId)
  }

  // console.log('ExpenseItem.js', item);
  return (
    <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      <TouchableOpacity onPress={() => console.log('') }>
      <Grid>
        <Col size={7} style={{ flexDirection: 'row' }}>
          <Icon name="laptop" style={styles.item.icon} />
          <View>
            <Text numberOfLines={2} style={styles.item.title}>
              {/* {item.rank + ' ' + item.firstname + ' ' + item.lastname } */}
              {item.name}
            </Text>
            {/* <Text numberOfLines={2} style={styles.item.subtitle}>
              Subtítulo del elemento
            </Text> */}
          </View>
        </Col>
        <Col size={3}>
          <Text
            numberOfLines={2}
            style={ styles.item.incomeAmount }>
            {/* .expenseAmount || .incomeAmount */}
            { item.pivot.number }
          </Text>
        </Col>
      </Grid>
      </TouchableOpacity>
    </View>
  );
};

export default AchievementItem;
