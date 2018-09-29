import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon, Grid, Col } from 'native-base';
import PropTypes from 'prop-types';

import styles from './styles';

const Contact = ({ type, name, number }) => {
  const iconName = type === 'phone' ? 'ios-call' : 'ios-mail';
  return (
    <View style={[styles.contact.container]}>
      <Grid>
        <Col size={1} style={{ alignItems: 'center' }}>
          <TouchableOpacity>
            <Icon name={iconName} style={[styles.contact.icon]} />
          </TouchableOpacity>
        </Col>
        <Col size={4}>
          <View>
            <View style={styles.contact.valueColumn}>
              <Text style={styles.contact.valueText}>{number}</Text>
            </View>
            <View style={styles.contact.nameColumn}>
              {name.trim().length !== 0 && (
                <Text style={styles.contact.nameText}>{name}</Text>
              )}
            </View>
          </View>
        </Col>
        <Col size={1}>
          <TouchableOpacity>
            <Icon name="ios-chatboxes-outline" />
          </TouchableOpacity>
        </Col>
      </Grid>
    </View>
  );
};

Contact.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  number: PropTypes.string.isRequired,
};

Contact.defaultProps = {
  name: null,
};

export default Contact;
