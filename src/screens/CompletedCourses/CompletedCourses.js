// Listado de cursos

import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground } from "react-native";
import moment from "moment";
import {
  Container,
  Content,
  Tabs,
  Tab,
  Text,
  Icon,
  Fab,
  Spinner,
  View
} from "native-base";
import { connect } from "react-redux";
import { session, getUserData, getCourses, getBearerToken } from "../../../api/session";

import CoursesList from "./CoursesList";
import AppHeader from "@components/AppHeader";

import * as actions from "./behaviors";
import * as expensesSelectors from "./selectors";

import styles from "./styles";
import theme from "@theme/variables/myexpense";

import { api } from "../../../api/playTimeApi";
import { AsyncStorage } from "react-native";

class CompletedCourses extends Component {
  static defaultProps = {
    expensesLoading: false,
    expensesError: false
  };

  state = {
    coursesLoading: true
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    getBearerToken().then(bearerToken => {
          // bearerToken is setted
          // console.log("Waklthrough.js, imprimiendo bearerToken", this.state.bearerToken)
          fetch(api.getCompletedCourses, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + bearerToken,
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          })
            .then(response => response.json())
            .then(response => {
              this.setState(
                {
                  courses: response.data.courses,
                  coursesLoading: false,
                },
                () => {
                  console.log('CompletedCourses this.state.coures')
                }
              );
              session.setCourses(response.data.courses);
            })
            .catch(error => {
              console.error(error);
            });
        }
      );
  };

  render() {
    const { navigation, expenses, deleteExpense, expensesLoading } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require("@assets/images/header-bg.png")}
          style={styles.container}
        >
          <AppHeader navigation={navigation} title="Mis cursos completados" />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={styles.content}
          >
            {this.state.coursesLoading && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {!this.state.coursesLoading &&
              this.state.courses.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMsg}>Aún no tiene cursos completados</Text>
                </View>
              )}
            {!this.state.coursesLoading &&
              this.state.courses.length > 0 && (
                <CoursesList
                  expensesList={this.state.courses}
                  finished={true}
                  navigation={navigation}
                  handleDelete={deleteExpense}
                  _onPress={(courseId, level) =>
                    alert('Se presionó el elemento' + courseId)
                  }
                />
              )}
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}

export default CompletedCourses;
