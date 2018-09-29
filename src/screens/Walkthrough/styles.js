import theme from '@theme/variables/myexpense';

export default {
  background: {
    flex: 1,
    width: null,
    height: null,
  },
  slider: {
    marginTop: 35,
  },
  slide: {
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      paddingTop: 50,
      paddingBottom: 50,
      paddingLeft: 20,
      paddingRight: 20,
      height: '95%',
    },
    illustration: {
      height: 120,
      resizeMode: 'contain',
    },
    illustration: {
      height: 120,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 22,
      padding: 20,
      paddingTop: 40,
      paddingBottom: 40,
      fontWeight: '600',
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: 'Roboto_light',
      fontSize: 16,
      padding: 30,
      paddingTop: 0,
      textAlign: 'center',
    },
    btnWrapper: {
      alignSelf: 'center',
    },
    btnText: {
      color: theme.brandPrimary,
    },
  },
  skipBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    left: 0,
    borderRadius: 0,
  },
};
