import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { VictoryBar } from 'victory-native';

import theme from '@theme/variables/myexpense';
const deviceWidth = Dimensions.get('window').width;

class BarChart extends Component {
  render() {
    return (
      this.props.data.length > 0 && (
        <VictoryBar
          horizontal
          width={deviceWidth - 40}
          padding={{ top: 50, bottom: 50, left: 0, right: 50 }}
          style={{
            data: { fill: theme.brandInfo },
            labels: { fontSize: '10' },
          }}
          data={this.props.data}
        />
      )
    );
  }
}

export default BarChart;
