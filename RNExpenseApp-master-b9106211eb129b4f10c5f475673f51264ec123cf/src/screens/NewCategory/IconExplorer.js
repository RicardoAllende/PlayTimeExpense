import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableOpacity } from 'react-native';
import { Icon, View } from 'native-base';

import { icons } from './config';

import styles from './styles';

class IconExplorer extends PureComponent {
  state = {
    icons: [],
  };

  renderIconItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => this.props.onIconSelect(item)}>
      <View style={styles.iconExplorer.container}>
        <Icon name={item} style={styles.iconExplorer.icon} />
      </View>
    </TouchableOpacity>
  );

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.setState(() => ({
      icons: icons,
    }));
  };

  render() {
    return (
      <View showsVerticalScrollIndicator={false} style={styles.content}>
        <FlatList
          horizontal={false}
          numColumns={7}
          data={this.state.icons}
          renderItem={this.renderIconItem}
          keyExtractor={item => item}
          initialNumToRender={20}
        />
      </View>
    );
  }
}

IconExplorer.propTypes = {
  onIconSelect: PropTypes.func,
};

export default IconExplorer;
