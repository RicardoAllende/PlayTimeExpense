import React from 'react';
import PropTypes from 'prop-types';
import { View, Grid, Col, Text, Icon } from 'native-base';

import { formatAmount } from '@utils/formatters';
import styles from './styles';

const ExpenseItem = ({ item, style, color }) => {
  const borderColor = color ? color : item.color;

  return (
    <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      <Grid>
        <Col size={7} style={{ flexDirection: 'row' }}>
          <Icon name={item.categoryIcon} style={styles.item.icon} />
          <View>
            <Text numberOfLines={2} style={styles.item.title}>
              {item.title}
            </Text>
            <Text numberOfLines={2} style={styles.item.subtitle}>
              {item.type}
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
            {formatAmount(item.amount)}
          </Text>
        </Col>
      </Grid>
    </View>
  );
};

ExpenseItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object,
  color: PropTypes.string,
};

export default ExpenseItem;
