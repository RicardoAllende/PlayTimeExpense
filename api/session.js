import { AsyncStorage } from "react-native"
import {url} from './playTimeApi'
import { exponentPushTokenUri } from './playTimeApi' 
import { Permissions, Notifications } from 'expo';

const bearerTokenName= "bearerToken";
const userDataName= "userData";
const firstnameDataName = "firstname";
const lastnameDataName = "lastname";
const usernameDataName = "email";
const countdownSecondsDataName = "countdownSeconds"
const coursesDataName = 'courses'
const rememberTokenDataName = 'access'
const avatarDataName = 'avatar'
const avatarThumbnail = 'thumbnail_avatar'
const creditsDataName = 'credits'
const rememberMeDataName = 'rememberMe'
const enableNotificationDataName = 'enableNotifications'
const enableSoundDataName = 'enableSound'

export const session = {
    bearerTokenName: bearerTokenName,
    userDataName: userDataName,
    firstnameDataName: firstnameDataName,
    lastnameDataName: lastnameDataName,
    usernameDataName: usernameDataName,
    rememberTokenDataName,
    avatarDataName,
    countdownSecondsDataName: countdownSecondsDataName,

    setUserName: (username) => {
        AsyncStorage.setItem(usernameDataName, username);
    },

    setFirstAndLastName: (firstname, lastname) => {
        AsyncStorage.setItem(firstname, firstname);
        AsyncStorage.setItem(lastname, lastname);
    },

    setFirstname: (firstname) => {
        AsyncStorage.setItem(firstnameDataName, firstname);
    },

    setLastName: (lastname) => {
        AsyncStorage.setItem(lastnameDataName, lastname)
    },

    setBearerToken: (bearerToken) => {
        AsyncStorage.setItem(bearerTokenName, bearerToken);    
    },
    unsetBearerToken: () => {
        AsyncStorage.removeItem(bearerTokenName);
    },
    setUserData: (userData) => {
        AsyncStorage.setItem(avatarDataName, userData.avatar.original)
        AsyncStorage.setItem(avatarThumbnail, userData.avatar.thumbnail)
        session.setCredits(userData.credits)
        session.setUserSettings(userData.user_settings)
        AsyncStorage.setItem(bearerTokenName, userData.access_token);
        AsyncStorage.setItem(firstnameDataName, userData.firstname)
        AsyncStorage.setItem(lastnameDataName, userData.lastname)
        AsyncStorage.setItem(usernameDataName, userData.username)
        AsyncStorage.setItem(countdownSecondsDataName, "" + userData.client_settings.countdown_seconds);
        AsyncStorage.setItem(rememberTokenDataName, userData.access);
    },
    setUserSettings: async (settings) => {
        session.setRememberMe(settings.remember_me)
        session.setEnableNotification(settings.enable_notification)
        session.setEnableSound(settings.enable_sound)
    },
    setRememberMe: (value) => {
        value = "" + parseInt(value)
        AsyncStorage.setItem(rememberMeDataName, value)
    },
    setEnableNotification: (value) => {
        value = "" + parseInt(value)
        AsyncStorage.setItem(enableNotificationDataName, value)
    },
    setEnableSound: (value) => {
        value = "" + parseInt(value)
        AsyncStorage.setItem(enableSoundDataName, value)
    },
    getUserSettings: async () => {
        rememberMe = await AsyncStorage.getItem(rememberMeDataName)
        enableNotification = await AsyncStorage.getItem(enableNotificationDataName)
        enableSound = await AsyncStorage.getItem(enableSoundDataName)
        rememberMe = parseInt(rememberMe)
        rememberMe = !! rememberMe
        enableNotification = parseInt(enableNotification)
        enableNotification = !! enableNotification
        enableSound = parseInt(enableSound)
        enableSound = !! enableSound
        return {
            rememberMe, enableNotification, enableSound
        }
    },
    setCredits: (credits) => {
        credits = "" + credits
        AsyncStorage.setItem(creditsDataName, credits)
    },
    sumCredits: async (newCredits) => {
        newCredits = parseInt(newCredits)
        credits = await session.getCredits()
        credits = parseInt(credits)
        credits += newCredits
        session.setCredits(credits)
    },
    getCredits: async () => {
        credits = await AsyncStorage.getItem(creditsDataName)
        return credits
    },
    getUserStats: async() => {
        // return name, credits
        name = await session.getCompleteName()
        credits = await session.getCredits()
        return { name, credits }
    },

    getCompleteName: async () => {
        firstname = await AsyncStorage.getItem(firstnameDataName)
        lastname = await AsyncStorage.getItem(lastnameDataName)
        return firstname + ' ' + lastname
    },

    setAvatar: async (avatar) => {
        AsyncStorage.setItem(avatarDataName, avatar.original)
        AsyncStorage.setItem(avatarThumbnail, avatar.thumbnail)
    },
    unsetUserData: () => {
        AsyncStorage.removeItem(userDataName);
    },

    setCourses: (courses) => {
        AsyncStorage.setItem(coursesDataName, JSON.stringify(courses));
    },

    addPath: (src) => {
        return url + src
    },
};

