import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Image, ImageBackground, StatusBar } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import {
  Container,
  Text,
  Button,
  View,
  Spinner,
  Content,
  Form,
  Footer,
} from 'native-base';
import LoginInput from '@components/LoginInput';
import Notification from '@components/Notification';

import {
  required,
  alphaNumeric,
  minLength7,
  maxLength15,
} from '@utils/validation';

import { doLogin } from './behaviors';
import * as loginSelectors from './selectors';
import styles from './styles';

const FORM_NAME = 'signin';

class SignIn extends Component {
  static propTypes = {
    loginStarted: PropTypes.bool,
    loginSuccess: PropTypes.bool,
    loginError: PropTypes.bool,
    doLogin: PropTypes.func.isRequired,
    navigation: PropTypes.shape({ dispatch: PropTypes.func.isRequired }),
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    loginStarted: false,
    loginSuccess: false,
    loginError: false,
  };

  handleSubmit = values => {
    this.props.doLogin(values.username, values.password, () => {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Walkthrough' })],
        })
      );
    });
  };

  render() {
    const { navigation, handleSubmit, loginStarted, loginError } = this.props;
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={'transparent'}
        />
        <ImageBackground
          source={require('@assets/images/background1.png')}
          style={styles.background}>
          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={styles.header.wrapper}>
                <Image
                  source={require('@assets/images/logo.png')}
                  style={styles.header.logo}
                />
                {loginError && (
                  <Notification
                    message="Invalid username or password!"
                    buttonText="Retry"
                    duration={5000}
                    position="top"
                    type="danger"
                  />
                )}
              </View>
              <Form>
                <Field
                  name="username"
                  component={LoginInput}
                  type="username"
                  placeholder="Username"
                  icon="ios-person-outline"
                  validate={[required, alphaNumeric, maxLength15]}
                />
                <Field
                  name="password"
                  component={LoginInput}
                  type="password"
                  placeholder="Password"
                  icon="ios-lock-outline"
                  secureTextEntry={true}
                  validate={[required, alphaNumeric, minLength7, maxLength15]}
                />
                <Button
                  small
                  transparent
                  style={{ alignSelf: 'flex-end' }}
                  onPress={() => navigation.navigate('ResetPassword')}>
                  <Text style={styles.resetPwdBtn}>Forgot Password</Text>
                </Button>
              </Form>
            </View>
          </Content>
          <Footer style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Button
                large
                primary
                block
                full
                onPress={handleSubmit(this.handleSubmit)}>
                {loginStarted ? <Spinner color="#fff" /> : <Text>Sign In</Text>}
              </Button>
              <Button
                transparent
                full
                onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.signup.linkText}>
                  Don’t have an account?
                </Text>
                <Text style={styles.signup.linkBtn}>Sign Up</Text>
              </Button>
            </View>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

export const SignInForm = reduxForm({
  form: FORM_NAME,
})(SignIn);

const mapStateToProps = state => ({
  loginStarted: loginSelectors.isLoginStarted(state),
  loginSuccess: loginSelectors.isLoginSuccess(state),
  loginError: loginSelectors.isLoginError(state),
});

export default connect(
  mapStateToProps,
  { doLogin }
)(SignInForm);
