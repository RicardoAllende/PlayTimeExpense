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
import { AsyncStorage } from "react-native"

const bearerToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjYwM2ExYzE4NzE0OTFjNzA5OTM2MWMyZGY1NTgzYWRmMTBiZDE0Yzk3YTNiNTdkYjdjY2M3ZmM4NmRjYjAxY2U5NDg0ZDk4MjlmYjhhN2FlIn0.eyJhdWQiOiIxIiwianRpIjoiNjAzYTFjMTg3MTQ5MWM3MDk5MzYxYzJkZjU1ODNhZGYxMGJkMTRjOTdhM2I1N2RiN2NjYzdmYzg2ZGNiMDFjZTk0ODRkOTgyOWZiOGE3YWUiLCJpYXQiOjE1MzgzMjY0NjAsIm5iZiI6MTUzODMyNjQ2MCwiZXhwIjoxNTY5ODYyNDYwLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.QzXpwRyJHRgpvjSivc6T7D9i1XRWSIms80lZlVlsapOzFlwt234qXy75raMzNvJKq4cEnKM_mvEkwRyC9fruP-BEwSAjelvEsPjpq2qBNPUaA_0h9RbLmidynjmNtYNn_m18vz7uF-NQ-XF53jM1FO9o5_eUMUKjZsAM8pP3ztf1UM9PVtMKhltLAv6tbq0_8wWjtCEvZanuEhfA9HlHOB7_08DSsA74qJ4mwFrUy-zRhf0VISE_T-R6WAPNuBRXv5aDvLWMWbcYwi083XgWuH1p36oAwls37Vt3-dG5lVUR1yrwdvF5TEdg1JVysfnXibYbzMCisRGoVNbfd95aGgzHWhyoFg0lOGnfZKc0fxyb3JP6wG8PW1cVFnabVO8pPVoPKwcf5NGl7P9dprGhJ7Tj1L3oioC71DChWrudXlm4Kp4Yu2S6P9ZsjL02ozQxh7pxCleDdGlvRmz2SCVAmQMX3mqpUEG1zN9EFJg8qnY__JRg5IgrYxixb1cTe2RUmKmQEF0BTHhItJbffTsem5EfKh1XgwrHp8WL5dlBSoIDvf7uBqFsrsUGtmLUdfC4SrMEGM2AZSdBHxDB1VwU5GUUabOaTWBLvHxtkNrBCqD-PrLAwmkeMf1owPmHyKfel6LNW1TtjkK-gD2E7bvEyxyYa2N7Wm1ZvjYciqFXZNQ";

import {
  required,
  alphaNumeric,
  minLength7,
  maxLength15,
  email
} from '@utils/validation';

import { doLogin } from './behaviors';
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
    this.props.doLogin(values.username, values.password, (userData) => {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Walkthrough', params: { userData } })],
        })
      );
    });
  };

  redirectToApp = (values) => {
    credentials = JSON.stringify({
        email: values.username,
        password: values.password
    })
    fetch(api.auth, { 
        method: 'POST', 
        headers: {
        // "Authorization": 'Bearer ' + bearerToken ,
            Accept: 'application/json',
            "Content-Type": "application/json"
        }, 
        body: credentials
    })
    .then((response) => response.json())
    .then((response) => this.setState( { result: response }, 
        () => {
          console.log(this.state.result)
            // jsonResult = this.state.result
            // // console.log(jsonResult)
            // if(jsonResult.response.status == 'ok'){
            //     this.props.iniciarSesion(true, jsonResult.data.access_token, jsonResult.data.settings)
            // }else{
            //     this.props.iniciarSesion(false, '', [])
            // }
        })
    ).catch((error) => {
        console.error(error);
    })
  }

  checkSession = async() => {
    console.log('Mostrando elementos')
    try {
      value = await AsyncStorage.getItem('bearerToken')
      if(value !== null){
        fetch(api.checkUser, { 
            method: 'GET', 
            headers: {
            // "Authorization": 'Bearer ' + bearerToken ,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }, 
            // body: credentials
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
          if(json.response.status == 'ok'){
            
          }
        }
        ).catch((error) => {
            console.error(error);
        })
        alert(bearerToken)
        // console.warn('Bearer Token encontrado');
      }else{
        alert('No se encontró variable')
        // console.warn('No se encontró bearer token');
      }
    } catch (error) {
      console.warn('Error al intentar obtener respuesta');
    }
  }

  saveBearerToken = () => {
    AsyncStorage.setItem('bearerToken', bearerToken);
    alert('Se guardó variable en async');
  }

  removeBearerToken = () => {
    AsyncStorage.removeItem('bearerToken');
  }

  render() {
    // this.checkSession()
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
                <Button
                  small
                  transparent
                  style={{ alignSelf: 'flex-end' }}
                  // onPress={() => navigation.navigate('ResetPassword')}
                  onPress={this.checkSession}
                  >
                  <Text style={styles.resetPwdBtn}>¿Olvidaste tu contraseña?</Text>
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
                {loginStarted ? <Spinner color="#fff" /> : <Text>Ingresar</Text>}
              </Button>
              <Button
                transparent
                full
                // onPress={() => navigation.navigate('SignUp')}
                onPress={this.saveBearerToken}
                >
                <Text style={styles.signup.linkText}>
                  Guardar bearer token
                </Text>
                <Text style={styles.signup.linkBtn}>Registro</Text>
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
