import { Dimensions } from 'react-native';
const deviceHeight = Dimensions.get('window').height;

import theme from '@theme/variables/myexpense';

export default {
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  content: {
    backgroundColor: 'transparent',
  },
  emptyContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMsg: {
    color: '#777',
    fontSize: 18,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  agenda: {
    container: {
      height: deviceHeight,
    },
    item: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 3,
      marginRight: 10,
      marginLeft: 0,
      marginTop: 10,
    },
    knobText: {
      color: theme.brandInfo,
      fontSize: 13,
    },
    knobIcon: {
      color: theme.brandInfo,
      paddingLeft: 5,
      paddingTop: 2,
      fontSize: 20,
    },
  },
};
