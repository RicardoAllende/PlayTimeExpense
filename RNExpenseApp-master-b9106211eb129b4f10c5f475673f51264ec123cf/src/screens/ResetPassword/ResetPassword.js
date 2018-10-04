import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ImageBackground } from 'react-native';
import {
  Container,
  Text,
  Button,
  Form,
  Footer,
  Icon,
  Spinner,
  View,
  Header,
  Left,
  Content,
} from 'native-base';
import { reduxForm, Field } from 'redux-form';
import { doResetPassword } from './behaviors';
import * as resetPasswordSelectors from './selectors';

import LoginInput from '@components/LoginInput';
import Notification from '@components/Notification';
import { required, email } from '@utils/validation';

import styles from './styles';

const FORM_NAME = 'resetPassword';

class ResetPassword extends Component {
  static propTypes = {
    resetPasswordStarted: PropTypes.bool,
    resetPasswordSuccess: PropTypes.bool.isRequired,
    resetPasswordError: PropTypes.bool,
    doResetPassword: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    resetPasswordStarted: false,
    resetPasswordSuccess: false,
    resetPasswordError: false,
  };

  handleSubmit = values => {
    this.props.doResetPassword(values.email, () => {
      this.props.navigation.goBack();
    });
  };

  render() {
    const {
      navigation,
      handleSubmit,
      resetPasswordStarted,
      resetPasswordError,
    } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/background2.png')}
          style={styles.background}>
          <Header transparent>
            <Left style={{ flex: 1 }}>
              <Button
                transparent
                onPress={() => this.props.navigation.goBack()}>
                <Icon
                  style={styles.header.navigation}
                  type="SimpleLineIcons"
                  name="arrow-left"
                />
              </Button>
            </Left>
          </Header>
          <Content showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1 }}>
              {resetPasswordError && (
                <Notification
                  message="Error reseting your password!!"
                  buttonText="Retry"
                  duration={5000}
                  position="top"
                  type="danger"
                />
              )}
              <View style={styles.header.container}>
                <Text style={styles.header.title}>Forgot Password</Text>
              </View>
              <Form>
                <Field
                  name="email"
                  placeholder="Email"
                  icon="ios-mail-outline"
                  component={LoginInput}
                  type="email"
                  validate={[email, required]}
                />
              </Form>
            </View>
          </Content>
          <Footer style={styles.footer.container}>
            <View style={{ flex: 1 }}>
              <Button
                large
                primary
                block
                full
                onPress={handleSubmit(this.handleSubmit)}>
                {resetPasswordStarted ? (
                  <Spinner color="#fff" />
                ) : (
                  <Text> Reset Password </Text>
                )}
              </Button>
              <Button
                transparent
                full
                onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.footer.linkText}>
                  Got my password, go to
                </Text>
                <Text style={styles.footer.linkBtn}>Sign In</Text>
              </Button>
            </View>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

const ResetPasswordForm = reduxForm({
  form: FORM_NAME,
})(ResetPassword);

const mapStateToProps = state => ({
  resetPasswordStarted: resetPasswordSelectors.isResetPasswordStarted(state),
  resetPasswordSuccess: resetPasswordSelectors.isResetPasswordSuccess(state),
  resetPasswordError: resetPasswordSelectors.isResetPasswordError(state),
});

export default connect(
  mapStateToProps,
  { doResetPassword }
)(ResetPasswordForm);
