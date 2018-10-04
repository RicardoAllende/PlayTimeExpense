import { Platform } from 'react-native';
import theme from '@theme/variables/myexpense';

export default {
  background: {
    flex: 1,
    width: theme.deviceWidth,
    height: theme.deviceHeight,
  },
  footer: {
    flexDirection: 'column',
    height: 120,
  },
  picker: {
    item: {
      borderColor: '#F6F6F6',
      paddingLeft: Platform.OS === 'android' ? 8 : 0,
    },
    input: {
      width: theme.deviceWidth,
      height: 70,
    },
    icon: {
      color: '#95959A',
    },
    headerTextStyle: {
      color: '#FFF',
      fontSize: 14,
    },
    placeholderText: {
      color: theme.inputColorPlaceholder,
      fontSize: theme.DefaultFontSize,
    },
    itemStyle: {
      backgroundColor: '#FFF',
    },
    itemTextStyle: {
      color: theme.dropdownLinkColor,
    },
  },

  datePicker: {
    formItem: {
      borderColor: '#F6F6F6',
      marginRight: 0,
    },
    container: {
      width: '100%',
      height: 70,
      justifyContent: 'center',
    },
    dateInput: {
      borderWidth: 0,
      paddingLeft: 15,
    },
    dateTouchBody: {
      paddingBottom: 0,
    },
    dateText: {
      alignSelf: 'flex-start',
      fontSize: theme.DefaultFontSize,
    },
    dateIcon: {
      color: '#95959A',
      paddingRight: Platform.OS === 'android' ? 11 : 16,
    },
    placeholderText: {
      alignSelf: 'flex-start',
      color: theme.inputColorPlaceholder,
      fontSize: theme.DefaultFontSize,
    },
  },

  switch: {
    item: {
      paddingLeft: 0,
      paddingRight: Platform.OS === 'android' ? 0 : 11,
      borderColor: '#F6F6F6',
    },
    input: {
      paddingLeft: 15,
      height: 70,
    },
    switch: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
  },

  formError: {
    color: theme.brandDanger,
    fontSize: Platform.OS === 'android' ? 12 : 15,
    paddingRight: 5,
    textAlign: 'right',
  },
};
