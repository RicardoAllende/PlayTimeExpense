import { AsyncStorage } from "react-native"
import {url} from './playTimeApi'

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
        // session.setAvatar(userData.avatar)
        AsyncStorage.setItem(avatarDataName, userData.avatar.original)
        AsyncStorage.setItem(avatarThumbnail, userData.avatar.thumbnail)
        // AsyncStorage.setItem(avatarDataName, userData.avatar);
        AsyncStorage.setItem(bearerTokenName, userData.access_token);
        AsyncStorage.setItem(firstnameDataName, userData.firstname)
        AsyncStorage.setItem(lastnameDataName, userData.lastname)
        AsyncStorage.setItem(usernameDataName, userData.username)
        AsyncStorage.setItem(countdownSecondsDataName, "" + userData.settings.countdown_seconds);
        AsyncStorage.setItem(rememberTokenDataName, userData.access);
    },
    setAvatar: async (avatar) => {
        console.log('setting avatar', avatar)
        AsyncStorage.setItem(avatarDataName, avatar.original)
        AsyncStorage.setItem(avatarThumbnail, avatar.thumbnail)
    },
    unsetUserData: () => {
        AsyncStorage.removeItem(userDataName);
    },

    setCourses: (courses) => {
        AsyncStorage.setItem(coursesDataName, JSON.stringify(courses));
        console.log('Agregando cursos en AsyncStorage');
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
        mobile: '+33 345 678 901',
        phone: '+33 123 456 789',
        access,
    }
    // console.log("Recuperando User data", userData);
    return userData
}

export function queueImageUpdate(){
    AsyncStorage.setItem('update_image', true);
}

export function changeAvatar(){

}

export async function getQueueImageUpdate(){
    avatar = getAvatar()
    fetch(api.getCourses, {
        method: 'GET',
        headers: {
            "Authorization": 'Bearer ' + this.state.bearerToken,
            Accept: 'application/json',
            "Content-Type": "application/json"
        }
    })
        .then((response) => response.json())
        .then((response) => {
            this.setState({ courses: response.data.courses, coursesLength: response.data.courses.length - 1, ready: true }, () => {

            })
            session.setCourses(response.data.courses);
        }
        ).catch((error) => {
            console.error(error);
        })
}

const tutorialShowedDataName = 'tutorial_showed'

export async function shouldShowTutorial(){
    response = await AsyncStorage.getItem(tutorialShowedDataName)
    if(response !== null){
        AsyncStorage.removeItem(tutorialShowedDataName)
        return true;
    }
    return false;
}

export function setTutorialShowed(){
    AsyncStorage.setItem(tutorialShowedDataName, 'viewed')
}

export async function shouldRestart(){
    // alert('entrando en la función')
    // bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    restart = await AsyncStorage.getItem('restart')
    if(restart !== null){
        AsyncStorage.removeItem('restart')
        return true
    }
    // alert('Terminó la función')
    return false
}

export function restartApp(){
    AsyncStorage.setItem('restart', '00')
}