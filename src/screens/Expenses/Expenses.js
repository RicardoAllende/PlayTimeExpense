import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground } from 'react-native';
import moment from 'moment';
import {
  Container,
  Content,
  Tabs,
  Tab,
  Text,
  Icon,
  Fab,
  Spinner,
  View,
} from 'native-base';
import { connect } from 'react-redux';

import ExpensesList from './ExpensesList';
import AppHeader from '@components/AppHeader';

import * as actions from './behaviors';
import * as expensesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

import {api} from './../../../api/playTimeApi'

class Expenses extends Component {
  // static propTypes = {
  //   navigation: PropTypes.any,
  //   getExpenses: PropTypes.func.isRequired,
  //   expensesLoading: PropTypes.bool.isRequired,
  //   expensesError: PropTypes.bool.isRequired,
  //   expenses: PropTypes.array,
  //   deleteExpense: PropTypes.func,
  // };

  static defaultProps = {
    expensesLoading: false,
    expensesError: false,
  };

  state = {
    headerTitle: moment().format('dddd,'),
    headerTitleSuffix: moment().format('MMM DD'),
    coursesLoading: true
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.props.getExpenses();
  };

  switchPeriod(i) {
    var m = moment();
    let title = '';
    let period = '';
    switch (i) {
      case 0:
        title = m.format('dddd,');
        period = m.format('MMM DD');
        break;
      case 1:
        title =
          m.startOf('week').format('DD') +
          ' - ' +
          m.endOf('week').format('DD,');
        period = m.format('MMM, YYYY');
        break;
      case 2:
        title = m.format('MMMM, ');
        period = m.format('YYYY');
        break;
    }

    this.setState({ headerTitle: title, headerTitleSuffix: period });
  }

  loadCourses = () => {
        fetch(api.getCourses, { 
            method: 'GET', 
            headers: {
                "Authorization": 'Bearer ' + this.props.navigation.state.params.userData.access_token,
                Accept: 'application/json',
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((response) => {
              this.setState( { courses: response.data.courses, coursesLoading: false}, () => {
                console.log('Se terminó la carga de los cursos');
              })
          }
        ).catch((error) => {
            console.error(error);
        })
    // }
  }

  init = false

  render() {
    if( ! this.init ){
      this.loadCourses();
      this.init = true;
    }
    const { navigation, expenses, deleteExpense, expensesLoading } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.container}>
          <AppHeader
            navigation={navigation}
            title={this.state.headerTitle}
            titleSuffix={this.state.headerTitleSuffix}
          />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={styles.content}>
            {this.state.coursesLoading && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {!this.state.coursesLoading &&
              this.state.courses.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMsg}>No expenses found</Text>
                </View>
              )}
            {!this.state.coursesLoading &&
              this.state.courses.length > 0 && (
                <ExpensesList
                  expensesList={this.state.courses}
                  handleDelete={deleteExpense}
                />
                // <Tabs
                //   tabContainerStyle={{
                //     elevation: 0,
                //   }}
                //   locked
                //   onChangeTab={({ i, ref, from }) =>
                //     this.switchPeriod(i, ref, from)
                //   }>
                //   <Tab heading="Today">
                //     <ExpensesList
                //       expensesList={courses}
                //       handleDelete={deleteExpense}
                //     />
                //   </Tab>
                //   <Tab heading="This Week">
                //     <ExpensesList
                //       expensesList={courses}
                //       handleDelete={deleteExpense}
                //     />
                //   </Tab>
                //   <Tab heading="This Month">
                //     <ExpensesList
                //       expensesList={courses}
                //       handleDelete={deleteExpense}
                //     />
                //   </Tab>
                // </Tabs>
              )}
            <Fab
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: theme.brandPrimary }}
              position="bottomRight"
              onPress={() => navigation.navigate('NewExpense')}>
              <Icon type="Feather" name="plus" />
            </Fab>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  expenses: expensesSelectors.getExpenses(state),
  expensesLoading: expensesSelectors.getExpensesLoadingState(state),
  expensesError: expensesSelectors.getExpensesErrorState(state),
});

export default connect(
  mapStateToProps,
  actions
)(Expenses);

const courses = [
  {"id":1,"name":"Principios b\u00e1sicos de la Naturaleza","description":"Existen 8 principios b\u00e1sicos de la naturaleza","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":7},
  {"id":2,"name":"Maxime id asperiores.","description":"Molestiae enim maiores at beatae eos corrupti aut aliquam pariatur vitae debitis illo qui est non nemo.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":3,"name":"Mollitia distinctio saepe velit ab.","description":"Enim est aliquid et magnam ut aliquid et quia dolores molestiae voluptatem distinctio quae id illo culpa vel temporibus.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":4,"name":"Tempora minus sunt ut id.","description":"Sed molestiae fugit similique ullam nihil facilis fuga est eos provident praesentium error officia molestias facilis dolorum.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":5,"name":"Repudiandae aperiam necessitatibus tempora voluptatem.","description":"Qui minus maiores incidunt facilis aut aspernatur asperiores ipsam doloremque non et quisquam.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":6,"name":"Explicabo sapiente distinctio qui.","description":"Placeat consequuntur voluptatum omnis est eum voluptas rerum quibusdam nam ea totam placeat suscipit.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":7,"name":"Saepe rerum magnam natus.","description":"Molestias officiis dolores sit possimus qui iste magnam atque tenetur aliquid officiis dolorum numquam assumenda.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":8,"name":"Aliquam non ipsam aut tempora.","description":"Quia eum velit dolorem nihil ullam tenetur maiores tempore esse aut deleniti.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":9,"name":"Excepturi enim sunt iusto.","description":"Officiis soluta suscipit tempora autem voluptate a expedita qui aliquam sed dolor sit consequuntur architecto natus corporis.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":10,"name":"Occaecati laboriosam eos quos enim et.","description":"Atque velit ut non molestias distinctio dolor laudantium itaque doloremque molestias libero quos laborum.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":11,"name":"Saepe voluptates dolor.","description":"Sed ea in maiores vel expedita labore porro maiores et aut iusto.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":12,"name":"Quis aliquid et iure ipsa.","description":"Animi alias sit blanditiis et amet molestias voluptatem earum cupiditate facilis pariatur et natus voluptates tenetur temporibus.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":13,"name":"Molestiae repudiandae doloremque.","description":"Rerum iusto alias est quod quis rerum temporibus qui eius facere.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":14,"name":"Ad voluptatem labore voluptatem non.","description":"Et omnis aut suscipit nemo voluptas libero quos officia cupiditate sit adipisci fugiat porro dolore at optio quia laboriosam perspiciatis.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":15,"name":"Asperiores hic hic.","description":"Non et omnis doloremque mollitia ducimus neque delectus vel non ut voluptates est itaque nemo provident voluptatum officia natus qui.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15},
  {"id":16,"name":"Ratione et velit et voluptatum.","description":"Sed fuga aspernatur blanditiis esse provident non quo aut iusto officia commodi voluptatem.","enabled":1,"created_at":"2018-10-03 14:55:30","updated_at":"2018-10-03 14:55:30","num_questions":15}
];