import React, { PureComponent } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Icon,
  Left,
  Right,
  Thumbnail,
  Body,
  Button,
  Header,
} from 'native-base';

import HeaderDrawerButton from './HeaderDrawerButton';
import SearchHeader from './SearchHeader';

const logo = require('@assets/images/header-logo.png');
const avatar = require('@assets/images/avatar1.png');
import styles from './styles';

class AppHeader extends PureComponent {
  state = {
    displaySearchBar: false,
  };

  render() {
    return (
      <View style={this.props.style}>
        <Header transparent hasTabs>
          <Left style={{ flex: 1 }}>
            <HeaderDrawerButton navigation={this.props.navigation} />
          </Left>
          <Body style={{ flex: 1 }}>
            {this.props.displayLogo && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Expenses');
                }}>
                <Image source={logo} style={styles.logo} />
              </TouchableOpacity>
            )}
          </Body>
          <Right style={{ flex: 1 }}>
            {this.props.displayAvatar && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                <Thumbnail source={avatar} style={styles.avatar} />
              </TouchableOpacity>
            )}
            {this.props.displaySearch && (
              <Button
                transparent
                onPress={() => {
                  this.setState(() => ({
                    displaySearchBar: !this.state.displaySearchBar,
                  }));
                }}>
                <Icon active name="ios-search" style={{ fontSize: 34 }} />
              </Button>
            )}
          </Right>
        </Header>
        {this.props.title && (
          <View style={styles.titles.container}>
            <View style={styles.titles.content}>
              <Text style={styles.titles.text}>{this.props.title}</Text>
              {this.props.titleSuffix && (
                <Text note style={styles.titles.suffix}>
                  {' ' + this.props.titleSuffix}
                </Text>
              )}
            </View>
            {this.props.subTitle && (
              <Text note style={styles.titles.subTitle}>
                {this.props.subTitle}
              </Text>
            )}
          </View>
        )}
        {this.state.displaySearchBar && (
          <SearchHeader
            onSearch={this.props.onSearch}
            onExport={this.props.onExport}
          />
        )}
      </View>
    );
  }
}

AppHeader.propTypes = {
  navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }),
  title: PropTypes.string,
  titleSuffix: PropTypes.string,
  subTitle: PropTypes.string,
  style: PropTypes.object,
  displayAvatar: PropTypes.bool,
  displaySearch: PropTypes.bool,
  displayLogo: PropTypes.bool,
  onSearch: PropTypes.func,
  onExport: PropTypes.func,
};

AppHeader.defaultProps = {
  displayAvatar: true,
  displayLogo: true,
  displaySearch: false,
  titleSuffix: ' ',
};

export default AppHeader;
