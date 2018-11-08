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
  // console.log(item)
  const borderColor = color ? color : item.color;
  courseId = 0;

  _onPressButton = (courseId, level) => {
    // // console.log('Se presionó el elemento:', courseId)
    // this.courseId = courseId;
    // alert(courseId + name)
    // // this.selector.open();
    if(typeof(level) == undefined){
      
    }
    _onPress(courseId, level)

  }

  if(item.finished){
    console.log('finished', item)
    return (
      <View style={[styles.item.content, { borderColor: borderColor }, style]}>
        {/* <TouchableOpacity onPress={() => _onPressButton(item.id, item.name) }> */}
        <TouchableOpacity onPress={() => _onPress(item.id, item.name) }>
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
          <Col size={3} >
            <Icon active name="ios-stats" style={{ fontSize: 35 }} 
                style={{
                  alignSelf: 'flex-end',
                  color,
                }}
            />
          </Col>
        </Grid>
        </TouchableOpacity>
      </View>
    );
    // console.log('Este curso se dio por terminado')
    
  }else{
    // console.log('No se ha terminado este curso')
    return (
      <View style={[styles.item.content, { borderColor: borderColor }, style]}>
        {/* <TouchableOpacity onPress={() => _onPressButton(item.id) }> */}
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
          <Col size={3} >
            <ModalSelector
              key={ 'ms' + item.id }
              data={modalLevels}
              // ref={ selector => this.selector = selector }
              // initValue="Select something yummy!"
              // onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} 
              onChange={(level)=>{
                  // alert(`${option.label} (${option.key}) nom nom nom`) 
                  _onPressButton(item.id, level.value)
                  // _onPress(item.id, level.value)
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
      </View>
    );
  }
};

export default ExpenseItem;
