import React, { Component } from "react";

import { TouchableOpacity } from "react-native";

import styles from "./styles";
import { Thumbnail, Text } from "native-base";

import { session, getAvatar } from "../../../api/session";

export default class AppStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      avatarReady: false
    };
  }

  componentDidMount() {
    this.loadData();
    this.loadAvatar();
  }

  loadData = () => {
    session.getUserStats().then(userStats => {
      // console.log("userStats", userStats);
      this.setState(
        {
          dataReady: true,
          name: userStats.name,
          credits: userStats.credits
        },
        () => {
          // console.log("AppStatus data loaded", this.state);
        }
      );
    });
  };

  loadAvatar = () => {
    getAvatar(false).then(avatar => {
      this.setState({
        avatarReady: true,
        avatar
      });
    });
  };

  _onPress = () => {
    this.props.navigation.navigate('Profile');
    // console.log("Redireccionando a la pantalla");
  };

  render() {
    return (
      <TouchableOpacity
        style={{
          paddingTop: '3%',
          flex: 1,
          flexDirection: "row",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          borderRadius: 4,
          padding: "3%"
        }}
        onPress={this._onPress}
      >
        {this.state.avatarReady && (
          <Thumbnail
            // source={avatar}
            // source={require("@assets/images/default_avatar.png")}
            displayLogo={false}
            source={{
            //   uri: this.state.avatar,
                uri: 'http://192.168.0.102:8000/storage/default_images/logo-subitus.png',
              cache: 'only-if-cached',
            }}
            style={styles.avatar}
          />
        )}
        <Text
          style={[styles.titles.text, { fontSize: 10, textAlign: "center" }]}
        >
          {this.state.dataReady ? this.state.name : "."} {"\n"}
          {this.state.dataReady ? this.state.credits : "."} puntos 
        </Text>
      </TouchableOpacity>
    );
  }
}
