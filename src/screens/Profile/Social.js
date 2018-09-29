import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

import styles from './styles';

const Social = () => {
  return (
    <View style={[styles.social.container]}>
      <TouchableOpacity>
        <Icon name="logo-twitter" style={styles.social.icon} />
      </TouchableOpacity>
      <View style={{ padding: 20 }} />
      <TouchableOpacity>
        <Icon name="logo-facebook" style={styles.social.icon} />
      </TouchableOpacity>
      <View style={{ padding: 20 }} />
      <TouchableOpacity>
        <Icon name="logo-instagram" style={styles.social.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Social;
