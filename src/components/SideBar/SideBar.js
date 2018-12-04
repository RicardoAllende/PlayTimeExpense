import React, { Component } from "react";
import { FlatList, TouchableOpacity, AsyncStorage, View } from "react-native";
import { DrawerActions } from "react-navigation";
import { Container, Content, Icon, Thumbnail, Button, Header, Left, Right, Body, Text } from "native-base";
import MenuItem from "./MenuItem";
import styles from "./styles";
import { routes } from "./config";

import { session, getAvatar, getCourses } from "../../../api/session";

import AppStatus from "@components/AppHeader/AppStatus";

const courseOverviewRoute = 'CourseOverview'

class SideBar extends Component {
    state = {
        selected: "",
        ready: false,
        avatarReady: false,
        mainDrawer: true,
        courses: []
    };
    onPressItem = (route) => {
        if (route == "CourseList") {
            this.toggleMainMenu();
            return;
        }
        if (route == "SignIn") {
            session.unsetBearerToken();
        }
        this.setState(() => ({
            selected: route
        }));
        if(Number.isInteger(parseInt(route))){
            this.props.navigation.navigate(courseOverviewRoute, {
                courseId: parseInt(route)
            });
        }else{
            this.props.navigation.navigate(route);
        }
    };

    toggleMainMenu = () => {
        this.setState({
            mainDrawer: !this.state.mainDrawer
        });
    };

    renderMenuItem = ({ item }) => {
        if(item.courseId != ''){
            return  <MenuItem
                        id={item.courseId}
                        onPressItem={this.onPressItem}
                        selected={this.state.selected === item.route}
                        title={item.title}
                        icon={item.icon}
                    />
        }
        return  <MenuItem
                    id={item.route}
                    onPressItem={this.onPressItem}
                    selected={this.state.selected === item.route}
                    title={item.title}
                    icon={item.icon}
                />
    }

    componentDidMount = () => {
        // console.log("Imprimiendo rutas desde el archivo: ", routes);
        this.loadCourses();
        // this.loadAvatar();
    };

    loadCourses = () => {
        courses = [];
        getCourses().then(courses => {
            coursesList = courses.map(course => {
                return {
                    id: "course" + course.id,
                    title: course.name,
                    route: "CourseOverView",
                    icon: "ios-book",
                    courseId: course.id
                };
            });
            this.setState({
                courses: coursesList
            });
        });
    };

    loadAvatar = () => {
        getAvatar().then(avatar => {
            this.setState({
                avatar,
                avatarReady: true
            });
        });
    };

    render() {
        const navigation = this.props.navigation;
        if (this.state.mainDrawer) {
            return (
                <Container style={{ backgroundColor: "transparent" }}>
                    <Header transparent style={styles.header.container}>
                        <Left>
                            {/* <Left style={{ flex: 1 }}> */}
                            <Button transparent onPress={() => navigation.dispatch(DrawerActions.toggleDrawer({}))}>
                                <Icon type="SimpleLineIcons" name="arrow-left" style={styles.header.icon} />
                            </Button>
                        </Left>
                        <Right style={{ flex: 1 }}>
                            {/* <AppStatus navigation={navigation} /> */}
                            {/* <TouchableOpacity
                                style={{ alignSelf: 'flex-end' }}
                                onPress={() => {
                                    navigation.navigate('Profile');
                                }}>
                                {
                                    this.state.avatarReady &&
                                    (
                                    <Thumbnail 
                                    // source={avatar} 
                                    // source={require('@assets/images/default_avatar.png')}
                                    source={{
                                        uri: this.state.avatar,
                                        cache: 'only-if-cached',
                                    }}
                                    style={styles.avatar} />
                                    )
                                }
                            </TouchableOpacity> */}
                        </Right>
                    </Header>
                    <Content style={styles.content}>
                        <FlatList
                            initialNumToRender={8}
                            data={routes}
                            renderItem={this.renderMenuItem}
                            keyExtractor={item => item.id}
                        />
                    </Content>
                </Container>
            );
        } else {
            return (
                <Container style={{ backgroundColor: "transparent" }}>
                    <Header transparent style={styles.header.container}>
                        {/* <Icon name="ios-arrow-back" size={25} style={styles.menuItem.icon} color="#666666" /> */}
                        <Left>
                            <Button transparent onPress={this.toggleMainMenu}>
                                <Icon type="SimpleLineIcons" name="arrow-left" style={styles.header.icon} />
                            </Button>
                        </Left>
                        <Body>
                            <Button transparent onPress={this.toggleMainMenu}>
                                <Text style={styles.menuItem.title}>Volver Atrás</Text>
                            </Button>
                        </Body>
                    </Header>
                    <Content style={styles.content}>
                        <FlatList
                            initialNumToRender={8}
                            data={this.state.courses}
                            renderItem={this.renderMenuItem}
                            keyExtractor={item => item.id}
                        />
                    </Content>
                </Container>
            );
        }
    }
}
export default SideBar;
