import React, { PureComponent } from 'react';
import { Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from 'victory-native';
import theme from '@theme/variables/myexpense';

const deviceWidth = Dimensions.get('window').width;

class CashFlowChart extends PureComponent {
  render() {
    return (
      this.props.incomeData.length > 0 && (
        <VictoryChart
          theme={VictoryTheme.material}
          width={deviceWidth - 10}
          padding={{ top: 10, bottom: 60, left: 50, right: 20 }}>
          <VictoryLine
            style={{
              data: {
                stroke: theme.brandSuccess,
                strokeWidth: (d, active) => {
                  return active ? 4 : 2;
                },
              },
            }}
            data={this.props.incomeData}
          />
          <VictoryLine
            style={{
              data: {
                stroke: theme.brandDanger,
                strokeWidth: (d, active) => {
                  return active ? 4 : 2;
                },
              },
            }}
            data={this.props.expenseData}
          />
        </VictoryChart>
      )
    );
  }
}

export default CashFlowChart;
