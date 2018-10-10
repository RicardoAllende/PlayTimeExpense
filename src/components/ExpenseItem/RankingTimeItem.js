import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native'
import { View, Grid, Col, Text, Icon, Item } from 'native-base';

import { formatAmount } from '@utils/formatters';
import styles from './styles';

const RankingTimeItem = ({ item, style, color, _onPress }) => {
  const borderColor = color ? color : item.color;

  _onPressButton = (courseId) => {
    this.props.navigation.navigate('Quizz', {
      courseId: courseId
    })
  }

  return (
    <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      <TouchableOpacity onPress={() => console.log('') }>
      <Grid>
        <Col size={7} style={{ flexDirection: 'row' }}>
          <Icon name="laptop" style={styles.item.icon} />
          <View>
            <Text numberOfLines={2} style={styles.item.title}>
              {item.rank + ' ' + item.firstname + ' ' + item.lastname }
            </Text>
          </View>
        </Col>
        <Col size={3}>
          <Text
            numberOfLines={2}
            style={ styles.item.incomeAmount }>
            { item.time }
          </Text>
        </Col>
      </Grid>
      </TouchableOpacity>
    </View>
  );
};

export default RankingTimeItem;
