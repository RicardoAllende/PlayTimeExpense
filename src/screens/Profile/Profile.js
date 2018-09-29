import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, ScrollView } from 'react-native';
import { Container, Thumbnail, View, Text } from 'native-base';
import { connect } from 'react-redux';

import AppHeader from '@components/AppHeader';
import Contact from './Contact';
import Overview from './Overview';
import Social from './Social';
import * as profileSelectors from './selectors';
import styles from './styles';

const avatar = require('@assets/images/avatar1.png');

class Profile extends Component {
  static propTypes = {
    navigation: PropTypes.any,
    profile: PropTypes.object,
  };

  render() {
    const { navigation, profile } = this.props;
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
            <Thumbnail source={avatar} style={styles.profile.avatar} />
            <Text style={styles.profile.title}>
              {profile.firstname + ' ' + profile.lastname}
            </Text>
            <Text style={styles.profile.subTitle}>{profile.username}</Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.container}>
              <Overview navigation={navigation} />
              <View style={styles.separator} />
              <Contact type="phone" name={'Mobile'} number={profile.mobile} />
              <View style={styles.separator} />
              <Contact type="phone" name={'Home'} number={profile.phone} />
              <View style={styles.separator} />
              <Contact type="email" name={'Personal'} number={profile.email} />
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
