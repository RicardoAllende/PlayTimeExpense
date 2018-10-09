import React, { PureComponent } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import {
  View, Text, Icon, Left, Right, Thumbnail, Body, Button, Header,
} from 'native-base';

import HeaderDrawerButton from './HeaderDrawerButton';
import SearchHeader from './SearchHeader';

const logo = require('@assets/images/header-logo.png');
const avatar = require('@assets/images/avatar1.png');
import styles from './styles';
import CountdownCircle from 'react-native-countdown-circle'

class AppHeader extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      displaySearchBar: false,
      seconds: this.props.seconds,
      questionId: this.props.questionId
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

  render() {
    let navLogo;
    // console.log('AppHeader.js', 'courseId', this.props.courseId)
    if(this.props.timer){ // Timer exists
      if(this.props.timerVisibility){
        // console.log('Número de segundos obtenidos en Appheader desde state', this.state.seconds)
        navLogo = <CountdownCircle
          seconds={this.state.seconds}
          radius={25}
          borderWidth={8}
          color="#ff003f"
          bgColor="#fff"
          textStyle={{ fontSize: 20 }}
          onTimeElapsed={this.restartCountDown}
        />
      }
    }else{
      if(this.props.displayLogo){
        navLogo = <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Expenses');
          }}>
          <Image source={logo} style={styles.logo} />
        </TouchableOpacity>
      }
    }
    return (
      <View style={this.props.style}>
        <Header transparent hasTabs>
          <Left style={{ flex: 1 }}>
            <HeaderDrawerButton navigation={this.props.navigation} />
          </Left>
          <Body style={{ flex: 1, alignItems: 'center' }}>
            { navLogo }
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
