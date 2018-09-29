import { Platform } from 'react-native';

export default {
  header: {
    container: {
      marginTop: 23,
      backgroundColor: '#fff',
    },
    icon: {
      color: '#D8D8D8',
      fontSize: 26,
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: Platform.OS === 'android' ? 40 : 20,
    },
  },
  content: {
    paddingTop: Platform.OS === 'android' ? 20 : 30,
    backgroundColor: '#fff',
  },
  menuItem: {
    container: {
      borderColor: 'rgba(29, 29, 38, 0.1)',
      marginLeft: 0,
    },
    selected: {
      backgroundColor: '#F8F8F8',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      padding: 15,
      borderBottomWidth: 0.8,
      borderColor: 'rgba(29, 29, 38, 0.1)',
    },
    title: {
      fontFamily: 'Roboto_light',
      color: '#444',
    },
    icon: {
      textAlign: 'center',
      width: 30,
      marginRight: 10,
      color: '#444',
      fontSize: Platform.OS === 'android' ? 25 : 30,
    },
  },
};
