import React from 'react';
import PropTypes from 'prop-types';
import { Button, View, Item, Icon, Input } from 'native-base';

import styles from './styles';

const SearchHeader = props => {
  return (
    <View style={styles.searchHeader.container}>
      <Item style={styles.searchHeader.content}>
        <Input
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          style={styles.searchHeader.input}
          placeholder="Search"
        />
        <Button transparent onPress={() => props.onSearch()}>
          <Icon style={styles.searchHeader.btnIcon} name="search" />
        </Button>
        <Button transparent onPress={() => props.onExport()}>
          <Icon style={styles.searchHeader.btnIcon} name="download" />
        </Button>
      </Item>
    </View>
  );
};

SearchHeader.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default SearchHeader;
