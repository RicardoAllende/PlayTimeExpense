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
import RankingList from './RankingList'
import listStyles from '../../components/ExpenseItem/styles'
// import { FlatList } from 'react-native-gesture-handler';

export class Ranking extends React.Component {

  render() {
    return (
      <View>
        <RankingList
          expensesList={this.props.users}
          handleDelete={ console.log('CourseCarousel handleDelete ExpensesList') }
          _onPress={
            () => console.log('CourseCarousel ExpensesList')
          }
        />
      </View>
    );
  }
}

export default Ranking;
