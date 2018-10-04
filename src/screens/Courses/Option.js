import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { Text, Icon, View } from 'native-base';

import styles from './styles';
import { formatAmount } from '@utils/formatters';
import * as Animatable from 'react-native-animatable';

import categoryColors from '@theme/categoryColors';

const animation = [
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'bounceInUp'
]

export class Option extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      option: PropTypes.string,
      percent: PropTypes.number,
      amount: PropTypes.number,
    }).isRequired,
    index: PropTypes.number.isRequired,
    navigation: PropTypes.any,
  };

  render() {
    // console.log("Rendering option")
    const {
      item: { ...option },
      navigation,
      index,
    } = this.props;
    _animation = animation[this.props.itemIndex]
    // console.log(_animation, ", Índice: ", this.props.itemIndex)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => this.props.gradeAnswer(option.question_id, option.id, option.is_correct) }>
        <Animatable.View style={styles.categoryBox} animation={_animation} iterationCount={1} direction="alternate">
          {/* <Icon name={option.iconName} style={styles.categoryIcon} /> */}
          <Text style={styles.categoryTitle}>{option.content}</Text>
          {/* <Text style={styles.categoryAmount}>
            {' '}
            {formatAmount(option.amount)}
          </Text> */}
          <View
            style={styles.categoryLine}
            borderColor={categoryColors[index % categoryColors.length]}
          />
        </Animatable.View>
      </TouchableOpacity>
    );
  }
}

export default Option;
