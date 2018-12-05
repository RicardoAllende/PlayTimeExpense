import React from "react";
import { View, TouchableOpacity, Linking } from "react-native";
import { Icon } from "native-base";
import { makeFBLink, makeLinkedInLink, makeTwitterLink } from "../../../api/helpers";
import { api } from "../../../api/playTimeApi";

const fbLink = makeFBLink(api.invitation_url)
const twitterLink = makeTwitterLink('Descarga la aplicación en ' + api.invitation_url)
const linkedInLink = makeLinkedInLink(api.invitation_url, 'Descarga la aplicación', 'Playtime es una aplicación ...')

function openInBrowser(link){
    Linking.openURL(link)
}

import styles from "./styles";

const Social = () => {
    return (
        <View style={[styles.social.container]}>
            <TouchableOpacity
                onPress={() => {
                    openInBrowser(twitterLink)
                }}
            >
                <Icon name="logo-twitter" style={styles.social.icon} />
            </TouchableOpacity>
            <View style={{ padding: 20 }} />
            <TouchableOpacity
                onPress={() => {
                    openInBrowser(fbLink)
                }}
            >
                <Icon name="logo-facebook" style={styles.social.icon} />
            </TouchableOpacity>
            <View style={{ padding: 20 }} />
            <TouchableOpacity
                onPress={() => {
                    openInBrowser(linkedInLink)
                }}
            >
                <Icon name="logo-linkedin" style={styles.social.icon} />
            </TouchableOpacity>
        </View>
    );
};

export default Social;
