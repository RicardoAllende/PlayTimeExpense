import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, TouchableOpacity, AsyncStorage } from "react-native";
import HeaderDrawerButton from "../../components/AppHeader/HeaderDrawerButton";
import { Container, Tabs, Tab, Spinner, View, Text, Header, Body, Right, Left, Icon } from "native-base";
import { connect } from "react-redux";
import moment from "moment/moment";

import CourseCarousel from "./CourseCarousel";
import AppHeader from "@components/AppHeader";
import * as actions from "./behaviors";
import * as categoriesSelectors from "./selectors";
import theme from "@theme/variables/myexpense";
import { api, modalLevels } from "./../../../api/playTimeApi";
import { session, getUserData, getBearerToken } from "./../../../api/session";
import { getFormattedCurrentWeek, getFormattedCurrentMonth } from "@utils/formatters";
import Ranking from "./Ranking";

import styles from "./styles";

import AchievementsList from "@components/Achievement/AchievementsList";

import headerStyles from "@components/AppHeader/styles";

import ModalSelector from "react-native-modal-selector";

class CompleteRanking extends Component {
    state = {
        currentPeriod: getFormattedCurrentWeek(),
        showPieChart: false,
        ready: false
    };

    loadData = async () => {
        // return false
        getBearerToken().then(bearerToken => {
            fetch(api.getCompleteRanking, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + bearerToken
                }
            })
                .then(response => {
                    // console.log('Terminó respuesta', response)
                    // return
                    return response.json()
                }
                )
                .then(jsonResponse => {
                    // return
                    completedCoursesRanking = jsonResponse.data.completed_courses_ranking.map((item, index) => {
                        return {
                            rank: index + 1,
                            firstname: item.firstname,
                            lastname: item.lastname,
                            hits: item.completed_courses,
                            avatar: session.addPath(item.avatar)
                        };
                    });
                    creditsRanking = jsonResponse.data.credits_ranking.map((item, index) => {
                        return {
                            rank: index + 1,
                            firstname: item.firstname,
                            lastname: item.lastname,
                            hits: item.credits,
                            avatar: session.addPath(item.avatar)
                        };
                    });
                    achievementsRanking = jsonResponse.data.achievements_ranking.map((item, index) => {
                        return {
                            rank: index + 1,
                            firstname: item.firstname,
                            lastname: item.lastname,
                            hits: item.achievements,
                            avatar: session.addPath(item.avatar)
                        };
                    });
                    this.setState({
                        creditsRanking,
                        completedCoursesRanking,
                        achievementsRanking,
                        ready: true
                    });
                })
                .catch(error => console.log("error loadData CompleteRanking", error));
        });
    };

    componentDidMount() {
        this.loadData();
    }

    render() {
        const { navigation, categoriesLoading, categories } = this.props;
        return (
            <Container>
                <ImageBackground
                    // source={require('@assets/images/header-bg-big.png')}
                    source={{
                        uri: "https://koenig-media.raywenderlich.com/uploads/2014/01/sunny-background.png",
                        cache: "only-if-cached"
                    }}
                    style={styles.container}
                >
                    <AppHeader navigation={navigation} title="Ranking de usuarios" />
                    {!this.state.ready && (
                        <View style={styles.emptyContainer}>
                            <Spinner color={theme.brandPrimary} />
                        </View>
                    )}

                    {this.state.ready && (
                        <Tabs
                            tabContainerStyle={{
                                elevation: 0
                            }}
                            locked
                        >
                            <Tab heading="Puntaje">
                                <Ranking
                                    gaugeChart
                                    showList
                                    users={this.state.creditsRanking}
                                    gaugeData={this.state.advance}
                                    categories={categories}
                                    navigation={navigation}
                                />
                            </Tab>
                            <Tab heading="Cursos terminados">
                                <Ranking
                                    gaugeChart
                                    showList
                                    users={this.state.completedCoursesRanking}
                                    gaugeData={this.state.advance}
                                    categories={categories}
                                    navigation={navigation}
                                />
                            </Tab>
                            <Tab heading="Logros obtenidos">
                                <Ranking
                                    gaugeChart
                                    showList
                                    users={this.state.achievementsRanking}
                                    gaugeData={this.state.advance}
                                    categories={categories}
                                    navigation={navigation}
                                />
                            </Tab>
                        </Tabs>
                    )}
                </ImageBackground>
            </Container>
        );
    }
}

export default CompleteRanking;
