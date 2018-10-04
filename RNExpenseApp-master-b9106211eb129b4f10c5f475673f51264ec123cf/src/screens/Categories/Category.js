import React from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';
import { Text, Icon, View } from 'native-base';

import styles from './styles';
import { formatAmount } from '@utils/formatters';

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
        onPress={() => navigation.navigate('Expenses')}>
        <View style={styles.categoryBox}>
          <Icon name={category.iconName} style={styles.categoryIcon} />
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <Text style={styles.categoryAmount}>
            {' '}
            {formatAmount(category.amount)}
          </Text>
          <View
            style={styles.categoryLine}
            borderColor={categoryColors[index % categoryColors.length]}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default Category;
