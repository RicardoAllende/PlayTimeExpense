export const url = "http://192.168.0.113:8000/"
const api_url = "http://192.168.0.113:8000/api/v1/"

const app_url = api_url + "app/"

export const api = {
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
    getSettings: app_url + '/settings',
    defaultSettings: {
        feedback: true,
        achievements: true,
        random_mode: true,
        num_questions: 30,
        countdown: true,
        countdown_seconds: 10
    },
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
    getOverview: app_url + 'overview'
}
const levels = ['Aleatorio', 'Fácil', 'Medio', 'Difícil'];

export const modalLevels = [
    { key: 8, section: true, label: 'Escoja el nivel a jugar' },
    { key: 1, label: getLevelName(1), value: 1 },
    { key: 2, label: getLevelName(2), value: 2 },
    { key: 3, label: getLevelName(3), value: 3 },
    { key: 0, label: getLevelName(0), value: 0 },
]

export function getLevelName(index){
    if(index > -1 && index < levels.length ){
        return levels[index];
    }
    return "_";
}

export function getLevelIndex(levelName){
    return levels.indexOf(levelName);
}