export async function getRememberToken(){
    return await AsyncStorage.getItem(rememberTokenDataName);
}

export async function getAvatar(original){
    if(typeof(original) === 'undefined'){
        avatar = await AsyncStorage.getItem(avatarDataName);
    }else{
        if(original){
            avatar = await AsyncStorage.getItem(avatarDataName);
        }else{
            avatar = await AsyncStorage.getItem(avatarThumbnail);
        }
    }
    return url + avatar;
}

export async function getCourses() {
    courses = await AsyncStorage.getItem(coursesDataName)
    return courses;
}

export async function getBearerToken() {
    bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    return bearerToken
}

export async function getCountdownSeconds() {
    countdownSeconds = await AsyncStorage.getItem(session.countdownSecondsDataName)
    return parseInt(countdownSeconds);
}

export async function getBearerTokenCountdownSeconds() {
    countdownSeconds = await AsyncStorage.getItem(session.countdownSecondsDataName)
    bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    countdownSeconds = parseInt(countdownSeconds)
    return { countdownSeconds, bearerToken }
}

export async function getUserData() {
    firstname = await AsyncStorage.getItem(session.firstnameDataName)
    lastname = await AsyncStorage.getItem(session.lastnameDataName)
    username = await AsyncStorage.getItem(session.usernameDataName)
    bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    access = await AsyncStorage.getItem(session.rememberTokenDataName)
    userData = {
        firstname: firstname,
        lastname: lastname,
        username: username,
        bearerToken: bearerToken, 
        email: username,
        mobile: '5525731520',
        phone: '5525731520',
        access,
    }
    return userData
}

const tutorialShowedDataName = 'tutorial_showed'

export async function shouldShowTutorial(){
    response = await AsyncStorage.getItem(tutorialShowedDataName)
    console.log('shouldShowTutorial', response)
    if(response === null){
        console.log('Mostrando el tutorial')
        return true
    }else{
        AsyncStorage.removeItem(tutorialShowedDataName)
        console.log('No Mostrar tutorial')
        return false
    }
}

export function setTutorialShowed(){
    AsyncStorage.setItem(tutorialShowedDataName, 'viewed')
}

export async function setExpoPushToken(){
    console.log('setExpoPushToken called')
    getBearerToken().then(bearerToken => {
        console.log('BearerToken received', bearerToken, exponentPushTokenUri)
        fetch(exponentPushTokenUri, {
            method: 'GET',
            headers: {
                "Authorization": 'Bearer ' + bearerToken,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {
                // console.log(respo)
                return response.json()
                // console.log("Response", response)
        })
        .then(jsonResponse => {
                console.log('typeof has_push_token ', typeof(jsonResponse.has_push_token))
                if(jsonResponse.has_push_token){
                    // console.log('has_push_token true') // No special action
                }else{
                    // console.log('has_push_token false')
                    registerForPushNotificationsAsync(bearerToken).then(() => {
                        console.log('registerForPushNotificationsAsync finished')
                    })
                }
        }).catch(error => {
            console.log("error get exponentpushtokenuri", error)
        });
    })
}

registerForPushNotificationsAsync = async (bearerToken) => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    ).catch(error => {
      console.log('permissions getasync', error)
    });
    let finalStatus = existingStatus;
    console.log('Final status', finalStatus)
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS).catch(error => {
        console.log('permissions askasync', error)
      });
      finalStatus = status;
    }
  
    console.log('Después de la función finalStatus', finalStatus)
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync().catch(error => {
      console.log('getExpoPushTokenAsync', error)
      return false;
    });

    fetch(exponentPushTokenUri, {
        method: 'POST',
        headers: {
            "Authorization": 'Bearer ' + bearerToken,
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            expo_push_token: token,
        }),
    }).then(response => response.json() )
    .then(jsonResponse => {
        console.log('registerForPushNotificationsAsync jsonResponse', jsonResponse)
        console.log('exponent push token', token)
    }).catch(error => {
        console.log("error setting exponentpushtokenuri", error)
    });
  
    // console.log('El token recibido es', token);
}