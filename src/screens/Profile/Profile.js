import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Container, Thumbnail, View, Text } from 'native-base';
import { connect } from 'react-redux';

import AppHeader from '@components/AppHeader';
import Contact from './Contact';
import Overview from './Overview';
import Social from './Social';
import * as profileSelectors from './selectors';
import styles from './styles';

import {api} from './../../../api/playTimeApi'
import {session, getBearerToken, getUserData, getAvatar} from './../../../api/session'

const avatar = require('@assets/images/default_avatar.png');

class Profile extends Component {
  constructor(props){
    super(props)
    this.state = {
      ready: false,
      overview: [],
      overviewReady: false,
      avatarReady: false,
    }
  }

  loadUserData = async () => {
    getUserData().then((userData) => {
      this.setState({
        profile: userData,
        ready: true,
      },  () => {
        this.loadOverview()
      } )
    });
  }

  loadOverview = async () => {
    url = api.getOverview;
    fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": 'Bearer ' + this.state.profile.bearerToken,
        Accept: 'application/json',
        "Content-Type": "application/json"
      }
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // console.log(jsonResponse)
        // return
        // console.log(jsonResponse)
        // console.log('profile.js loadOverview', jsonResponse)


        this.setState({
          overview: jsonResponse.data.overview, 
          overviewReady: true
        },
          () => {
            console.log('CoursCharts Carga de elementos terminada', this.state)
          }
        )
      }
      ).catch((error) => { console.error(error); })
  }

  componentDidMount(){
    // this.loadOverview();
    this.loadUserData();
    this.loadAvatar();
  }

  loadAvatar = () => {
    // import {getAvatar} from '../../../api/session'
    getAvatar().then((avatar) => {
      this.setState({
        avatar,
        avatarReady: true,
      })
    });
  }


  render() {
    const { navigation } = this.props;
    const { profile } = this.state;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg-big.png')}
          style={styles.container}>
          <AppHeader
            displayAvatar={false}
            displayLogo={false}
            navigation={navigation}
          />
          <View style={styles.profile.container}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(api.loginWithRememberToken(this.state.profile.access))
                // alert(this.state.profile.access)
                // Linking.openURL('');
              }}
            >
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
                    style={styles.profile.avatar} />
                  )
                }
            </TouchableOpacity>
            <Text style={styles.profile.title}>
              { (this.state.ready) ? profile.firstname + ' ' + profile.lastname : "_" }
            </Text>
            <Text style={styles.profile.subTitle}>{ (this.state.ready) ? profile.username : '_'}</Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.container}>
                {
                  this.state.overviewReady &&
                  (
                    <Overview navigation={navigation} data={this.state.overview} />
                  )
                }
              <View style={styles.separator} />
              <Contact type="phone" name={'Mobile'} number={ (this.state.ready) ? profile.mobile :  '_'} />
              <View style={styles.separator} />
              <Contact type="phone" name={'Home'} number={ (this.state.ready) ? profile.phone : '_'} />
              <View style={styles.separator} />
              <Contact type="email" name={'Personal'} number={ (this.state.ready) ? profile.email : '_'} />
              <View style={styles.separator} />
              <Social />
            </View>
          </ScrollView>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  profile: profileSelectors.getUserProfile(state),
});

export default connect(mapStateToProps)(Profile);
