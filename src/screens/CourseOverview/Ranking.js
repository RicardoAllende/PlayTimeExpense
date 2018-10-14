import React from 'react';
import PropTypes from 'prop-types';
import { Platform, Dimensions, View, Text, FlatList, TouchableOpacity } from 'react-native';
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

export class Ranking extends React.Component {
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

    _renderUserList = (item) => {
      // console.log(item)
      return (<View style={[listStyles.item.content, { borderColor: 'blue', flex: 1, backgroundColor: 'green' }]}>
        <TouchableOpacity onPress={() => _onPressButton(item.name) }>
        <Grid>
          <Col size={7} style={{ flexDirection: 'row' }}>
            <Icon name="laptop" style={listStyles.item.icon} />
            <View>
              <Text numberOfLines={2} style={listStyles.item.title}>
                {item.rank + ' ' + item.firstname + ' ' + item.lastname }
              </Text>
              <Text numberOfLines={2} style={listStyles.item.subtitle}>
                {item.rank + ' ' + item.firstname + ' ' + item.lastname }
              </Text>
            </View>
          </Col>
          <Col size={3}>
            <Text
              numberOfLines={2}
              style={ listStyles.item.incomeAmount }>
              {/* .expenseAmount || .incomeAmount */}
              { item.hits }
            </Text>
          </Col>
        </Grid>
        </TouchableOpacity>
      </View>);
    }

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
        <ExpensesList
          expensesList={this.props.users}
          handleDelete={ console.log('CourseCarousel handleDelete ExpensesList') }
          _onPress={
            () => console.log('CourseCarousel ExpensesList')
          }
        />
        {/* <Carousel
          width={deviceWidth}
          height={deviceHeight}
          loop={false}
          indicatorAtBottom
          indicatorOffset={deviceHeight / 3}
          indicatorSize={Platform.OS === 'android' ? 15 : 10}
          indicatorColor={theme.brandPrimary}
          animate={false}>
          {
            this.props.gaugeChart &&
            this.props.coursePercentage > 0 ?
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Porcentaje del curso</Text>
              <GaugeChart percent={this.props.coursePercentage} />
            </View> :
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Porcentaje de avance del curso</Text>              
              <Text>¡Aún no ha iniciado el curso!</Text>
            </View>
          }
          {
            this.props.showList &&
            <View pointerEvents="none" style={styles.slides}>            
              <Text style={styles.chartTitle}>Ranking del curso</Text>
              <Text>Otro texto</Text>
              <FlatList
                data={this.props.users}
                renderItem={ 
                  // this._renderUserList

                  (item, index) => {
                    console.log(item)
                    return (<View>
                      <Text style={{ flex: 1, backgroundColor: 'blue' }}>
                        Elemento
                      </Text>
                    </View>)
                  }
                }
                keyExtractor={
                  (item, index) => "elemento" + index
                }
                />
            </View>

            // <View pointerEvents="none" style={styles.slides}>
            //   <Text style={styles.chartTitle}>Ranking del curso</Text>
            //   <ExpensesList
            //     expensesList={this.props.users}
            //     handleDelete={ console.log('CourseCarousel handleDelete ExpensesList') }
            //     _onPress={
            //       () => console.log('CourseCarousel ExpensesList')
            //     }
            //   />
            // </View>
          }
          {
            this.props.pieChart &&
            <View pointerEvents="none" style={styles.slides}>
              <Text style={styles.chartTitle}>Estadísticas del curso</Text>
              <PieChart data={this.props.approvalPercentage} />
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
        </Carousel> */}
      </View>
    );
  }
}

export default Ranking;
