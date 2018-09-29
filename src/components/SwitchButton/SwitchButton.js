import React from 'react';
import { View, Text, Switch } from 'native-base';

import styles from './styles';
import theme from '@theme/variables/myexpense';

var Color = require('color');
const light = Color(theme.brandPrimary).alpha(0.4);

const SwitchButton = ({ ...props }) => {
  return (
    <View style={styles.switchContainer}>
      <Text style={styles.switchText}>{props.label}</Text>
      <Switch
        style={styles.switch}
        onTintColor={light}
        thumbTintColor={theme.brandPrimary}
        tintColor={theme.brandPrimary}
        onValueChange={props.onValueChange}
        value={props.value}
      />
    </View>
  );
};

export default SwitchButton;
