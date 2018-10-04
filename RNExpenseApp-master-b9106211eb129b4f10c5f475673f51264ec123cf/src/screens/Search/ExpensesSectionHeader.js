import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Body, Text, Icon } from 'native-base';

import styles from './styles';

const ExpensesSectionHeader = ({ section }) => {
  return (
    <ListItem itemDivider style={styles.sectionHeader.container}>
      <Icon name="md-arrow-dropdown" style={styles.sectionHeader.caret} />
      <Body>
        <Text style={styles.sectionHeader.text}>{section.date}</Text>
      </Body>
    </ListItem>
  );
};

ExpensesSectionHeader.propTypes = {
  section: PropTypes.shape({
    date: PropTypes.string,
  }).isRequired,
};

export default ExpensesSectionHeader;
