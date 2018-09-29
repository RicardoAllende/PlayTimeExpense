import React from 'react';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation';
import SignUp from '@screens/SignUp/';
import SignIn from '@screens/SignIn/';
import ResetPassword from '@screens/ResetPassword';
import Walkthrough from '@screens/Walkthrough/';
import SideBar from '@components/SideBar';
import Expenses from '@screens/Expenses/';
import NewExpense from '@screens/NewExpense/ExpenseForm';
import Categories from '@screens/Categories/';
import NewCategory from '@screens/NewCategory/CategoryForm';
import ExpensesCharts from '@screens/ExpensesCharts';
import ExpensesCalendar from '@screens/ExpensesCalendar';
import Settings from '@screens/Settings';
import Search from '@screens/Search';
import Profile from '@screens/Profile';

const Drawer = createDrawerNavigator(
  {
    Expenses: { screen: Expenses },
    Categories: { screen: Categories },
    ExpensesCalendar: { screen: ExpensesCalendar },
    ExpensesCharts: { screen: ExpensesCharts },
    Search: { screen: Search },
    Settings: { screen: Settings },
    Profile: { screen: Profile },
    SignIn: { screen: SignIn },
  },
  {
    initialRouteName: 'Expenses',
    drawerBackgroundColor: 'rgba(255, 255, 255, 0.3)',
    contentComponent: props => <SideBar {...props} />,
  }
);

const AppNavigation = createStackNavigator(
  {
    SignIn: { screen: SignIn },
    SignUp: { screen: SignUp },
    ResetPassword: { screen: ResetPassword },
    Walkthrough: { screen: Walkthrough },
    NewExpense: { screen: NewExpense },
    NewCategory: { screen: NewCategory },
    Drawer: { screen: Drawer },
  },
  {
    index: 0,
    initialRouteName: 'SignIn',
    headerMode: 'none',
  }
);

export default AppNavigation;
