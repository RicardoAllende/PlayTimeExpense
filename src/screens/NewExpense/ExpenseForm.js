import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { ImageBackground } from 'react-native';
import {
  Container,
  Content,
  Text,
  Button,
  Icon,
  Form,
  Item,
  Picker,
  Spinner,
  Footer,
  Switch,
  Input,
} from 'native-base';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import AppHeader from '@components/AppHeader';
import FormInput from '@components/FormInput';
import Notification from '@components/Notification';
import { required, alphaNumeric, isNumeric } from '@utils/validation';

import * as actions from './behaviors';
import * as expenseSelectors from '@screens/NewExpense/selectors';

import styles from './styles';

import theme from '@theme/variables/myexpense';
var Color = require('color');

const light = Color(theme.brandPrimary).alpha(0.3);

const FORM_NAME = 'AddExpense';

class ExpenseForm extends React.Component {
  static propTypes = {
    loadCategories: PropTypes.func,
    categories: PropTypes.array,
    addExpenseStarted: PropTypes.bool,
    addExpenseSuccess: PropTypes.bool,
    addExpenseError: PropTypes.bool,
    doAddExpense: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    formValues: PropTypes.object,
  };

  static defaultProps = {
    addCategoryStarted: false,
    addCategorySuccess: false,
    addCategoryError: false,
    formValues: {
      amount: 0,
      title: '',
      category: '',
      date: moment().format('YYYY-MM-DD'),
      permanent: false,
    },
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    if (
      this.props.categories === undefined ||
      this.props.categories.length === 0
    ) {
      this.props.loadCategories();
    }
  };

  handleSubmit = values => {
    this.props.doAddExpense(values, () => {
      this.props.navigation.navigate('Expenses');
    });
  };

  render() {
    const {
      navigation,
      handleSubmit,
      categories,
      formValues,
      addExpenseStarted,
      addExpenseError,
    } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg-small.png')}
          style={styles.background}>
          <AppHeader navigation={navigation} title="Add Expense" />
          <Content showsVerticalScrollIndicator={false}>
            {addExpenseError && (
              <Notification
                message="Error adding a new expense!"
                buttonText="Retry"
                duration={5000}
                position="top"
                type="danger"
              />
            )}
            <Form style={{ backgroundColor: '#FFF' }}>
              <Field
                name="amount"
                label="Amount"
                component={FormInput}
                type="text"
                validate={[required, isNumeric]}
                autoCapitalize="none"
                keyboardType="numeric"
              />
              <Field
                name="title"
                label="Expense title"
                component={FormInput}
                type="text"
                validate={[required, alphaNumeric]}
              />
              <Field
                last
                name="category"
                component={({
                  input: { onChange, value },
                  meta: { touched, error },
                }) => {
                  return (
                    <Item picker style={styles.picker.item}>
                      <Picker
                        style={styles.picker.input}
                        mode="dropdown"
                        iosHeader="Select Category"
                        placeholder="Category"
                        placeholderStyle={styles.picker.placeholderText}
                        placeholderIconColor="#95959A"
                        itemStyle={styles.picker.itemStyle}
                        itemTextStyle={styles.picker.itemTextStyle}
                        headerStyle={{ backgroundColor: theme.brandPrimary }}
                        headerTitleStyle={styles.picker.headerTextStyle}
                        headerBackButtonTextStyle={
                          styles.picker.headerTextStyle
                        }
                        iosIcon={
                          <Icon style={styles.picker.icon} name="arrow-down" />
                        }
                        selectedValue={value}
                        onValueChange={value => {
                          onChange(value);
                        }}>
                        {categories.map(item => {
                          return (
                            <Picker.Item
                              key={item.id}
                              label={item.name}
                              value={item.id}
                            />
                          );
                        })}
                      </Picker>
                      {touched &&
                        error && <Text style={styles.formError}>{error}</Text>}
                    </Item>
                  );
                }}
                validate={[required]}
              />
              <Field
                name="date"
                component={({ input: { onChange } }) => {
                  return (
                    <Item picker style={styles.datePicker.formItem}>
                      <DatePicker
                        style={styles.datePicker.container}
                        mode="date"
                        placeholder="Select Date"
                        confirmBtnText="Select"
                        cancelBtnText="Cancel"
                        customStyles={styles.datePicker}
                        iconComponent={
                          <Icon
                            name="md-calendar"
                            style={[styles.datePicker.dateIcon]}
                          />
                        }
                        date={formValues.date}
                        onDateChange={value => {
                          onChange(value);
                        }}
                      />
                    </Item>
                  );
                }}
              />
              <Field
                name="permanent"
                component={({ input: { onChange } }) => {
                  return (
                    <Item picker style={styles.switch.item}>
                      <Input
                        style={styles.switch.input}
                        disabled
                        placeholder="Every month"
                      />
                      <Switch
                        style={styles.switch.switch}
                        onTintColor={light}
                        thumbTintColor={theme.brandPrimary}
                        tintColor={theme.brandPrimary}
                        value={formValues.permanent}
                        onValueChange={value => {
                          onChange(value);
                        }}
                      />
                    </Item>
                  );
                }}
              />
            </Form>
          </Content>
          <Footer style={styles.footer}>
            <Button
              large
              primary
              block
              full
              onPress={handleSubmit(this.handleSubmit)}>
              {addExpenseStarted ? (
                <Spinner color="#fff" />
              ) : (
                <Text> Add </Text>
              )}
            </Button>
            <Button
              transparent
              large
              block
              full
              onPress={() => navigation.navigate('Expenses')}>
              <Text>Cancel</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

export const NewExpenseForm = reduxForm({
  form: FORM_NAME,
})(ExpenseForm);

const mapStateToProps = state => ({
  categories: expenseSelectors.getCategories(state),
  addExpenseStarted: expenseSelectors.isAddExpenseStarted(state),
  addExpenseSuccess: expenseSelectors.isAddExpenseSuccess(state),
  addExpenseError: expenseSelectors.isAddExpenseError(state),
  formValues: getFormValues(FORM_NAME)(state),
});

export default connect(
  mapStateToProps,
  actions
)(NewExpenseForm);
