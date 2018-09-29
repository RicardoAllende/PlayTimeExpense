import { Platform } from 'react-native';
import theme from '@theme/variables/myexpense';

export default {
  background: {
    flex: 1,
    width: theme.deviceWidth,
    height: theme.deviceHeight,
  },
  content: {
    backgroundColor: '#FFF',
  },
  form: {
    flex: 1,
    width: '100%',
  },

  iconExplorer: {
    container: {
      justifyContent: 'center',
      height: 70,
      width: theme.deviceWidth / 6,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderRightWidth: 1,
      borderColor: '#ddd',
    },
    icon: {
      fontSize: 35,
      alignSelf: 'center',
      color: theme.dropdownLinkColor,
    },
  },

  footer: {
    flexDirection: 'column',
    height: 120,
  },

  formError: {
    color: theme.brandDanger,
    fontSize: Platform.OS === 'android' ? 12 : 15,
    paddingRight: 5,
    textAlign: 'right',
  },

  iconSelect: {
    container: {
      height: 70,
      paddingLeft: 15,
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    },
    categoryIcon: {
      fontSize: 42,
      color: theme.dropdownLinkColor,
      alignSelf: 'center',
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      padding: 30,
      margin: 30,
    },
    text: {
      alignSelf: 'flex-start',
      color: theme.inputColorPlaceholder,
    },
    icon: {
      alignSelf: 'flex-end',
      marginRight: 5,
      paddingLeft: 5,
      color: theme.inputColorPlaceholder,
    },
  },
};
