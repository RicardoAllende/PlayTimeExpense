import React, { Component } from "react";
import { ImageBackground } from "react-native";
import {
    Container,
    Content,
    ListItem,
    Text,
    Icon,
    Left,
    Body,
    Right,
    Button,
    Thumbnail
} from "native-base";

import { session, getBearerToken } from "./../../../api/session";
import { api, } from "./../../../api/playTimeApi";


import AppHeader from "@components/AppHeader";
import SwitchButton from "@components/SwitchButton";

import styles from "./styles";
// import { runInThisContext } from "vm";

export default class Settings extends Component {

    constructor(props){
        super(props)
        this.state = {
            enableNotification: false,
            enableSound: false,
            rememberMe: false,
            bearerTokenReady: false,
        }
    }

    loadSettings = () => {
        getBearerToken().then((bearerToken) => {
            this.setState({
                bearerToken,
                bearerTokenReady: true,
            })
        })
        session.getUserSettings().then(settings => {
            // console.log('Settings from asyncstorage', settings)
            this.setState({
                rememberMe: settings.rememberMe,
                enableSound: settings.enableSound,
                enableNotification: settings.enableNotification,
            }, () => { console.log('settings state', this.state) } )
        })
    }

    componentDidMount() {
        this.loadSettings()
    }

    changeSetting = (key, value) => {
        console.log('')
        console.log('')
        console.log('')
        uri = api.setSettings
        switch (key) {
            case 'enable_sound':
                settings = {
                    enable_sound: value,
                }
                this.setState({
                    enableSound: value
                })
                session.setEnableSound(value)
                break;
            case 'enable_notification':
                settings = {
                    enable_notification: value,
                }
                this.setState({
                    enableNotification: value
                })
                session.setEnableNotification(value)
                break;
            case 'remember_me':
                settings = {
                    remember_me: value,
                }
                this.setState({
                    rememberMe: value
                })
                session.setRememberMe(value)
                break;
        }
        settings = JSON.stringify(settings)
        const headers = {
            "Authorization": 'Bearer ' + this.state.bearerToken,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
        console.log('uri', uri)
        console.log('headers', headers)
        console.log('Body', settings)
        // return;
        fetch(api.setSettings, {
            method: 'POST',
            headers,
            body: settings
        }).then(
            response => {
                return response.json();
            }
        ).then(
            jsonResponse => {
                console.log('La respuesta desde el servidor es la siguiente', jsonResponse)
            }
        ).catch(error => {
            console.log("error", error)
        });
        // console.log(settings);
    };

    render() {
        return (
            <Container>
                <ImageBackground
                    source={{
                        uri:
                            "https://koenig-media.raywenderlich.com/uploads/2014/01/sunny-background.png",
                        cache: "only-if-cached"
                    }}
                    // source={require('@assets/images/header2-bg.png')}
                    style={styles.background}
                >
                    <AppHeader
                        navigation={this.props.navigation}
                        title="Acerca de la aplicación"
                    />
                    <Content
                        paddershowsVerticalScrollIndicator={false}
                        style={styles.content}
                    >
                        <ListItem itemDivider>
                            <Text>Ajustes de la aplicación</Text>
                        </ListItem>
                        <ListItem noIndent icon>
                            <Left>
                                <Button style={styles.settingBtn}>
                                    <Icon
                                        active
                                        name="ios-notifications-outline"
                                    />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Notificaciones</Text>
                            </Body>
                            <Right>
                                <SwitchButton
                                    onValueChange={value =>
                                        this.changeSetting('enable_notification', value)
                                    }
                                    value={this.state.enableNotification}
                                />
                            </Right>
                        </ListItem>
                        <ListItem noIndent icon>
                            <Left>
                                <Button style={styles.settingBtn}>
                                    <Icon active name="logo-usd" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Sonido</Text>
                            </Body>
                            <Right>
                                <SwitchButton
                                    onValueChange={value =>
                                        this.changeSetting('enable_sound', value)
                                    }
                                    value={this.state.enableSound}
                                />
                            </Right>
                        </ListItem>
                        <ListItem noIndent icon>
                            <Left>
                                <Button style={styles.settingBtn}>
                                    <Icon active name="ios-calendar-outline" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Recordar sesión</Text>
                            </Body>
                            <Right>
                                <SwitchButton
                                    onValueChange={value =>
                                        this.changeSetting('remember_me', value)
                                    }
                                    value={this.state.rememberMe}
                                />
                            </Right>
                        </ListItem>
                        {/* <ListItem noIndent icon>
                            <Left>
                                <Button style={styles.settingBtn}>
                                    <Icon active name="ios-finger-print" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Fingerprint lock</Text>
                            </Body>
                            <Right>
                                <Text>Enabled</Text>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem> */}

                        {/* <ListItem itemDivider>
              <Text>Accounts</Text>
            </ListItem>
            <ListItem icon>
              <Left>
                <Thumbnail source={avatar1} style={styles.avatar} />
              </Left>
              <Body>
                <Text>John</Text>
              </Body>
              <Right>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Thumbnail source={avatar2} style={styles.avatar} />
              </Left>
              <Body>
                <Text>Marry</Text>
              </Body>
              <Right>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </ListItem> */}

                        <ListItem itemDivider>
                            <Text>Acerca de la aplicación</Text>
                        </ListItem>
                        <ListItem noIndent icon>
                            <Left>
                                <Button style={{ backgroundColor: "#c9c9c9" }}>
                                    <Icon active name="ios-help" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>FAQ</Text>
                            </Body>
                            <Right>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem>
                        <ListItem noIndent icon>
                            <Left>
                                <Button style={{ backgroundColor: "#c9c9c9" }}>
                                    <Icon active name="ios-book-outline" />
                                </Button>
                            </Left>
                            <Body>
                                <Text>Legal</Text>
                            </Body>
                            <Right>
                                <Icon active name="ios-arrow-forward" />
                            </Right>
                        </ListItem>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}
