import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './styles';
class MenuItem extends React.PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  render() {
    const itemStyle = this.props.selected
      ? [styles.menuItem.button, styles.menuItem.selected]
      : styles.menuItem.button;
    return (
      <TouchableOpacity style={itemStyle} onPress={this.onPress}>
        <Icon name={this.props.icon} style={styles.menuItem.icon} />
        <Text style={styles.menuItem.title}>{this.props.title}</Text>
      </TouchableOpacity>
    );
  }
}
MenuItem.propTypes = {
  id: PropTypes.string.isRequired,
  onPressItem: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
};
export default MenuItem;
