import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon, Grid, Col } from 'native-base';
import PropTypes from 'prop-types';

import styles from './styles';

const Email = ({ name, email }) => (
  <View style={[styles.email.container]}>
    <Grid>
      <Col size={1}>
        <TouchableOpacity>
          <Icon name="ios-mail" style={styles.email.emailIcon} />
        </TouchableOpacity>
      </Col>
      <Col size={4}>
        <View style={styles.email.emailRow}>
          <View style={styles.email.emailColumn}>
            <Text style={styles.email.emailText}>{email}</Text>
          </View>
          <View style={styles.email.emailNameColumn}>
            {name.trim().length !== 0 && (
              <Text style={styles.email.emailNameText}>{name}</Text>
            )}
          </View>
        </View>
      </Col>
    </Grid>
  </View>
);

Email.propTypes = {
  email: PropTypes.string.isRequired,
  name: PropTypes.string,
};

Email.defaultProps = {
  name: null,
};

export default Email;
