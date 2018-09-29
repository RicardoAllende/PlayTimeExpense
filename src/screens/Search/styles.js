import theme from '@theme/variables/myexpense';

export default {
  container: {
    flex: 1,
    width: null,
    height: null,
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
  },
  sectionHeader: {
    container: {
      paddingLeft: 0,
    },
    text: {
      textAlign: 'left',
    },
    caret: {
      position: 'absolute',
      left: 20,
      bottom: -20,
      color: '#F4F4F4',
    },
  },
  expense: {
    container: {
      elevation: 0,
      marginBottom: 0,
      marginTop: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0.7,
      borderColor: '#ddd',
    },
    content: {
      paddingTop: 14,
      paddingBottom: 14,
    },
    title: {
      fontSize: 14,
      color: '#777',
    },
    expenseAmount: {
      marginRight: 10,
      fontSize: 14,
      color: theme.brandPrimary,
    },
    incomeAmount: {
      marginRight: 10,
      fontSize: 14,
      color: theme.brandSuccess,
    },
    detailText: {
      fontSize: 12,
      color: '#777',
    },
  },
};
