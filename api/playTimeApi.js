const url = "http://192.168.0.104:8000/api/v1/"

const app_url = url + "app/"

export const api = {
    url: url,
    app_url: app_url,
    auth: url + 'auth', // POST request if user has email and password, GET request if user has a token
    checkUser: url + 'check-user-by-token',
    getCourses: app_url + 'courses',
    getCoursesWithoutRandom: app_url + 'courses?no-random=1',
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
    getCourseOverView: (course_id) => {
        return app_url + 'courses/' + course_id + '/overview'
    },
    getCompleteRanking: app_url + 'ranking',
    getSessionStats: app_url + 'sessions/results', // POST 
    setHitsInCourse: (course_id) => {
        return app_url + 'courses/' + course_id + '/achievements/set-hits'
    },
}