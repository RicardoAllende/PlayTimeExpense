import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native'
import { View, Grid, Col, Text, Icon, Item } from 'native-base';

import { formatAmount } from '@utils/formatters';
import styles from './styles';

const ExpenseItem = ({ item, style, color, _onPress }) => {
  const borderColor = color ? color : item.color;

  _onPressButton = (courseId) => {
    console.log('Se presionó el elemento:', courseId)
  }

  return (
    <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      <TouchableOpacity onPress={() => _onPress(item.name) }>
      <Grid>
        <Col size={7} style={{ flexDirection: 'row' }}>
          <Icon name="laptop" style={styles.item.icon} />
          <View>
            <Text numberOfLines={2} style={styles.item.title}>
              {item.name}
            </Text>
            <Text numberOfLines={2} style={styles.item.subtitle}>
              {item.description.substr(0, 25) + ' ...'}
            </Text>
          </View>
        </Col>
        <Col size={3}>
          <Text
            numberOfLines={2}
            style={
              item.amount < 0
                ? styles.item.expenseAmount
                : styles.item.incomeAmount
            }>
            {item.num_questions}
          </Text>
        </Col>
      </Grid>
      </TouchableOpacity>
    </View>
  );
};

// ExpenseItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   style: PropTypes.object,
//   color: PropTypes.string,
// };

export default ExpenseItem;
