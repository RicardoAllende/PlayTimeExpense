import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ImageBackground, TouchableOpacity, AsyncStorage } from 'react-native';
import HeaderDrawerButton from '../../components/AppHeader/HeaderDrawerButton'
import { Container, Tabs, Tab, Spinner, View, Text, Header, Body, Right, Left, Icon } from 'native-base';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import CourseCarousel from './CourseCarousel';
import AppHeader from '@components/AppHeader';
import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';
import theme from '@theme/variables/myexpense';
import {api, modalLevels} from './../../../api/playTimeApi'
import {session, getUserData} from './../../../api/session'
import {
  getFormattedCurrentWeek,
  getFormattedCurrentMonth,
} from '@utils/formatters';
import Ranking from './Ranking'

import styles from './styles';

import AchievementsList from '@components/Achievement/AchievementsList'

import headerStyles from '@components/AppHeader/styles'

import ModalSelector from 'react-native-modal-selector'

class CourseOverview extends Component {
  state = {
    currentPeriod: getFormattedCurrentWeek(),
    showPieChart: false,
    ready: false,
  };

  loadData = () => {
    // console.log('CourseOverview.js Cargando preguntas')
    getUserData().then(
      (userData) => {
        this.setState({ bearerToken: userData.bearerToken, bearerReady: true, userData: userData }, () => {
          // () => { // BearerToken ready
          console.log("Loading questions");
          url = api.getCourseOverView(this.props.navigation.state.params.courseId);
          headers = {
            "Authorization": 'Bearer ' + this.state.bearerToken,
            Accept: 'application/json',
            "Content-Type": "application/json"
          }
          // console.log(headers);
          // console.log(url)
          // console.log(url)
          // console.log(this.state.bearerToken, url);
            fetch(url, { 
                method: 'GET', 
                headers,
            })
            .then((response) => response.json())
            .then((jsonResponse) => {
                // console.log('CourseChart jsonResponse courseoverview', jsonResponse, url)
                this.setState({
                    usersRanking: jsonResponse.data.ranking.users, times: jsonResponse.data.ranking.times, 
                    medalRanking: jsonResponse.data.medal_ranking, advance: jsonResponse.data.advance, 
                    approvalPercentage: jsonResponse.data.approval_percentage, medals: jsonResponse.data.medals,
                    course: jsonResponse.data.course,
                    achievements: jsonResponse.data.achievements, totalQuestions: jsonResponse.data.ranking.total_questions, ready: true
                  }, 
                  ()=>{
                      // console.log('CoursCharts Carga de elementos terminada', this.state)
                  }
                )
            }
            ).catch((error) => { console.error(error); })
          // }
        })
      }
    )
  }

  componentDidMount(){
    this.loadData();
  }

  render() {
    const { navigation, categoriesLoading, categories } = this.props;
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg-big.png')}
          style={styles.container}>
          
          { /* Inicia Appheader */ }
                <View>
                    <Header transparent hasTabs>
                        <Left style={{ flex: 1 }}>
                            <HeaderDrawerButton navigation={navigation} />
                        </Left>
                        <Body style={{ flex: 1, alignItems: 'center' }}>

                        <ModalSelector supportedOrientations={['portrait']} 
                          // key={'mdlStr'}
                          data={modalLevels}
                          initValue="Select something yummy!"
                          supportedOrientations={['landscape']}
                          accessible={true}
                          // childrenContainerStyle={ styles.slide.btnWrapper }
                          // overlayStyle={{ backgroundColor:'blue' }}
                          touchableActiveOpacity={1}
                          scrollViewAccessibilityLabel={'Scrollable options'}
                          cancelButtonAccessibilityLabel={'Cancel Button'}
                          onChange={(level)=>{ this._goToCourse( item.id, level.value ) }}>
                        {/* <View  > */}
                        <Icon active name="ios-play" style={{ fontSize: 35, color: 'white' }} />                          
                        {/* </View> */}
                      </ModalSelector>

                            {/* <TouchableOpacity
                            onPress={
                              () => {
                                navigation.navigate('Quizz');
                              }
                            }
                            >
                                <Icon active name="ios-play" style={{ fontSize: 35, color: 'white' }} />
                            </TouchableOpacity> */}
                        </Body>
                        <Right style={{ flex: 1 }}>
                            {this.props.displayAvatar && (
                            <TouchableOpacity
                                onPress={() => {
                                this.props.navigation.navigate('Profile');
                                }}>
                                {
                                    this.state.avatarReady &&
                                    (
                                        this.state.avatarReady &&
                                        (
                                            <Thumbnail 
                                              source={{
                                                uri: this.state.avatar,
                                                cache: 'only-if-cached',
                                              }}
                                            // style={styles.avatar} 
                                            />
                                        )
                                    )
                                }
                            </TouchableOpacity>
                            )}
                            {this.props.displaySearch && (
                            <Button
                                transparent
                                onPress={() => {
                                this.setState(() => ({
                                    displaySearchBar: !this.state.displaySearchBar,
                                }));
                                }}>
                                <Icon active name="ios-search" style={{ fontSize: 34 }} />
                            </Button>
                            )}
                        </Right>
                    </Header>
                    
                    <View style={headerStyles.titles.container}>
                        <View style={headerStyles.titles.content}>
                        <Text style={headerStyles.titles.text}> {this.state.ready ? this.state.course.name : '_' } </Text>
                        </View>
                    </View>
                </View>
          { ! this.state.ready && (
            <View style={styles.emptyContainer}>
              <Spinner color={theme.brandPrimary} />
            </View>
          )}

          { this.state.ready &&(
              <Tabs
                tabContainerStyle={{
                  elevation: 0,
                }}
                locked
                // onChangeTab={({ i, ref, from }) =>
                //   this.switchPeriod(i, ref, from)
                // }
                >
                <Tab heading="Avances">
                  <CourseCarousel
                    categories={categories}
                    totalQuestions={this.state.totalQuestions}
                    approval
                    approvalPercentage={this.state.approvalPercentage}
                    // barChart
                    // chashFlowChart
                    totalQuestions={this.state.totalQuestions}
                    coursePercentage={this.state.advance}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Ranking">
                  <Ranking
                    gaugeChart
                    showList
                    users={this.state.usersRanking}
                    gaugeData={this.state.advance}
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab>
                <Tab heading="Logros">
                  <AchievementsList
                    achievements={this.state.achievements}
                  />
                </Tab>
                {/* <Tab heading="Tiempo">
                  <CourseCarousel
                    categories={categories}
                    navigation={navigation}
                  />
                </Tab> */}
              </Tabs>
            )}
        </ImageBackground>
      </Container>
    );
  }
}

// const mapStateToProps = state => ({
//   categories: categoriesSelectors.getCategories(state),
//   categoriesLoading: categoriesSelectors.getCategoriesLoadingState(state),
//   categoriesError: categoriesSelectors.getCategoriesErrorState(state),
// });

// export default connect(
//   mapStateToProps,
//   actions
// )(CourseOverview);
export default CourseOverview;