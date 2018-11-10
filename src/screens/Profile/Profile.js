import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Container, Thumbnail, View, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import FormData from 'form-data'

import AppHeader from '@components/AppHeader';
import Contact from './Contact';
import Overview from './Overview';
import Social from './Social';
import * as profileSelectors from './selectors';
import styles from './styles';

import { api } from './../../../api/playTimeApi'
import { session, getBearerToken, getUserData, getAvatar, restartApp } from './../../../api/session'

const avatar = require('@assets/images/default_avatar.png');

// import ImagePicker from 'react-native-image-picker';
import { ImagePicker } from 'expo';

const defaultOverview = {
  num_achievements: 0,
  num_completed_courses: 0,
  num_enrolled_courses: 0,
}

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      overview: [],
      overviewReady: false,
      avatarReady: false,
      img: 'http://www.safexone.com/images/old/default.gif',
    }
  }

  loadUserData = async () => {
    getUserData().then((userData) => {
      this.setState({
        profile: userData,
        ready: true,
      }, () => {
        this.loadOverview()
      })
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
            console.log(this.state.overview)
            // console.log('CoursCharts Carga de elementos terminada', this.state)
          }
        )
      }
      ).catch((error) => { console.error(error); })
  }

  componentDidMount() {
    // this.loadOverview();
    this.loadUserData();
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
              onPress={this.onTapImage}
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
              {(this.state.ready) ? profile.firstname + ' ' + profile.lastname : "_"}
            </Text>
            <Text style={styles.profile.subTitle}>{(this.state.ready) ? profile.username : '_'}</Text>
          </View>
          <ScrollView style={styles.content}>
            <View style={styles.container}>
              {
                this.state.overviewReady ?
                  (<Overview navigation={navigation} data={this.state.overview} />)
                :
                  (<Overview navigation={navigation} data={defaultOverview} />)
              }
              <View style={styles.separator} />
              <Contact type="phone" name={'Mobile'} number={(this.state.ready) ? profile.mobile : '_'} />
              <View style={styles.separator} />
              <Contact type="phone" name={'Home'} number={(this.state.ready) ? profile.phone : '_'} />
              <View style={styles.separator} />
              <Contact type="email" name={'Personal'} number={(this.state.ready) ? profile.email : '_'} />
              <View style={styles.separator} />
              {/* <Thumbnail source={{ uri: this.state.img }} /> */}
              <Social />
            </View>
          </ScrollView>
        </ImageBackground>
      </Container>
    );
  }

  onTapImage = () => {
    Alert.alert(
      '¿Desea Cambiar su imagen?',
      // '¿Desea cambiar su imagen?',
      '',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {text: 'No ahora', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Sí', onPress: () => {this.showImagePicker()}},
      ],
      { cancelable: false }
    )
  }

  showImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    if(result.cancelled){
      return false;
    }
    console.log(result)
    // return true;

    // console.log(result);
    // this.setState({
    //   img: result.uri
    // }, () => {
      formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        type: 'image/*',
        name: 'profile'
      });
      console.log(formData)
      // return true
  
      url = api.setAvatar;
      fetch(api.setAvatar, {
        method: 'POST',
        headers: {
          "Authorization": 'Bearer ' + this.state.profile.bearerToken,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      }).then(
        response => {
          return response.json();
          console.log("Retro")
        }
      ).then(
        jsonResponse => {
          console.log('Satisfactorio', jsonResponse);
          alert('Terminó la función');
          if(jsonResponse.response.status == 'error'){
            alert('Imagen no actulizada por tamaño del archivo');
          }
          if(jsonResponse.response.status == 'ok'){
            // alert('La imagen se ha actualizado con la siguiente ruta: ' + jsonResponse.data.url);
            session.setAvatar(jsonResponse.data.url);
            restartApp()
            this.props.navigation.navigate('Walkthrough', {
              reload: true,
            });
          }
          // alert('Su imagen ha sido actualizada');
          console.log('Su imagen ha sido actualizada')
        } 
      ).catch(error => {
        console.log("error Profile", error)
      });
    // })
  }

}

const mapStateToProps = state => ({
  profile: profileSelectors.getUserProfile(state),
});

export default connect(mapStateToProps)(Profile);
