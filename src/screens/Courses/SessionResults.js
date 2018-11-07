import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, StyleSheet, ScrollView, Button } from "react-native";
import { Container, Tabs, Tab, Spinner, View, Text } from "native-base";
import { connect } from "react-redux";
import moment from "moment/moment";

import CourseCarousel from "../CourseOverview/CourseCarousel";
import AppHeader from "@components/AppHeader";
import * as actions from "./behaviors";
import * as categoriesSelectors from "./selectors";
import theme from "@theme/variables/myexpense";
import { AsyncStorage } from "react-native";
import { api, getLevelName, getLevelIndex } from "./../../../api/playTimeApi";
import { session, getBearerToken, getUserData } from "./../../../api/session";
import RankingList from "../CourseOverview/RankingList";

import AchievementsList from "@components/Achievement/AchievementsList";

import {
  getFormattedCurrentWeek,
  getFormattedCurrentMonth
} from "@utils/formatters";
import Ranking from "../CourseOverview/Ranking";

import chartStyles from "./chartStyles";

import PercentageCircle from "react-native-percentage-circle";
import styles from "./styles";
const brandSuccess = "#50D2C2";

class CourseCharts extends Component {
  state = {
    currentPeriod: getFormattedCurrentWeek(),
    showPieChart: false,
    ready: false
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.props.getCategories();
  };

  switchPeriod(i) {
    let period = "";
    switch (i) {
      case 0:
        period = getFormattedCurrentWeek();
        break;
      case 1:
        period = getFormattedCurrentMonth();
        break;
      case 2:
        period = moment().format("YYYY");
        break;
    }

    this.setState({ currentPeriod: period });
  }

  componentDidMount() {
    this.loadData();
  }

  init = false;
  render() {
    const { navigation, categoriesLoading, categories } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require("@assets/images/header-bg.png")}
          style={chartStyles.container}
        >
          <AppHeader
            navigation={this.props.navigation}
            title={this.state.ready ? this.state.courseName : "_"}
            titleSuffix="."
          />
          {!this.state.ready && (
            <View style={chartStyles.emptyContainer}>
              <Spinner color={theme.brandPrimary} />
            </View>
          )}
          {/* { this.state.ready &&
            categories.length === 0 && (
              <View style={chartStyles.emptyContainer}>
                <Text style={chartStyles.emptyMsg}>Error al cargar las estadísticas del curso</Text>
              </View>
            )} */}

