import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, ScrollView, TouchableOpacity, Linking, Alert, Image } from "react-native";
import theme from "@theme/variables/myexpense";
import { Container, Thumbnail, View, Text, Button, Fab, Icon, Avatar } from "native-base";
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
import { session, getBearerToken, getUserData, getAvatar, restartApp, setAvatar } from "./../../../api/session";

import ConfirmModal from '@components/Modals/ConfirmModal'

const avatar = require("@assets/images/default_avatar.png");
const defaultBackground = require("@assets/images/header-bg-big.png");
// import ImagePicker from 'react-native-image-picker';
import Expo, { ImagePicker, Permissions } from "expo";
// import FlashMessage, { showMessage } from "react-native-flash-message";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";

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
            userStatsReady: false,
            confirmModalVisibility: false,
        };
    }

    componentWillUnmount = () => {
        this.mounted = false;
    };

    index = 0

    showSimpleMessage = (message = "", description = "", type = "default", position = "top", props = {}) => {
        availablePositions = ['top', 'center', 'bottom']
        if(this.index == availablePositions.lenght){
            this.index = 0
        }
        position = availablePositions[this.index]
        this.index = this.index + 1
        console.log(this.index)
        console.log("La posición a mostrar es la siguiente", position)
        showMessage({
            message,
            description,
            position,
            type,
            ...props
        });
        console.log('Se mostró el mensaje')
    }

    loadUserData = async () => {
        getUserData().then(userData => {
            if (this.mounted) {
                this.setState(
                    {
                        profile: userData,
                        ready: true
                    },
                    () => {
                        this.loadOverview();
                    }
                );
            }
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
                if (!this.mounted) {
                    return false;
                }
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
        this.loadUserData();
        this.loadAvatar();
        this.mounted = true;
        this.checkPermission();
    }

    loadAvatar = () => {
        getAvatar().then(avatar => {
            if (!this.mounted) {
                return false;
            }
            this.setState({
                avatar,
                avatarReady: true
            });
        });
    };

    editImageIcon = () => {
        alert("Editando la imagen");
    };

    render() {
        const { navigation } = this.props;
        const { profile } = this.state;
        var backgroundSource;
        if (this.state.avatarReady) {
            // console.log('Profile render avatar is ready this.state', this.state)
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
                    blurRadius={5}
                    style={styles.container}
                >
                    <AppHeader hideStatus={true} displayAvatar={false} displayLogo={false} navigation={navigation} />
                    <View style={styles.profile.container}>
                        <TouchableOpacity onPress={this.onTapImage}>
                            {this.state.avatarReady && (
                                <ImageBackground
                                    source={{
                                        uri: this.state.avatar,
                                        cache: "only-if-cached"
                                    }}
                                    style={[styles.profile.avatar]}
                                    imageStyle={{ borderRadius: 50 }}
                                >
                                    <Icon
                                        type="MaterialIcons"
                                        style={{ alignSelf: "flex-end", bottom: 0, color: "white" }}
                                        name="edit"
                                    />
                                    {/* <Image source={logo} /> */}
                                </ImageBackground>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.profile.title}>
                            {this.state.ready ? profile.firstname + " " + profile.lastname : "_"}
                        </Text>
                        <Text style={[styles.profile.subTitle, { backgroundColor: "rgba(0, 0, 0, 0.3)" }]}>
                            {this.state.ready ? profile.username : "_"}
                        </Text>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.container}>
                            {this.state.overviewReady ? (
                                <Overview navigation={navigation} data={this.state.overview} />
                            ) : (
                                <Overview navigation={navigation} data={defaultOverview} />
                            )}
                            <View style={styles.separator} />
                            <Contact type="phone" name={"Mobile"} number={this.state.ready ? profile.mobile : "_"} />
                            <View style={styles.separator} />
                            <Contact type="phone" name={"Home"} number={this.state.ready ? profile.phone : "_"} />
                            <View style={styles.separator} />
                            <Contact type="email" name={"Personal"} number={this.state.ready ? profile.email : "_"} />
                            <View style={styles.separator} />
                            <Social />
                        </View>
                    </ScrollView>
                    <ConfirmModal
                        confirmText="Cambiar imagen"
                        message="¿Desea cambiar su imagen?"
                        onConfirm={this.showImagePicker}
                        cancelText="No ahora"
                        onCancel={this.hideConfirmModal}
                        isVisible={this.state.confirmModalVisibility}
                    />
                    <FlashMessage ref="myLocalFlashMessage" />
                </ImageBackground>
            </Container>
        );
    }

    hideConfirmModal = () => {
        this.setState({
            confirmModalVisibility: false,
        })
    }

    checkPermission = async () => {
        const { Permissions } = Expo;
        const permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
        // console.log('CAMERA_ROLL permission: ', permission)
        // if (status !== 'granted') {
        //   alert('No tiene permisos para mostrar imágenes');
        // }
    };

    askForPermission = async () => {
        const { Permissions } = Expo;
        const { status, expires, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        console.log("askForPermission", status);
        if (status !== "granted") {
            //   alert('No se condedió el permiso para acceder a la galería de fotos');
            return false;
        } else {
            return true;
        }
    };

    onTapImage = () => {
        this.setState({
            confirmModalVisibility: true,
        })
        return
        // this.showSimpleMessage('Imagen actualizada', 'La imagen de su perfil ha sido actualizada', 'success', 'bottom')
        // return
        Alert.alert(
            "¿Desea Cambiar su imagen?",
            // '¿Desea cambiar su imagen?',
            "",
            [
                // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {
                    text: "No ahora",
                    onPress: () => {
                        console.log('Cancel pressed')
                    },
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
        let permission = await this.askForPermission();
        if (!permission) {
            alert("No se tiene permiso para acceder a la galería de imágenes");
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });
        if (result.cancelled) {
            // this.showSimpleMessage('Imagen actualizada', 'La imagen de su perfil ha sido actualizada', 'success', 'bottom')
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
                    // this.forceUpdate()
                    // this.props.navigation.navigate('Walkthrough', { restart: true })
                }
                this.showSimpleMessage('Imagen actualizada', 'La imagen de su perfil ha sido actualizada', 'success', 'bottom')
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
