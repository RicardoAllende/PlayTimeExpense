import React, { Component } from "react";

import { View, TouchableOpacity } from "react-native";

import { Thumbnail, Text } from "native-base";

import Modal from "react-native-modal";

import styles from './styles'

export default class ClientIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };
    }

    changeModalVisibility = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={this.changeModalVisibility}
                >
                    <Thumbnail
                        square
                        resizeMode="contain"
                        // circle={false}
                        // source={avatar}
                        // source={require('@assets/images/default_avatar.png')}
                        source={{
                             "height": 100,
                             "uri": "http://192.168.0.102:8000/storage/images/thumbnail/logo-subitus_1543624456.png",
                             "width": 100,
                        }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <Modal
                    isVisible={this.state.modal}
                    animationIn="slideInLeft"
                    animationOut="slideOutLeft"
                    animationInTiming={300}
                    animationOutTiming={300}
                    swipeDirection="down"
                    // style={styles.bottomModal}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            padding: 22,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4,
                            borderColor: "rgba(0, 0, 0, 0.1)",
                            flexDirection: "column"
                        }}
                    >
                        <Text>Información de la aplicación</Text>
                    </View>
                </Modal>
            </View>
        );
    }
}
