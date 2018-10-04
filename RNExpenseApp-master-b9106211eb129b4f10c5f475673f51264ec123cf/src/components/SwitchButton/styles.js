const React = require('react-native');

const { StyleSheet } = React;

module.exports = StyleSheet.create({
  switchContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 10,
    paddingRight: 0,
  },
  switchText: {
    color: '#95959A',
    paddingTop: 5,
    paddingRight: 15,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
