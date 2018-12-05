import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { Text, Icon } from 'native-base';
import styles from './styles';
const maxLenght = 24
class MenuItem extends React.PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  render() {
    const itemStyle = this.props.selected
      ? [styles.menuItem.button, styles.menuItem.selected]
      : styles.menuItem.button;

    title = this.props.title
    // console.log('title.lenght', this.props.title.length)
    if(title.length > 23){
        title = title.substr(0, maxLenght) + ' ...'
    }
    return (
      <TouchableOpacity style={itemStyle} onPress={this.onPress}>
        <Icon name={this.props.icon} style={styles.menuItem.icon} />
        <Text adjustsFontSizeToFit={true} style={styles.menuItem.title}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
MenuItem.propTypes = {
//   id: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  onPressItem: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
};
export default MenuItem;
