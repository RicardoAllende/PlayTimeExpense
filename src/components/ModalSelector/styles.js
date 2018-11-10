import theme from '@theme/variables/myexpense';

export default {
  item: {
    content: {
      flex: 1,
      elevation: 0,
      flexDirection: 'column',
      paddingTop: 20,
      paddingBottom: 20,
      paddingRight: 15,
      paddingLeft: 15,
      borderLeftWidth: 5,
      borderRightWidth: 0,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderRadius: 0,
    },
    icon: {
      textAlign: 'center',
      color: '#BBBBBE',
      width: 30,
    },
    title: {
      fontSize: 16,
      color: '#444',
      marginLeft: 15,
    },
    subtitle: {
      fontSize: 10,
      color: '#777',
      marginLeft: 15,
    },
    expenseAmount: {
      fontSize: 14,
      color: theme.brandPrimary,
      alignSelf: 'flex-end',
    },
    incomeAmount: {
      fontSize: 14,
      color: theme.brandSuccess,
      alignSelf: 'flex-end',
    },
    swipeBtn: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
};
