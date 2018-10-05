import { AsyncStorage } from "react-native"

const bearerTokenName= "bearerToken";
const userDataName= "userData";
// export default class Session 
export const session = {
    bearerTokenName: bearerTokenName,
    userDataName: userDataName,

    setBearerToken: (bearerToken) => {
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
        AsyncStorage.setItem(userDataName, userData);
    },
    // getUserData: () => {
    //     value =  await AsyncStorage.getItem(userDataName);
    //     return value;
    // },
    unsetUserData: () => {
        AsyncStorage.removeItem(userDataName);
    }
};