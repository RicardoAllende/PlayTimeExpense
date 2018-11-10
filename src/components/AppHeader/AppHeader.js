import React, { PureComponent } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import {
  View, Text, Icon, Left, Right, Thumbnail, Body, Button, Header,
} from 'native-base';

import HeaderDrawerButton from './HeaderDrawerButton';
import SearchHeader from './SearchHeader';

import {getAvatar} from '../../../api/session'
import styles from './styles';
import CountdownCircle from 'react-native-countdown-circle'

class AppHeader extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      displaySearchBar: false,
      seconds: this.props.seconds,
      questionId: this.props.questionId,
      avatarReady: false,
    };
  }

  restartCountDown = () => {
    this.props._handleNextAnswer()
    this.setState({seconds: 0}, () => { 
      this.setState({seconds: this.props.seconds});
      console.log('Segundos establecidos en', this.state.seconds) 
    })
  }

  _onTimeElapsed = () => {
    this.props._handleNextAnswer();
    this.restartCountDown();
  }

  componentDidMount = () => {
    this.loadAvatar();
  }

  loadAvatar = () => {
    getAvatar().then((avatar) => {
      this.setState({
        avatar,
        avatarReady: true,
      })
    });
  }

  render() {
    return (
      <View style={this.props.style}>
        <Header transparent hasTabs>
          <Left style={{ flex: 1 }}>
            <HeaderDrawerButton navigation={this.props.navigation} />
          </Left>
          <Body style={{ flex: 1, alignItems: 'center' }}>
            {/* {this.props.displayLogo && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Expenses');
                }}>
                <Image source={logo} style={styles.logo} />
              </TouchableOpacity>
            )} */}
          </Body>
          <Right style={{ flex: 1 }}>
            {/* {this.props.displayAvatar && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Profile');
                }}>
                {
                  this.state.avatarReady &&
                  (
                    <Thumbnail 
                    // source={avatar} 
                    // source={require('@assets/images/default_avatar.png')}
                    source={{
                      uri: this.state.avatar,
                      cache: 'only-if-cached',
                    }}
                    style={styles.avatar} />
                  )
                }
              </TouchableOpacity>
            )} */}
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
