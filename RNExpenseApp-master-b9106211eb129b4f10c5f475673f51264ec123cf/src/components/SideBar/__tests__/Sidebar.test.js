import React from 'react';
import renderer from 'react-test-renderer';
import { TouchableOpacity } from 'react-native';
import { Content } from 'native-base';
import Sidebar from '../index';
it('renders correctly', () => {
  const tree = renderer.create(<Sidebar />).toJSON();
  expect(tree).toMatchSnapshot();
});
it('navigates to the sub routes', () => {
  const props = {
    navigation: {
      navigate: jest.fn(),
    },
  };
  const testRenderer = renderer.create(<Sidebar {...props} />);
  const instance = testRenderer.root;
  const content = instance.findByType(Content);
  const listItems = content.findAllByType(TouchableOpacity);
  listItems.forEach(item => item.props.onPress());
  expect(props.navigation.navigate.mock.calls).toEqual([
    ['Expenses'],
    ['Categories'],
    ['ExpensesCalendar'],
    ['ExpensesCharts'],
    ['Search'],
    ['Profile'],
    ['Settings'],
    ['SignIn'],
  ]);
});
