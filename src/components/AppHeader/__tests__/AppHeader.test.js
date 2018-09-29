import React from 'react';
import renderer from 'react-test-renderer';

import AppHeader from '../index';

describe('Components : AppHeader', () => {
  it('renders correctly', () => {
    const props = {
      navigation: { navigate: jest.fn(), dispatch: jest.fn() },
      style: {},
      title: 'Expenses',
      titleSuffix: 'June',
      subTitle: 'Manage your money',
      displayAvatar: true,
      displayLogo: true,
    };
    const tree = renderer.create(<AppHeader {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
