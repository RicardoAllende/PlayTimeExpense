import { Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  background: {
    flex: 1,
    width: null,
    height: null,
  },
  content: {
    // backgroundColor: '#FFF',
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
  categoryBox: {
    padding: 5,
    justifyContent: 'center',
    // height: deviceHeight / 4,
    // width: deviceWidth / 2,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  categoryIcon: {
    fontSize: 35,
    alignSelf: 'center',
    color: '#c9c9c9',
  },
  categoryTitle: {
    fontSize: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    color: '#1D1D26',
    paddingBottom: 15,
  },
  categoryAmount: {
    fontSize: 14,
    alignSelf: 'center',
    color: '#8E8E93',
  },
  categoryLine: {
    borderBottomWidth: 3,
    paddingTop: 3,
    width: 25,
    alignSelf: 'center',
  },
  flatList: {
    flex: 1,
    padding: 20,
  }
};
