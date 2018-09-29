import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Container, Content, Text, Button, Card, Footer } from 'native-base';
import Carousel from 'react-native-snap-carousel';

import { entries } from './config';

import styles from './styles';

const deviceWidth = Dimensions.get('window').width;

class Walkthrough extends Component {
  constructor(props) {
    super(props);
    this.renderSlide = this.renderSlide.bind(this);
  }

  renderSlide({ item, index }) {
    return (
      <Card style={styles.slide.container}>
        <View>
          <Image source={item.illustration} style={styles.slide.illustration} />
          <Text style={styles.slide.title}>{item.title}</Text>
          <Text numberOfLines={4} style={styles.slide.subtitle}>
            {item.subtitle}
          </Text>
          {index < 2 ? (
            <Button
              transparent
              onPress={() => this.carousel.snapToNext()}
              style={styles.slide.btnWrapper}>
              <Text style={styles.slide.btnText}>Next</Text>
            </Button>
          ) : (
            <Button
              transparent
              onPress={() => this.carousel.snapToPrev()}
              style={styles.slide.btnWrapper}>
              <Text style={styles.slide.btnText}>Previous</Text>
            </Button>
          )}
        </View>
      </Card>
    );
  }

  render() {
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={'transparent'}
        />
        <ImageBackground
          source={require('@assets/images/background2.png')}
          style={styles.background}>
          <Content>
            <Carousel
              ref={c => (this.carousel = c)}
              data={entries}
              renderItem={this.renderSlide}
              sliderWidth={deviceWidth}
              itemWidth={deviceWidth - 50}
              hasParallaxImages={true}
              containerCustomStyle={styles.slider}
            />
          </Content>
          <Footer>
            <Button
              large
              primary
              block
              style={styles.skipBtn}
              onPress={() => this.props.navigation.navigate('Drawer')}>
              <Text> Get Started </Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

export default Walkthrough;
