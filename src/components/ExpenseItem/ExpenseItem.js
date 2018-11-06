import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native'
import { View, Grid, Col, Text, Icon, Item } from 'native-base';

import ModalSelector from 'react-native-modal-selector'
import { formatAmount } from '@utils/formatters';
import styles from './styles';
import { modalLevels } from '../../../api/playTimeApi'

var index = 0;

const ExpenseItem = ({ item, style, color, _onPress }) => {
  const borderColor = color ? color : item.color;
  courseId = 0;
  const data = [
    { key: index++, section: true, label: 'Fruits' },
    { key: index++, label: 'Red Apples' },
    { key: index++, label: 'Cherries' },
    { key: index++, label: 'Cranberries', accessibilityLabel: 'Tap here for cranberries' },
    // etc...
    // Can also add additional custom keys which are passed to the onChange callback
    { key: index++, label: 'Vegetable', customKey: 'Not a fruit' }
  ];

  _onPressButton = (courseId, name, level) => {
    // console.log('Se presionó el elemento:', courseId)
    this.courseId = courseId;
    alert(courseId + name)
    // this.selector.open();
  }

  return (
    <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      {/* <TouchableOpacity onPress={() => _onPressButton(item.id, item.name) }> */}
      {/* <TouchableOpacity onPress={() => _onPress(item.id, item.name) }> */}
      <Grid>
        <Col size={7} style={{ flexDirection: 'row' }}>
          <Icon name="laptop" style={styles.item.icon} />
          <View>
            <Text numberOfLines={2} style={styles.item.title}>
              {item.name}
            </Text>
            <Text numberOfLines={2} style={styles.item.subtitle}>
              {item.description ? item.description.substr(0, 25) + ' ...' : "Description" }
            </Text>
          </View>
        </Col>
        {/* <Col size={3}>
          <Text
            numberOfLines={2}
            style={
              item.amount < 0
                ? styles.item.expenseAmount
                : styles.item.incomeAmount
            }>
            {item.num_questions}
          </Text>
        </Col> */}
        <Col size={3} >
          <ModalSelector
            key={ 'ms' + item.id }
            data={modalLevels}
            // ref={ selector => this.selector = selector }
            // initValue="Select something yummy!"
            // onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} 
            onChange={(level)=>{
                // alert(`${option.label} (${option.key}) nom nom nom`) 
                _onPress(item.id, level.value)
              }} 
            >
              <Icon active name="ios-play" style={{ fontSize: 35 }} 
              style={{
                alignSelf: 'flex-end',
                color,
              }}
              />
          </ModalSelector>
        </Col>
      </Grid>
      {/* </TouchableOpacity> */}
      {/* <ModalSelector
        data={data}
        style={}
        ref={ selector => this.selector = selector }
        // initValue="Select something yummy!"
        onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} /> */}
    </View>
  );
};

// ExpenseItem.propTypes = {
//   item: PropTypes.object.isRequired,
//   style: PropTypes.object,
//   color: PropTypes.string,
// };

export default ExpenseItem;
