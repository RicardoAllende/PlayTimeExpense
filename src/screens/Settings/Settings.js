import React, { Component } from 'react';
import { ImageBackground } from 'react-native';
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
  Thumbnail,
} from 'native-base';

import AppHeader from '@components/AppHeader';
import SwitchButton from '@components/SwitchButton';

import styles from './styles';

export default class Settings extends Component {
  state = {
    enableNotification: false,
  };

  render() {
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header2-bg.png')}
          style={styles.background}>
          <AppHeader navigation={this.props.navigation} title="Acerca de la aplicación" />
          <Content
            paddershowsVerticalScrollIndicator={false}
            style={styles.content}>
            <ListItem itemDivider>
              <Text>Ajustes de la aplicación</Text>
            </ListItem>
            <ListItem noIndent icon>
              <Left>
                <Button style={styles.settingBtn}>
                  <Icon active name="ios-notifications-outline" />
                </Button>
              </Left>
              <Body>
                <Text>Notificaciones</Text>
              </Body>
              <Right>
                <SwitchButton
                  onValueChange={value =>
                    this.setState({ enableNotification: value })
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
                <Text>USD($)</Text>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem noIndent icon>
              <Left>
                <Button style={styles.settingBtn}>
                  <Icon active name="ios-calendar-outline" />
                </Button>
              </Left>
              <Body>
                <Text>Time Period</Text>
              </Body>
              <Right>
                <Text>Week</Text>
                <Icon active name="ios-arrow-forward" />
              </Right>
            </ListItem>
            <ListItem noIndent icon>
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
            </ListItem>

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
                <Button style={{ backgroundColor: '#c9c9c9' }}>
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
                <Button style={{ backgroundColor: '#c9c9c9' }}>
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
