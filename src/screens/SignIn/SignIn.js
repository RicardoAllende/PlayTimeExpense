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

import {api} from './../../../api/playTimeApi'
import {session} from './../../../api/session'
import { AsyncStorage } from "react-native"

import {
  required,
  alphaNumeric,
  minLength7,
  maxLength15,
  email
} from '@utils/validation';

import { doLogin, doLoginByToken } from './behaviors';
import * as loginSelectors from './selectors';
import styles from './styles';

const FORM_NAME = 'signin';

class SignIn extends Component {

  constructor(props){
    super(props)
  }

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
    // console.log("El nombre de usuario es: " + values.username," || mientras que la contraseña es: " + values.password)
    // this.redirectToApp(values);
    // return;
    this.props.doLogin(values.username, values.password, this.onLoginSuccess);
  };

  checkSession = async() => {
    try {
      value = await AsyncStorage.getItem('bearerToken')
      if(value !== null){
        fetch(api.auth, { 
            method: 'GET', 
            headers: {
                "Authorization": 'Bearer ' + value ,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }, 
            // body: credentials
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
          if(jsonResponse.message != 'Unauthenticated.'){
            session.setBearerToken(value);
            session.setUserData(jsonResponse.data)
            // console.log('Se recuperó la sesión');
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Walkthrough'})],
              })
            );
            return
            this.props.doLoginByToken(jsonResponse.data, this.onLoginSuccess);
          }else{
            session.unsetBearerToken();
            session.unsetUserData();
            // console.log("El bearer token no pudo iniciar la sesión");
          }
        }
        ).catch((error) => {
            console.error(error);
        })
        // alert(bearerToken)
        // console.warn('Bearer Token encontrado');
      }else{
        // console.warn('No se encontró bearer token');
      }
    } catch (error) {
      console.warn('Error al intentar obtener respuesta');
    }
  }

  onLoginSuccess = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Walkthrough'})],
      })
    );
  }

  saveBearerToken = () => {
    session.setBearerToken('Token de prueba');
    // AsyncStorage.setItem('bearerToken', bearerToken);
    // alert('Se guardó variable en async');
  }

  removeBearerToken = () => {
    AsyncStorage.removeItem('bearerToken');
  }

  verifySession = false

  render() {
    // console.log(this.props)
    // this.checkSession()
    if( ! this.verifySession ){
      this.checkSession();
      this.verifySession = true;
      // return (<Text>Cargando</Text>)
    }
    const { navigation, handleSubmit, loginStarted, loginError } = this.props;
    return (
      <Container>
        <StatusBar
          barStyle="light-content"
          translucent={true}
          backgroundColor={'transparent'}
        />
        <ImageBackground
          source={{ uri: 'https://koenig-media.raywenderlich.com/uploads/2014/01/sunny-background.png', cache: 'only-if-cached', }}
          // source={require('@assets/images/background1.png')}
          style={styles.background}>
          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              <View style={styles.header.wrapper}>
                {/* <Image
                  // source={require('@assets/images/logo-subitus.png')}
                source={{uri: 'http://bizzcode.com/img/react.png', width: 100, height: 100}}
                  // style={styles.header.logo}
                  // style={{
                  //   width: '100'
                  // }}
                /> */}
                <Image
                  // source={require('@assets/images/logo-subitus.png')}
                  source={{uri: 'http://bizzcode.com/img/react.png'}}
                  style={[styles.header.logo,{width: 200, height: 200}]}
                />
                {loginError && (
                  <Notification
                    message="Verifique email o contraseña"
                    buttonText="Intentar de nuevo"
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
                  placeholder="Nombre de usuario"
                  icon="ios-person-outline"
                  validate={[required, email]}
                />
                <Field
                  name="password"
                  component={LoginInput}
                  type="password"
                  placeholder="Contraseña"
                  icon="ios-lock-outline"
                  secureTextEntry={true}
                  validate={[required]}
                />
                {/* <Button
                  small
                  transparent
                  style={{ alignSelf: 'flex-end' }}
                  onPress={() => navigation.navigate('ResetPassword')}
                  // onPress={this.checkSession}
                  >
                  <Text style={styles.resetPwdBtn}>¿Olvidaste tu contraseña?</Text>
                </Button> */}
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
                {loginStarted ? <Spinner color="#fff" /> : <Text>Ingresar</Text>}
              </Button>
              {/* <Button
                transparent
                full
                onPress={() => navigation.navigate('SignUp')}
                // onPress={this.saveBearerToken}
                >
                <Text style={styles.signup.linkText}>
                  ¿Aún no tiene cuenta?
                </Text>
                <Text style={styles.signup.linkBtn}>Registro</Text>
              </Button> */}
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
  { doLogin, doLoginByToken },
)(SignInForm);
