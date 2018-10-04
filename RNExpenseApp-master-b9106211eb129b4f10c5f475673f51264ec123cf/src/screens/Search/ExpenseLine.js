import React from 'react';
import PropTypes from 'prop-types';

import { TouchableHighlight } from 'react-native';
import {
  Body,
  Text,
  Icon,
  Right,
  View,
  Card,
  CardItem,
  Grid,
  Col,
} from 'native-base';
import { formatAmount } from '@utils/formatters';

import styles from './styles';

class ExpenseLine extends React.Component {
  static propTypes = {
    item: PropTypes.shape({
      amount: PropTypes.number,
      label: PropTypes.string,
      date: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
  };

  state = {
    opened: false,
  };

  toggleOpenStatus = () => {
    this.setState(state => ({
      opened: !state.opened,
    }));
  };

  render() {
    const {
      item: { ...expense },
    } = this.props;

    const toggleIconName = this.state.opened
      ? 'ios-arrow-up'
      : 'ios-arrow-down';

    return (
      <Card transparent style={styles.expense.container}>
        <CardItem style={styles.expense.content}>
          <Body>
            <Text style={styles.expense.title}>{expense.title}</Text>
          </Body>
          <Right>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={
                  expense.amount < 0
                    ? styles.expense.expenseAmount
                    : styles.expense.incomeAmount
                }>
                {formatAmount(expense.amount)}
              </Text>
              <TouchableHighlight
                onPress={this.toggleOpenStatus}
                underlayColor="transparent">
                <Icon name={toggleIconName} style={{ fontSize: 20 }} />
              </TouchableHighlight>
            </View>
          </Right>
        </CardItem>
        {this.state.opened && (
          <CardItem style={styles.expense.content}>
            <Body>
              <Grid>
                <Col>
                  <Text style={styles.expense.detailText}>Date</Text>
                </Col>
                <Col>
                  <Text style={styles.expense.detailText}>{expense.date}</Text>
                </Col>
              </Grid>
              <Grid>
                <Col>
                  <Text style={styles.expense.detailText}>Type</Text>
                </Col>
                <Col>
                  <Text style={styles.expense.detailText}>{expense.type}</Text>
                </Col>
              </Grid>
              <Grid>
                <Col>
                  <Text style={styles.expense.detailText}>Amount</Text>
                </Col>
                <Col>
                  <Text style={styles.expense.detailText}>
                    {expense.amount}$
                  </Text>
                </Col>
              </Grid>
            </Body>
          </CardItem>
        )}
      </Card>
    );
  }
}

export default ExpenseLine;