          {this.state.ready && (
            <Tabs
              tabContainerStyle={{
                elevation: 0
              }}
              locked
              onChangeTab={({ i, ref, from }) =>
                this.switchPeriod(i, ref, from)
              }
            >
              <Tab heading="Resultados">
                <ScrollView style={stylesTabView.container}>
                  <Text style={stylesTabView.textDescription}>
                    Nivel de complejidad: {this.state.level}
                  </Text>
                  <Text style={stylesTabView.textDescription}>
                    Usted contestó {this.state.numAnswers} preguntas
                  </Text>
                  <Text style={stylesTabView.textDescription}>
                    De las cuales, tuvo {this.state.numCorrectAnswers} correctas
                  </Text>
                  <Text style={stylesTabView.textDescription}>
                    Total de preguntas restantes en el curso: {this.state.numAvailableQuestions}
                  </Text>
                  {this.state.finishedInASession && (
                    <Text style={stylesTabView.textDescription}>
                      Usted terminó el curso en una sesión
                    </Text>
                  )}
                  {/* <Text style={stylesTabView.textDescription} >{ this.state.randomMode ? "Se hizo en modo aleatorio" : "Se hizo en modo normal" }</Text> */}
                  {this.state.courseCompleted && (
                    <Text style={stylesTabView.textDescription}>
                      Este curso está terminado
                    </Text>
                  )}
                  <Text style={stylesTabView.textDescription}>
                    Tiempo: {this.state.time}
                  </Text>
                  <Text style={stylesTabView.textDescription}>
                    Porcentaje de avance del curso
                  </Text>
                  <View style={stylesTabView.percentageCircle}>
                    <PercentageCircle
                      style={stylesTabView.percentage}
                      radius={50}
                      percent={this.state.advance}
                      color={brandSuccess}
                    />
                    <View style = {{height: 10,width: '100%',}} />
                    <Button
                      style={{ padding: "5%" }}
                      onPress={() => {
                        navigation.navigate("CourseOverview", {
                          courseId: this.props.navigation.state.params.course_id
                        });
                      }}
                      title="Ver estadísticas del curso"
                    />
                    {/* <Button
                      style={{ textAlign: 'center', 'padding': '5%', backgroundColor: 'blue' }}
                        onPress={
                          () => {
                            navigation.navigate('CourseOverview', {
                              courseId: this.props.navigation.state.params.course_id
                            })
                          }
                        }
                      >
                        <Text style={stylesTabView.textDescription}>Ver estadísticas del curso</Text>
                      </Button> */}
                  </View>
                  {/* <PercentageCircle style={stylesTabView.percentage} radius={35} percent={0} color={brandSuccess}></PercentageCircle> */}
                </ScrollView>
                {/* <CourseCarousel
                    categories={categories}
                    totalQuestions={this.state.totalQuestions}
                    // pieChart
                    approvalPercentage={this.state.approvalPercentage}
                    barChart
                    chashFlowChart
                    totalQuestions={this.state.totalQuestions}
                    coursePercentage={this.state.advance}
                    navigation={navigation}
                  /> */}
              </Tab>
              {!this.state.randomMode && (
                <Tab heading="Logros obtenidos">
                  <AchievementsList achievements={this.state.achievements} />
                </Tab>
              )}
              {/* {
                  ! this.state.randomMode &&
                  (
                  <Tab heading="Estadísticas del curso">
                    <Ranking
                      gaugeChart
                      showList
                      users={this.state.usersRanking}
                      gaugeData={this.state.advance}
                      categories={categories}
                      navigation={navigation}
                    />
                  </Tab>
                  )
                } */}
            </Tabs>
          )}
        </ImageBackground>
      </Container>
    );
  }

  loadData = async () => {
    getBearerToken().then(bearerToken => {
      this.setState({ bearerToken }, () => {
        url = api.getSessionResults;
        data = JSON.stringify({
          session: this.props.navigation.state.params.session,
          num_questions: this.props.navigation.state.params.num_questions_given,
          course_id: this.props.navigation.state.params.course_id
        });
        // console.log('SessionResults ', data);
        fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + this.state.bearerToken,
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: data
        })
          .then(response => {
            return response.json();
          })
          .then(jsonResponse => {
            level = getLevelName(this.props.navigation.state.params.level);
            this.setState(
              {
                numAnswers: jsonResponse.data.num_answers, // Num questions the user answered
                numQuestionsGiven: this.props.navigation.state.params
                  .num_questions_given, // Total questions in the quizz
                numCorrectAnswers: jsonResponse.data.num_correct_answers,
                finishedInASession: jsonResponse.data.finished_in_a_session,
                randomMode: jsonResponse.data.random_mode,
                courseCompleted: jsonResponse.data.course_completed, // Time is returned in seconds
                time: formatSeconds(jsonResponse.data.time),
                courseName: jsonResponse.data.course_name,
                achievements: jsonResponse.data.achievements,
                advance: jsonResponse.data.advance,
                ready: true,
                level,
                numAvailableQuestions: jsonResponse.data.num_available_questions,
              },
              () => {
                console.log(this.state)
                console.log("Elementos cargados en el estado");
              }
            );
          });
      });
    });
  };
}

const stylesTabView = StyleSheet.create({
  container: {
    padding: "5%",
    // backgroundColor: "blue",
    flex: 1
  },
  textDescription: {
    fontFamily: "Roboto_light",
    fontSize: 16,
    padding: "5%", // default 30
    paddingTop: 0
    // textAlign: 'center',
  },
  percentage: {
    textAlign: "center",
    padding: "5%"
  },
  percentageCircle: {
    alignItems: "center",
    alignContent: "center",
    padding: "3%"
  },
  statsButton: {
    paddingTop: "3%"
  }
});

const mapStateToProps = state => ({
  categories: categoriesSelectors.getCategories(state),
  categoriesLoading: categoriesSelectors.getCategoriesLoadingState(state),
  categoriesError: categoriesSelectors.getCategoriesErrorState(state)
});

export default connect(
  mapStateToProps,
  actions
)(CourseCharts);

function formatSeconds(seconds) {
  minutes = 0;
  if (seconds > 59) {
    minutes = parseInt(seconds / 60);
    seconds = seconds - minutes * 60;
  } else {
    return seconds + " segundos";
  }
  return minutes + ":" + seconds + " minutos";
}
