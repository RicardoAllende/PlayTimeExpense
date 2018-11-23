import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Button } from 'react-native'
import { View, Grid, Col, Text, Icon, Item } from 'native-base';

import ModalSelector from 'react-native-modal-selector'
import { formatAmount } from '@utils/formatters';
import styles from './styles';
// import { modalLevels } from '../../../api/playTimeApi'
import {modalLevels} from '@components/ModalSelector/levels'

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

  showModalSelector = () => {
    this.selector.open()
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
      // <View style={[styles.item.content, { borderColor: borderColor }, style]}>
      <TouchableOpacity style={[styles.item.content, { borderColor: borderColor }, style]} onPress={this.showModalSelector} >
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
            <ModalSelector supportedOrientations={['portrait']} 
              key={ 'ms' + item.id }
              data={modalLevels}
              ref={ selector => this.selector = selector }
            
              optionTextStyle={{ color: 'black' }} // contenedor de opciones
              overlayStyle={{ padding: "10%" }}
              optionContainerStyle={{ backgroundColor: 'rgba(230,230,250,1)' }} // contenedor opciones
              optionContainerStyle={{ backgroundColor: 'rgba(255,255,255,1)' }} // contenedor opciones
              // initValue="Select something yummy!"
              // onChange={(option)=>{ alert(`${option.label} (${option.key}) nom nom nom`) }} 
              onChange={(level)=>{
                  // alert(`${option.label} (${option.key}) nom nom nom`) 
                  _onPressButton(item.id, level.value)
                  // _onPress(item.id, level.value)
                }} 
              >
                <Icon active name="ios-add-circle" style={{ fontSize: 35 }} 
                style={{
                  alignSelf: 'flex-end',
                  color,
                }}
                />
            </ModalSelector>
            {/* <Button
              onPress={ this.showModalSelector }
              title="Mostrar elemento"
            /> */}
          </Col>
        </Grid>
        {/* </TouchableOpacity> */}
        </TouchableOpacity>
      // </View>
    );
  }
};

export default ExpenseItem;
