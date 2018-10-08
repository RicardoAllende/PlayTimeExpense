import { AsyncStorage } from "react-native"

const bearerTokenName= "bearerToken";
const userDataName= "userData";
const firstnameDataName = "firstname";
const lastnameDataName = "lastname";
const usernameDataName = "email";
// export default class Session 
export const session = {
    bearerTokenName: bearerTokenName,
    userDataName: userDataName,
    firstnameDataName: firstnameDataName,
    lastnameDataName: lastnameDataName,
    usernameDataName: usernameDataName,

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
        // console.log("setBearerToken:", bearerToken);
        AsyncStorage.setItem(bearerTokenName, bearerToken);    
    },
    // getBearerToken: async() => {
    //     value = await AsyncStorage.getItem(bearerTokenName);
    //     return value;
    // },
    unsetBearerToken: () => {
        AsyncStorage.removeItem(bearerTokenName);
    },
    setUserData: (userData) => {
        AsyncStorage.setItem(bearerTokenName, userData.access_token);
        AsyncStorage.setItem(firstnameDataName, userData.firstname)
        AsyncStorage.setItem(lastnameDataName, userData.lastname)
        AsyncStorage.setItem(usernameDataName, userData.username)
        // AsyncStorage.setItem(userDataName, userData);
    },
    // getUserData: () => {
    //     value =  await AsyncStorage.getItem(userDataName);
    //     return value;
    // },
    unsetUserData: () => {
        AsyncStorage.removeItem(userDataName);
    }
};

export async function getBearerToken() {
    bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    return bearerToken
}

export async function getUserData() {
    firstname = await AsyncStorage.getItem(session.firstnameDataName)
    lastname = await AsyncStorage.getItem(session.lastnameDataName)
    username = await AsyncStorage.getItem(session.userDataName)
    bearerToken = await AsyncStorage.getItem(session.bearerTokenName)
    userData = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      bearerToken: bearerToken, 
    }
    // console.log("Generando User data", userData);
    return userData
  }