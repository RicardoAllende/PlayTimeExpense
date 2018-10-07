const url = "http://192.168.1.69:8000/api/v1/"

const app_url = url + "app/"

export const api = {
    url: url,
    app_url: app_url,
    auth: url + 'auth', // POST request if user has email and password, GET request if user has a token
    checkUser: url + 'check-user-by-token',
    getCourses: app_url + 'courses',
    sendAnswers: app_url + 'questions', //post
    getQuestions: (course_id) => { 
        return app_url + 'courses/' + course_id + '/questions'
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
    getRanking: (course_id) => {
        return app_url + 'courses/' + course_id + '/ranking'
    },
    getCompleteRanking: app_url + 'ranking',
    setMedalQuestions: (course_id) => {
        return app_url + 'courses/' + course_id + '/achievements/save/medal'
    }
}