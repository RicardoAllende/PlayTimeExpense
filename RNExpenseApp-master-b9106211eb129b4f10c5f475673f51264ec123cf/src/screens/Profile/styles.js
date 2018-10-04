import { Platform } from 'react-native';
import theme from '@theme/variables/myexpense';

export default {
  container: {
    flex: 1,
    width: null,
    height: null,
  },
  content: {
    backgroundColor: '#FFF',
  },
  separator: {
    borderColor: '#EDEDED',
    borderWidth: 0,
    borderTopWidth: 0.8,
  },
  profile: {
    container: {
      alignSelf: 'center',
      paddingTop: 10,
      marginBottom: 15,
    },
    avatar: {
      alignSelf: 'center',
      marginTop: 20,
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    title: {
      fontFamily: 'Roboto_light',
      alignSelf: 'center',
      fontSize: 28,
      color: '#FFF',
    },
    subTitle: {
      fontFamily: 'Roboto_light',
      alignSelf: 'center',
      paddingTop: 10,
      fontSize: 24,
      opacity: Platform.OS === 'android' ? 0.6 : 0.95,
      fontWeight: '100',
      color: '#FFF',
    },
  },
  overview: {
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 10,
      backgroundColor: '#FAFAFB',
    },
    column: {
      justifyContent: 'center',
    },
    title: {
      alignSelf: 'center',
      fontSize: 24,
      marginBottom: 5,
    },
    subtitle: {
      color: 'gray',
      fontSize: 10,
      fontWeight: '200',
      alignSelf: 'center',
      paddingBottom: 0,
    },
    marker: {
      alignSelf: 'center',
      borderWidth: 2,
      paddingTop: 0,
      marginTop: 10,
      paddingLeft: 5,
      paddingRight: 5,
    },
  },
  contact: {
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: 15,
      marginBottom: 15,
      paddingLeft: 10,
      backgroundColor: '#FFF',
    },
    icon: {
      color: theme.brandSuccess,
      fontSize: 30,
    },
    nameColumn: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    nameText: {
      color: 'gray',
      fontSize: 14,
      fontWeight: '200',
    },
    valueColumn: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: 5,
    },
    valueText: {
      fontSize: 16,
    },
  },
  social: {
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 15,
      paddingBottom: 15,
      paddingLeft: 30,
      paddingRight: 30,
    },
    icon: {
      alignSelf: 'center',
      fontSize: 24,
      marginBottom: 5,
      color: '#777',
    },
  },
};
