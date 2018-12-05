import React, { Component } from "react";

import { View, TouchableOpacity } from "react-native";

import { Thumbnail, Text } from "native-base";

import Modal from "react-native-modal";

import styles from "./styles";

import theme from "@theme/variables/myexpense";

import {session} from '../../../api/session'

export default class ClientIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            iconReady: false,
            descriptionReady: false,
            nameReady: false,
        };
    }

    changeModalVisibility = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    componentDidMount() {
        session.getClientIconUrl().then( icon => {
            this.setState({
                iconReady: true,
                icon
            })
        })
        session.getClientDescription().then( description => {
            this.setState({
                descriptionReady: true,
                description
            })
        })
        session.getClientName().then( name => {
            this.setState({
                nameReady: true,
                name
            })
        })
    }

    render() {
        // console.log("Client Icon rendered");
        // console.log(this.state)
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'purple',
            }}>

                <TouchableOpacity
                    style={{
                        // paddingTop: "3%",
                        flex: 1,
                        backgroundColor: 'white',
                        flexDirection: "row",
                        // backgroundColor: "rgba(0, 0, 0, 0.3)",
                        borderRadius: 4,
                        // padding: "3%"
                    }}
                    onPress={this._onPress}
                >
                    {
                        this.state.iconReady &&
                        <Thumbnail
                            source={this.state.icon}
                        />
                    }
                    <Text style={[styles.titles.text, { fontSize: 10, textAlign: "center", flex: 1, }]}>
                        { this.state.nameReady ? this.state.name : '.' }
                    </Text>
                </TouchableOpacity>
                <Modal
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
                        <Text>
                            {
                                this.state.descriptionReady ?
                                this.state.description
                                :
                                '.'
                            }
                        </Text>
                    </View>
                </Modal>
            </View>
        );
    }
}

//     <View
//         style={{
//             backgroundColor: theme.brandPrimary,
//             opacity: 0.5,
//             borderRadius: 8,
//             flex: 1
//         }}
//     >
//         <TouchableOpacity
//             onPress={this.changeModalVisibility}
//             style={{
//                 flex: 1
//             }}
//         >
//             <View style={{ flex: 1 }}>
//                 <Thumbnail
//                     square
//                     resizeMode="contain"
//                     // circle={false}
//                     // source={avatar}
//                     // source={require('@assets/images/default_avatar.png')}
//                     source={{
//                         height: 100,
//                         uri: "http://192.168.0.117:8000/storage/default_images/logo-subitus.png",
//                         width: 100
//                     }}
//                     style={
//                         {
//                             // backgroundColor:'rgba(255,0,0,0.5)',
//                         }
//                     }
//                     // style={styles.avatar}
//                 />
//                 <Text> INE </Text>
//             </View>
//         </TouchableOpacity>
//         <Modal
//             isVisible={this.state.modal}
//             animationIn="slideInLeft"
//             animationOut="slideOutLeft"
//             animationInTiming={300}
//             animationOutTiming={300}
//             swipeDirection="down"
//             // style={styles.bottomModal}
//         >
//             <View
//                 style={{
//                     backgroundColor: "white",
//                     padding: 22,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 4,
//                     borderColor: "rgba(0, 0, 0, 0.1)",
//                     flexDirection: "column"
//                 }}
//             >
//                 <Text>
//                     El Instituto Nacional Electoral organiza procesos electorales libres, equitativos y
//                     confiables para garantizar el ejercicio de los derechos electorales.
//                 </Text>
//             </View>
//         </Modal>
//     </View>