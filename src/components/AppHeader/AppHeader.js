import React, { PureComponent } from "react";
import { TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import { View, Text, Icon, Left, Right, Thumbnail, Body, Button, Header } from "native-base";

import HeaderDrawerButton from "./HeaderDrawerButton";
import SearchHeader from "./SearchHeader";

import { getAvatar, session } from "../../../api/session";
import theme from "@theme/variables/myexpense";
import AppStatus from "./AppStatus";
import ClientIcon from './ClientIcon'

import styles from "./styles";
import CountdownCircle from "react-native-countdown-circle";

class AppHeader extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            displaySearchBar: false,
            seconds: this.props.seconds,
            questionId: this.props.questionId,
            clienInconReady: false,
            creditsReady: false
        };
        this.clientIcon = null
    }

    restartCountDown = () => {
        this.props._handleNextAnswer();
        this.setState({ seconds: 0 }, () => {
            this.setState({ seconds: this.props.seconds });
            console.log("Segundos establecidos en", this.state.seconds);
        });
    };

    _onTimeElapsed = () => {
        this.props._handleNextAnswer();
        this.restartCountDown();
    };

    componentDidMount = () => {
        // this.loadCredits();
        // this.loadClientIcon();
    };

    loadCredits = () => {
        session.getCredits().then(credits => {
            console.log("Se obtuvieron los siguientes créditos", credits);
            alert(`Se obtuvieron los siguientes créditos ${credits}`);
        });
    };

    // loadClientIcon = () => {
    //     session.getClientIconUrl().then(icon => {
    //         this.clientIcon = icon
    //         this.setState({
    //             clienInconReady: true,
    //         })
    //     })
    // }

    render() {
        if (typeof this.props.hideStatus !== "undefined") {
            status = null;
        } else {
            status = <AppStatus navigation={this.props.navigation} />;
        }
        // if(this.state.clienInconReady){
        //     const imageUrl = this.clientIcon
        // }else{
        //     const imageUrl = null
        // }
        return (
            <View style={this.props.style}>
                <Header transparent hasTabs>
                    <Left style={{ flex: 1 }}>
                        <HeaderDrawerButton navigation={this.props.navigation} />
                    </Left>
                    <Body style={{ flex: 1, alignItems: "center", paddingTop: "3%" }}>
                        {/* {this.props.displayLogo && (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Expenses');
                }}>
                <Image source={logo} style={styles.logo} />
              </TouchableOpacity>
            )} */}
                        {status}
                        {/* <AppStatus navigation={this.props.navigation} /> */}
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {/* {this.props.displayAvatar && (
                            <ClientIcon />
                            // <TouchableOpacity
                            //     onPress={() => {
                            //         this.props.navigation.navigate('Profile');
                            //     }}>
                            //     {
                            //         this.state.clienInconReady &&
                            //         (
                            //             <Thumbnail
                            //                 square
                            //                 resizeMode='contain'
                            //                 // circle={false}
                            //                 // source={avatar} 
                            //                 // source={require('@assets/images/default_avatar.png')}
                            //                 source={Image}
                            //                 // style={styles.avatar} 
                            //                 />
                            //         )
                            //     }
                            // </TouchableOpacity>
                        )} */}
                        {this.props.displaySearch && (
                            <Button
                                transparent
                                onPress={() => {
                                    this.setState(() => ({
                                        displaySearchBar: !this.state.displaySearchBar
                                    }));
                                }}
                            >
                                <Icon active name="ios-search" style={{ fontSize: 34 }} />
                            </Button>
                        )}
                    </Right>
                </Header>
                {this.props.title && (
                    <View style={styles.titles.container}>
                        <View style={styles.titles.content}>
                            <Text style={styles.titles.text}>{this.props.title}</Text>
                            {this.props.titleSuffix && (
                                <Text note style={styles.titles.suffix}>
                                    {" " + this.props.titleSuffix}
                                </Text>
                            )}
                        </View>
                        {this.props.subTitle && (
                            <Text note style={styles.titles.subTitle}>
                                {this.props.subTitle}
                            </Text>
                        )}
                    </View>
                )}
                {this.props.onlySubTitle && (
                    <View style={styles.titles.container}>
                        <Text note style={[styles.titles.subTitle, { fontSize: 13, textAlign: 'center' }]}>
                            {this.props.onlySubTitle}
                        </Text>
                    </View>
                )}
                {this.state.displaySearchBar && (
                    <SearchHeader onSearch={this.props.onSearch} onExport={this.props.onExport} />
                )}
            </View>
        );
    }
}

AppHeader.propTypes = {
    navigation: PropTypes.shape({ navigate: PropTypes.func.isRequired }),
    title: PropTypes.string,
    titleSuffix: PropTypes.string,
    subTitle: PropTypes.string,
    style: PropTypes.object,
    displayAvatar: PropTypes.bool,
    displaySearch: PropTypes.bool,
    displayLogo: PropTypes.bool,
    onSearch: PropTypes.func,
    onExport: PropTypes.func
};

AppHeader.defaultProps = {
    displayAvatar: true,
    displayLogo: true,
    displaySearch: false,
    titleSuffix: " "
};

export default AppHeader;
