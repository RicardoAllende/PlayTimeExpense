import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation, DrawerActions } from 'react-navigation';
import { Button, Icon } from 'native-base';

const HeaderDrawerButton = ({ navigation }) => {
  return (
    <Button
      transparent
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer({}))}>
      <Icon
        active
        type="SimpleLineIcons"
        name="menu"
        style={{ fontSize: 26 }}
      />
    </Button>
  );
};

HeaderDrawerButton.propTypes = {
  navigation: PropTypes.shape({ dispatch: PropTypes.func.isRequired }),
};

export default withNavigation(HeaderDrawerButton);
