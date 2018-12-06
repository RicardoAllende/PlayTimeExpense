export const url = "http://192.168.0.113:8000/"
const api_url = url + "api/v1/"

const app_url = api_url + "app/"

export const exponentPushTokenUri = app_url + 'expo-push-token'

export const api = {
    invitation_url: url + 'download',
    show_achievement: (name, id) => {
        return app_url + name + '/' + id
    },
    url: url,
    loginWithRememberToken: (token) => {
        return url + "login?remember_token=" + token
    },
    api_url: api_url,
    app_url: app_url,
    auth: api_url + 'auth', // POST request if user has email and password, GET request if user has a token
    checkUser: api_url + 'check-user-by-token',
    getCourses: app_url + 'courses',
    getCompletedCourses: app_url + 'courses/completed',
    getCoursesWithoutRandom: app_url + 'courses?no-random=1',
    sendAnswers: app_url + 'questions', //post
    getQuestions: (course_id, level) => { 
        if(level == 0){
            return app_url + 'courses/' + course_id + '/questions'
        }
        return app_url + 'courses/' + course_id + '/questions?level=' + level
    },
    getCompletedAchievements: app_url + '/achievements',
    getAvailableAchievements: (course_id) => {
        return app_url + 'courses/' + course_id + '/achievements/available'
    },
    getAchievements: (course_id) => {
        return app_url + 'courses/' + course_id + '/achievements'
    },
    addAchievement: app_url + "/achievement",
    getCourseOverView: (course_id) => {
        return app_url + 'courses/' + course_id + '/overview'
    },
    getCompleteRanking: app_url + 'ranking',
    getSessionResults: app_url + 'sessions/results', // POST 
    setHitsInCourse: (course_id) => {
        return app_url + 'courses/' + course_id + '/achievements/set-hits'
    },
    setAvatar: app_url + 'users/avatar?app=1',
    getOverview: app_url + 'overview',
    setSettings: app_url + 'settings',
    setShareInFacebookAchievement: app_url + 'achievements/social/facebook',
    setShareInTwitterAchievement: app_url + 'achievements/social/twitter',
    setShareInLinkedInAchievement: app_url + 'achievements/social/linkedin',
}
const levels = ['Aleatorio', 'Fácil', 'Medio', 'Difícil'];

export function getLevelName(index){
    if(index > -1 && index < levels.length ){
        return levels[index];
    }
    return "_";
}

export function getLevelIndex(levelName){
    return levels.indexOf(levelName);
}