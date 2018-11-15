import React, { Component } from 'react';
import { FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import { DrawerActions } from 'react-navigation';
import {
  Container,
  Content,
  Icon,
  Thumbnail,
  Button,
  Header,
  Left,
  Right,
} from 'native-base';
import MenuItem from './MenuItem';
import styles from './styles';
import { routes } from './config';

import { session, getAvatar } from '../../../api/session'

class SideBar extends Component {
  state = {
    selected: '',
    ready: false,
    avatarReady: false,
  };
  onPressItem = route => {
    if(route == 'SignIn'){
      session.unsetBearerToken()
    }
    this.setState(() => ({
      selected: route,
    }));
    this.props.navigation.navigate(route);
  };
  renderMenuItem = ({ item }) => (
    <MenuItem
      id={item.route}
      onPressItem={this.onPressItem}
      selected={this.state.selected === item.route}
      title={item.title}
      icon={item.icon}
    />
  );

  componentDidMount = () => {
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
    console.log('Sidebar.js')
    const navigation = this.props.navigation;
    return (
      <Container style={{ backgroundColor: 'transparent' }}>
        <Header transparent style={styles.header.container}>
          <Left style={{ flex: 1 }}>
            <Button
              transparent
              onPress={() =>
                navigation.dispatch(DrawerActions.toggleDrawer({}))
              }>
              <Icon
                type="SimpleLineIcons"
                name="arrow-left"
                style={styles.header.icon}
              />
            </Button>
          </Left>
          <Right>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end' }}
              onPress={() => {
                navigation.navigate('Profile');
              }}>
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
                  style={styles.avatar} />
                )
              }
            </TouchableOpacity>
          </Right>
        </Header>
        <Content style={styles.content}>
          <FlatList
            initialNumToRender={8}
            data={routes}
            renderItem={this.renderMenuItem}
            keyExtractor={item => item.route}
          />
        </Content>
      </Container>
    );
  }
}
export default SideBar;
