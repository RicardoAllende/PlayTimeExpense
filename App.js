import React from 'react';
import { Asset, AppLoading, Font } from 'expo';
import { Provider } from 'react-redux';
import { Root, StyleProvider } from 'native-base';

import configureStore from './src/store/configureStore';
import mmoneyTheme from './src/theme/variables/myexpense';
import getTheme from './src/theme/components';
import AppNavigation from './src/navigation';

const store = configureStore();
export default class App extends React.Component {
  state = {
    fontLoaded: false,
    isReady: false,
  };

  async componentDidMount() {
    this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      Roboto_light: require('./assets/fonts/Roboto-Light.ttf'),
      Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
      Feather: require('@expo/vector-icons/fonts/Feather.ttf'),
      'simple-line-icons': require('@expo/vector-icons/fonts/SimpleLineIcons.ttf'),
    });
    this.setState({ fontLoaded: true });
  }

  async cacheResourcesAsync() {
    const images = [
      require('./assets/images/splash.png'),
      require('./assets/images/logo.png'),
      require('./assets/images/background1.png'),
      require('./assets/images/background2.png'),
      require('./assets/images/header-bg.png'),
      require('./assets/images/header-bg-big.png'),
      require('./assets/images/header2-bg.png'),
      require('./assets/images/walkthrough1.png'),
      require('./assets/images/walkthrough2.png'),
      require('./assets/images/walkthrough3.png'),
    ];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isReady || !this.state.fontLoaded) {
      return (
        <AppLoading
          startAsync={this.cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
        />
      );
    }
    return (
      <StyleProvider style={getTheme(mmoneyTheme)}>
        <Provider store={store}>
          <Root>
            <AppNavigation />
          </Root>
        </Provider>
      </StyleProvider>
    );
  }
}
