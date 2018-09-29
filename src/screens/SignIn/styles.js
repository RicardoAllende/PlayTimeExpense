import theme from '@theme/variables/myexpense';
export default {
  background: {
    flex: 1,
    width: null,
    height: null,
  },
  header: {
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      height: theme.deviceHeight / 2 - 20,
    },
    logo: {
      resizeMode: 'contain',
      width: 150,
    },
  },
  resetPwdBtn: {
    opacity: 0.9,
    fontSize: 14,
    color: '#FFF',
    textAlign: 'right',
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'column',
    height: 120,
  },
  signup: {
    linkText: {
      opacity: 0.7,
      fontSize: 14,
      color: '#FFF',
      textAlign: 'right',
      marginRight: 0,
      paddingRight: 0,
    },
    linkBtn: {
      opacity: 0.9,
      fontSize: 14,
      color: '#FFF',
      textAlign: 'left',
      marginLeft: 5,
      paddingLeft: 0,
    },
  },
};
