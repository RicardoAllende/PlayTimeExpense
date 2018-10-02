import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { Text, Icon, View } from 'native-base';

import styles from './styles';
import { formatAmount } from '@utils/formatters';
import * as Animatable from 'react-native-animatable';

import categoryColors from '@theme/categoryColors';

export class Category extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      category: PropTypes.string,
      percent: PropTypes.number,
      amount: PropTypes.number,
    }).isRequired,
    index: PropTypes.number.isRequired,
    navigation: PropTypes.any,
  };

  render() {
    const {
      item: { ...category },
      navigation,
      index,
    } = this.props;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => console.log('Se presionó el elemnto con el id ', category.id, 'De la pregunta', category.name)}>
        <Animatable.View style={styles.categoryBox} animation="bounceInLeft" iterationCount={1} direction="alternate">
          {/* <Icon name={category.iconName} style={styles.categoryIcon} /> */}
          <Text style={styles.categoryTitle}>{category.name}</Text>
          {/* <Text style={styles.categoryAmount}>
            {' '}
            {formatAmount(category.amount)}
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

export default Category;
