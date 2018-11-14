import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert, 
  Image
} from "react-native";
import theme from '@theme/variables/myexpense';
import { Container, Thumbnail, View, Text, Button, Fab, Icon } from "native-base";
import { connect } from "react-redux";
import FormData from "form-data";

import AppHeader from "@components/AppHeader";
import Contact from "./Contact";
import Overview from "./Overview";
import Social from "./Social";
import * as profileSelectors from "./selectors";
import styles from "./styles";
import { getExtension } from "@utils/helpers";

import { api } from "./../../../api/playTimeApi";
import {
  session,
  getBearerToken,
  getUserData,
  getAvatar,
  restartApp,
  setAvatar
} from "./../../../api/session";

const avatar = require("@assets/images/default_avatar.png");
const defaultBackground = require("@assets/images/header-bg-big.png");
// import ImagePicker from 'react-native-image-picker';
import { ImagePicker } from "expo";

const defaultOverview = {
  num_achievements: 0,
  num_completed_courses: 0,
  num_enrolled_courses: 0
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      overview: [],
      overviewReady: false,
      avatarReady: false,
      img: "http://www.safexone.com/images/old/default.gif"
    };
  }

  loadUserData = async () => {
    getUserData().then(userData => {
      this.setState(
        {
          profile: userData,
          ready: true
        },
        () => {
          this.loadOverview();
        }
      );
    });
  };

  loadOverview = async () => {
    url = api.getOverview;
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.state.profile.bearerToken,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(jsonResponse => {
        // console.log(jsonResponse)
        // return
        // console.log(jsonResponse)
        // console.log('profile.js loadOverview', jsonResponse)

        this.setState(
          {
            overview: jsonResponse.data.overview,
            overviewReady: true
          },
          () => {
            // console.log(this.state.overview);
            // console.log('CoursCharts Carga de elementos terminada', this.state)
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  };

  componentDidMount() {
    // this.loadOverview();
    this.loadUserData();
    this.loadAvatar();
  }

  loadAvatar = () => {
    getAvatar().then(avatar => {
      this.setState({
        avatar,
        avatarReady: true
      });
    });
  };

  editImageIcon = () => {
    alert('Editando la imagen')
  }

  render() {
    const { navigation } = this.props;
    const { profile } = this.state;
    var backgroundSource;
    if (this.state.avatarReady) {
      backgroundSource = {
        uri: this.state.avatar,
        cache: "only-if-cached"
      };
    } else {
      backgroundSource = defaultBackground;
    }
    return (
      <Container>
        <ImageBackground
          // source={require('@assets/images/header-bg-big.png')}
          source={backgroundSource}
          style={styles.container}
        >
          <AppHeader
            displayAvatar={false}
            displayLogo={false}
            navigation={navigation}
          />
          <View style={styles.profile.container}>
            <TouchableOpacity onPress={this.onTapImage}>
              {
                this.state.avatarReady &&
                (
                  <ImageBackground
                    // source={avatar} 
                    // source={require('@assets/images/default_avatar.png')}
                    source={{
                      uri: this.state.avatar,
                      cache: 'only-if-cached',
                    }}
                    style={styles.profile.avatar} >
                    <Icon type="MaterialIcons" style={{alignSelf: 'flex-end' }} name="edit" />
                    {/* <Image source={logo} /> */}
                  </ImageBackground>
                )
              }
            </TouchableOpacity>
            <Text style={styles.profile.title}>
              {this.state.ready
                ? profile.firstname + " " + profile.lastname
                : "_"}
            </Text>
            <Text style={styles.profile.subTitle}>
              {this.state.ready ? profile.username : "_"}
            </Text>
          </View>

          <Fab
            direction="up"
            containerStyle={{}}
            // style={{ backgroundColor: theme.brandPrimary }}
            style={{ backgroundColor:theme.brandInfo }}
            // style={{ backgroundColor: 'blue' }}
            position="topRight"
            onPress={
              this.editImageIcon
            }
          >
            <Icon type="MaterialIcons" name="edit" />
          </Fab>

          <ScrollView style={styles.content}>
            <View style={styles.container}>
              {this.state.overviewReady ? (
                <Overview navigation={navigation} data={this.state.overview} />
              ) : (
                <Overview navigation={navigation} data={defaultOverview} />
              )}
              <View style={styles.separator} />
              <Contact
                type="phone"
                name={"Mobile"}
                number={this.state.ready ? profile.mobile : "_"}
              />
              <View style={styles.separator} />
              <Contact
                type="phone"
                name={"Home"}
                number={this.state.ready ? profile.phone : "_"}
              />
              <View style={styles.separator} />
              <Contact
                type="email"
                name={"Personal"}
                number={this.state.ready ? profile.email : "_"}
              />
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
      "¿Desea Cambiar su imagen?",
      // '¿Desea cambiar su imagen?',
      "",
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        {
          text: "No ahora",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Sí",
          onPress: () => {
            this.showImagePicker();
          }
        }
      ],
      { cancelable: false }
    );
  };

  showImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3]
    });
    if (result.cancelled) {
      return false;
    }
    console.log(result);
    extension = getExtension(result.uri);

    formData = new FormData();
    formData.append("file", {
      uri: result.uri,
      type: "image/*",
      name: "profile." + extension
    });
    console.log(formData);

    fetch(api.setAvatar, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + this.state.profile.bearerToken,
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
      .then(response => {
        return response.json();
        console.log("Retro");
      })
      .then(jsonResponse => {
        if (jsonResponse.response.status == "error") {
          this.imageUploadError();
        }
        if (jsonResponse.response.status == "ok") {
          session.setAvatar(jsonResponse.data.avatar);
          this.loadAvatar();
        }
        console.log("Su imagen ha sido actualizada");
      })
      .catch(error => {
        this.imageUploadError();
        console.log("error Profile", error);
      });
  };

  imageUploadError = () => {
    alert("Su imagen no pudo ser actualizada");
  };
}

export default Profile;
