import React, { Component } from "react";
import { FlatList, TouchableOpacity, AsyncStorage, View } from "react-native";
import { DrawerActions } from "react-navigation";
import { Container, Content, Icon, Thumbnail, Button, Header, Left, Right, Body, Text } from "native-base";
import MenuItem from "./MenuItem";
import styles from "./styles";
import { routes } from "./config";

import ClientIcon from "../AppHeader/ClientIcon";

import Modal from "react-native-modal";

import { session, getAvatar, getCourses } from "../../../api/session";

import AppStatus from "@components/AppHeader/AppStatus";

const courseOverviewRoute = "CourseOverview";

class SideBar extends Component {
    state = {
        selected: "",
        ready: false,
        avatarReady: false,
        mainDrawer: true,
        courses: [],
        iconReady: false,
        descriptionReady: false,
        nameReady: false,
        modal: false,
    };
    onPressItem = route => {
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
        if (Number.isInteger(parseInt(route))) {
            this.props.navigation.navigate(courseOverviewRoute, {
                courseId: parseInt(route)
            });
        } else {
            this.props.navigation.navigate(route);
        }
    };

    toggleMainMenu = () => {
        this.setState({
            mainDrawer: !this.state.mainDrawer
        });
    };

    renderMenuItem = ({ item }) => {
        if (item.courseId != "") {
            return (
                <MenuItem
                    id={item.courseId}
                    onPressItem={this.onPressItem}
                    selected={this.state.selected === item.route}
                    title={item.title}
                    icon={item.icon}
                />
            );
        }
        return (
            <MenuItem
                id={item.route}
                onPressItem={this.onPressItem}
                selected={this.state.selected === item.route}
                title={item.title}
                icon={item.icon}
            />
        );
    };

    componentDidMount = () => {
        // console.log("Imprimiendo rutas desde el archivo: ", routes);
        this.loadCourses();

        session.getClientIconUrl().then(icon => {
            this.setState({
                iconReady: true,
                icon
            });
        });
        session.getClientDescription().then(description => {
            this.setState({
                descriptionReady: true,
                description
            });
        });
        session.getClientName().then(name => {
            this.setState({
                nameReady: true,
                name
            });
        });

        // this.loadAvatar();
    };

    changeModalVisibility = () => {
        this.setState({
            modal: !this.state.modal
        });
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
                            <Button transparent onPress={() => navigation.dispatch(DrawerActions.toggleDrawer({}))}>
                                <Icon type="SimpleLineIcons" name="arrow-left" style={styles.header.icon} />
                            </Button>
                        </Left>
                        <Body
                            style={{
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                // backgroundColor: "green",
                                flex: 1,
                                borderRadius: 10,
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    // paddingTop: "3%",
                                    flex: 1,
                                    // backgroundColor: "black",
                                    flexDirection: "row",
                                    // backgroundColor: "rgba(0, 0, 0, 0.3)",
                                    // borderRadius: 10,
                                    flexWrap: "wrap",
                                    padding: 5,
                                    // padding: "3%"
                                }}
                                onPress={this.changeModalVisibility}
                            >
                                {this.state.iconReady && (
                                    <Thumbnail
                                        source={this.state.icon}
                                        square
                                        style={{
                                            width: 45,
                                            height: 45,
                                            resizeMode: "stretch",
                                            borderRadius: 10,
                                        }}
                                    />
                                )}
                                <Text
                                    style={{
                                        fontSize: 16,
                                        textAlign: "center",
                                        flex: 1,
                                        fontFamily: "Roboto_light",
                                        // fontSize: 22,
                                        color: "#FFF",
                                    }}
                                >
                                    {this.state.nameReady ? this.state.name : "."}
                                </Text>
                            </TouchableOpacity>
                            {/* <Modal
                                isVisible={this.state.modal}
                                animationIn="slideInLeft"
                                animationOut="slideOutLeft"
                                animationInTiming={300}
                                animationOutTiming={300}
                                swipeDirection="down"
                                // style={styles.bottomModal}
                            >
                                <View
                                    style={{
                                        backgroundColor: "white",
                                        padding: 22,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 4,
                                        borderColor: "rgba(0, 0, 0, 0.1)",
                                        flexDirection: "column"
                                    }}
                                >
                                    <Text>{this.state.descriptionReady ? this.state.description : "."}</Text>
                                    <Button
                                        onPress={
                                            this.changeModalVisibility
                                        }
                                    >
                                        <Text>Cerrar información</Text>
                                    </Button>
                                </View>
                            </Modal> */}
                            {/* <ClientIcon /> */}
                            {/* <AppStatus navigation={this.props.navigation} /> */}
                        </Body>
                        {/* <Right style={{
                            backgroundColor: 'green',
                        }}></Right> */}
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
                        <Left>
                            <Button transparent onPress={this.toggleMainMenu}>
                                <Icon type="SimpleLineIcons" name="arrow-left" style={styles.header.icon} />
                            </Button>
                        </Left>
                        <Body>
                            <Button transparent onPress={this.toggleMainMenu}>
                                <Text numberOfLines={1} style={styles.menuItem.title}>
                                    Volver Atrás
                                </Text>
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
