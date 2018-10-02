import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Alert } from 'react-native';
import {
  Container,
  Content,
  Fab,
  Icon,
  Text,
  View,
  Spinner,
  TouchableOpacity,
} from 'native-base';
import { connect } from 'react-redux';
import { formatAmount } from '@utils/formatters';

import AppHeader from '@components/AppHeader';
import Category from './Category';
import categoryColors from '@theme/categoryColors';

import * as actions from './behaviors';
import * as categoriesSelectors from './selectors';

import styles from './styles';
import theme from '@theme/variables/myexpense';

const url = "http://192.168.0.111:8000/categories"
const defaultTime = 10;

class Categories extends Component {

    constructor(props){
        super(props)
        this.state = {
            ready: false,
            categories: [],
            corrects: 0,
            answers: 0,
            currentQuestion: 0,
            seconds: defaultTime,
            skippedQuestions: []
        }
    }

  static propTypes = {
    navigation: PropTypes.any,
    getCategories: PropTypes.func.isRequired,
    categoriesLoading: PropTypes.bool.isRequired,
    categoriesError: PropTypes.bool.isRequired,
    categories: PropTypes.array,
  };

  static defaultProps = {
    categoriesLoading: false,
    categoriesError: false,
    categories: [],
  };

  componentDidMount() {
    this.initialize();
  }

  initialize = () => {
    this.props.getCategories();
  };

  loadData = () => {
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
        this.setState({
            categories: responseJson,
            ready: true
        }, () => console.log(this.state.categories) )
        // return responseJson.movies;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _renderOption = (element) => {
    const { navigation } = this.props;
    console.log(element)
    index = element.index
    category = element.item
    // category = element.item
    return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Expenses')}>
          <View style={styles.categoryBox}>
            <Icon name={category.iconName} style={styles.categoryIcon} />
            <Text style={styles.categoryTitle}>{category.name}</Text>
            <Text style={styles.categoryAmount}>
              {' '}
              {formatAmount(category.amount)}
            </Text>
            <View
              style={styles.categoryLine}
              borderColor={categoryColors[index % categoryColors.length]}
            />
          </View>
        </TouchableOpacity>
    );
  }

    itemSeparatorComponent = () => {
        return <View style = {
            {
                height: 10,
                width: '100%',
                // backgroundColor: 'red',
            }
        }
        />
    }

  render() {
    const { navigation, categories, categoriesLoading } = this.props;
    // console.log(categories)
    if(!this.state.ready){
        this.loadData();
        return (<Text>
                Cargando preguntas
            </Text>);
    }
    return (
      <Container>
        <ImageBackground
          source={require('@assets/images/header-bg.png')}
          style={styles.background}>
          <AppHeader
            hasTabs
            navigation={navigation}
            title="Categories"
            subTitle="Manage expense categories"
          />
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flex: 1 }}
            style={styles.content}>
            {!this.state.ready && (
              <View style={styles.emptyContainer}>
                <Spinner color={theme.brandPrimary} />
              </View>
            )}
            {/* {this.state.ready &&
              this.state.categories.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyMsg}>No categories found</Text>
                </View>
              )} */}
            {this.state.ready &&
              this.state.categories.length > 0 && (
                <FlatList
                //   horizontal={false}
                //   numColumns={2}
                  data={ this.state.categories }
                  renderItem={({ ...props }) => (
                    <Category navigation={navigation} {...props} />
                  )}
                  keyExtractor={category => category.id}
                  initialNumToRender={5}
                  style={styles.flatList}
                  ItemSeparatorComponent={this.itemSeparatorComponent}
                />
              )}
          </Content>
          <Fab
            direction="up"
            containerStyle={{}}
            style={{ backgroundColor: theme.brandPrimary }}
            position="bottomRight"
            onPress={() => Alert.alert(
                '¿Desea terminar intento?',
                '¿Desea terminar el intento actual?',
                [
                  {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ],
                { cancelable: false }
              ) }>
            <Icon type="Ionicons" name="exit" />
          </Fab>
        </ImageBackground>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  categories: categoriesSelectors.getCategories(state),
  categoriesLoading: categoriesSelectors.getCategoriesLoadingState(state),
  categoriesError: categoriesSelectors.getCategoriesErrorState(state),
});

const categorias = [
    {
      id: '1',
      name: '¿Cuál es el lugar más frío de la tierra?',
      iconName: 'ios-school-outline',
      percent: 75,
      amount: 375,
    },
    {
      id: '2',
      name: '¿Cuál es el río más largo del mundo?',
      iconName: 'ios-paper-outline',
      percent: 50,
      amount: 250,
    },
    {
      id: '3',
      name: '¿Dónde se originaron los juegos olímpicos?',
      iconName: 'ios-restaurant-outline',
      amount: 175,
      percent: 25,
    },
    {
      id: '4',
      name: '¿Cuándo acabó la II Guerra Mundial?',
      iconName: 'ios-game-controller-b-outline',
      percent: 23,
      amount: 145,
    },
    {
      id: '10',
      name: 'Transport',
      iconName: 'ios-car-outline',
      percent: 22,
      amount: 150,
    },
  ];
  

export default connect(
  mapStateToProps,
  actions
)(Categories);
