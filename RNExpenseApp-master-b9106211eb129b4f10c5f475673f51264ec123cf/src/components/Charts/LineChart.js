import React, { Component } from 'react';
import { VictoryLine } from 'victory-native';
import { Dimensions } from 'react-native';
const deviceWidth = Dimensions.get('window').width;

class LineChart extends Component {
  render() {
    return (
      this.props.data.length > 0 && (
        <VictoryLine
          width={deviceWidth - 80}
          style={{
            data: {
              stroke: this.props.color,
            },
          }}
          data={this.props.data}
        />
      )
    );
  }
}

export default LineChart;
