import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Grid, Col } from 'native-base';
import PropTypes from 'prop-types';

import styles from './styles';
import theme from '@theme/variables/myexpense';

export default class Overview extends React.Component {
  
  // constructor(props){
  //   super(props)
  //   state = {
  //     overview: [],
  //   }
  // }

  render(){
    console.log('overview render this.props.data', this.props.data)
    return (
      <View style={[styles.overview.container]}>
        <Grid>
          <Col size={2}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Categories')}>
              <View>
                <View style={styles.overview.column}>
                  <Text style={styles.overview.title}>{ this.props.data.num_completed_courses }</Text>
                </View>
                <View style={styles.overview.column}>
                  <Text style={styles.overview.subtitle}>Cursos inscritos</Text>
                  <View
                    style={[
                      styles.overview.marker,
                      { borderColor: theme.brandSuccess },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Col>
          <Col size={2}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Overview')}>
              <View>
                <View style={styles.overview.column}>
                  <Text style={styles.overview.title}>{ this.props.data.num_enrolled_courses }</Text>
                </View>
                <View style={styles.overview.column}>
                  <Text style={styles.overview.subtitle}>Cursos terminados</Text>
                  <View
                    style={[
                      styles.overview.marker,
                      { borderColor: theme.brandThird },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Col>
        </Grid>
      </View>
    );
  }

}
