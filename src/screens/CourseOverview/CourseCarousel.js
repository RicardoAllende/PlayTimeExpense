import React from 'react';
import PropTypes from 'prop-types';
import { Platform, Dimensions, View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Carousel from 'react-native-carousel-view';
import PieChart from '@components/Charts/PieChart';
import BarChart from '@components/Charts/BarChart';
import GaugeChart from '@components/Charts/GaugeChart';
import CashFlowChart from '@components/Charts/CashFlowChart';
import { Grid, Col,  Icon, Item } from 'native-base';
import styles from './styles';

import theme from '@theme/variables/myexpense';
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
import {api} from './../../../api/playTimeApi'
import {session, getUserData} from './../../../api/session'
import { AsyncStorage } from "react-native"
import ExpensesList from './ExpensesList'
import listStyles from '../../components/ExpenseItem/styles'
// import { FlatList } from 'react-native-gesture-handler';

import PercentageCircle from 'react-native-percentage-circle';
const brandSuccess = '#50D2C2';

export class CourseCarousel extends React.Component {
  static propTypes = {
    categories: PropTypes.array,
    navigation: PropTypes.any,
  };

  getCategoriesDataForChart = formatLabel =>
    this.props.categories.map(obj => {
      label = formatLabel
        ? obj.name + '\n(' + obj.percent + '%)'
        : obj.name + '(' + obj.percent + '%)';
      return {
        x: obj.name,
        y: obj.amount,
        label: label,
      };
    });

  render() {
    const expenseHistory = [
      { x: 'Jan', y: 1522 },
      { x: 'Feb', y: 1343 },
      { x: 'Mar', y: 1855 },
      { x: 'Apr', y: 1114 },
      { x: 'May', y: 2107 },
      { x: 'Jun', y: 2307 },
      { x: 'Jul', y: 1507 },
      { x: 'Aug', y: 1807 },
      { x: 'Sep', y: 1907 },
      { x: 'Oct', y: 1307 },
      { x: 'Nov', y: 2207 },
      { x: 'Dec', y: 2107 },
    ];
    const incomeHistory = [
      { x: 'Jan', y: 2442 },
      { x: 'Feb', y: 2503 },
      { x: 'Mar', y: 2605 },
      { x: 'Apr', y: 2605 },
      { x: 'May', y: 2707 },
      { x: 'Jun', y: 2507 },
      { x: 'Jul', y: 2807 },
      { x: 'Aug', y: 2850 },
      { x: 'Sep', y: 2607 },
      { x: 'Oct', y: 2907 },
      { x: 'Nov', y: 2307 },
      { x: 'Dec', y: 2707 },
    ];

    return (
      <View>
        <Carousel
          width={deviceWidth}
          height={deviceHeight}
          loop={false}
          indicatorAtBottom
          indicatorOffset={deviceHeight / 3}
          indicatorSize={Platform.OS === 'android' ? 15 : 10}
          indicatorColor={theme.brandPrimary}
          animate={false}>
          {
            this.props.coursePercentage &&
            this.props.coursePercentage > 0 ?
              <View pointerEvents="none" style={styles.slides}>
                  <ScrollView>
                  <Text style={styles.chartTitle}>Porcentaje del curso</Text>
                  <GaugeChart percent={this.props.coursePercentage} />
                    <Text>Número de preguntas: { this.props.totalQuestions } </Text>
                </ScrollView>
              </View> 
              :
              <View pointerEvents="none" style={styles.slides}>
                <Text style={styles.chartTitle}>Porcentaje de avance del curso</Text>              
                <Text>¡Aún no ha iniciado el curso!</Text>
              </View>
          }
          {
            this.props.pieChart &&
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Aprobación del curso en el grupo</Text>
              <PercentageCircle radius={35} percent={this.props.approvalPercentage} color={brandSuccess}></PercentageCircle>              
              {/* <PieChart data={this.props.approvalPercentage} /> */}
            </View>
          }
          {
            this.props.barChart &&
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Expenses By Categories</Text>
              <BarChart data={this.getCategoriesDataForChart()} />
            </View>
          }
          {
            this.props.chashFlowChart &&
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Cash Flow History</Text>
              <CashFlowChart
                incomeData={incomeHistory}
                expenseData={expenseHistory}
              />
            </View>
          }
        </Carousel>
      </View>
    );
  }
}

export default CourseCarousel;
