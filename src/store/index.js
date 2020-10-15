import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        questions: null,
        questionList: null, // When the game is first opened, we generate random questions and keep the list of questions in this array.
        answers: [], // We will keep the answers given by the users in this array.
        timeLeft: 20, // How many seconds will we give to answer the first question?
        timeForAnswer: 20, // How many seconds will we give users to answer a question?
        timeForAnswerInterval: null, // We will reset the response time in our questions with this variable. => SetInterval
        totalGameHistoryNumb: 10,
        totalQuestionNumb: 10, // How many questions do we want to have in our game?
        howManyWrongsWillReduce: 4, // how many wrong answers will reduce the correct ones! Ex: 2 of 6 questions are correct and 4 of thems are wrong, then one of your corrects will be reduced and your score will be (2-1) / 6 = 1/6.
        successLimit: 70, // 70% will be success, 69% will be failed
        gameStarted: false, // is the game started?
        gameResult: {
            wrong: 0,
            correct: 0,
            empty: 0,
            successRate: 0
        }, // We keep the data of the game the user is currently playing in this object.
        bestGameResult: {
            wrong: 0,
            correct: 0,
            empty: 0,
            successRate: 0,
            time: null
        }, // We keep the data of the game where the user achieves the best result here
        gameHistory: null, // we store the results of the user's last "totalGameHistoryNumb" games here
    },
    mutations: {
        addAnswer(state, payLoad) {
            state.answers.push(payLoad)
        },
        setAnswersClear(state) {
            state.answers = []
        },
        setTimeLeft(state, payLoad) {
            state.timeLeft = payLoad
        },
        setQuestions(state, payLoad) {
            state.questions = payLoad
        },
        setGameStarted(state, payLoad) {
            state.gameStarted = payLoad
            if (payLoad) {
                state.gameResult.empty = 0, state.gameResult.correct = 0, state.gameResult.wrong = 0, state.gameResult.successRate = 0
            }
        },
        setBestGameResult(state, payLoad) {
            console.log(state.bestGameResult)
            console.log(payLoad)
            state.bestGameResult = payLoad
            console.log(state.bestGameResult)
            console.log(payLoad)
            localStorage.setItem("bestGameResult", JSON.stringify(payLoad))
        },
        setGameResults(state) {
            state.answers.forEach(function(item) {
                if (item.answer == null) {
                    state.gameResult.empty++
                } else if (state.questions.countries[item.countryId].city == item.answer) {
                    state.gameResult.correct++
                } else if (state.questions.countries[item.countryId].city != item.answer) {
                    state.gameResult.wrong++
                }
            });
        },
        setGameHistory(state, payLoad) {
            state.gameHistory = payLoad
            localStorage.setItem("gameHistory", JSON.stringify(payLoad))
        },
        questionNumbList(state) {
            let newList = []
            while (newList.length < 10) {
                let randNum = parseInt(Math.random() * state.questions.countries.length)
                if (newList.indexOf(randNum) == -1) {
                    newList.push(randNum)
                }
            }
            state.questionList = newList
        }
    },
    actions: {
        setFinalCalculations(context) {
            let gameResult = context.state.gameResult
            let afterReduceCorrects = gameResult.correct - (gameResult.wrong / context.state.howManyWrongsWillReduce)
            gameResult.successRate = parseInt(afterReduceCorrects / context.state.totalQuestionNumb * 100)
            if (gameResult.successRate < 0) { gameResult.successRate = 0 } // If it's negative, we will fix it to 0.
            let gameHistory = context.state.gameHistory
            let data = { gameResult: JSON.parse(JSON.stringify(gameResult)), time: Date() } // different type of cloning, huh?
            if (gameHistory != null) {
                if (gameHistory.length > context.state.totalGameHistoryNumb - 1) {
                    gameHistory.length = context.state.totalGameHistoryNumb - 1 // To keep the last 10 (totalGameHistoryNumb) results, we get the last 9 (totalGameHistoryNumb-1) results here. We will also add the current result.
                }
                if (context.state.bestGameResult != null) {
                    if (gameResult.successRate >= context.state.bestGameResult.gameResult.successRate) {
                        context.commit("setBestGameResult", data)
                    }
                } else { context.commit("setBestGameResult", data) }
                gameHistory.unshift(data) // "push" adds to the end of the queue, "unshift" adds to the beginning of the queue
                context.commit("setGameHistory", gameHistory)
            } else { // If the player plays the game for the first time
                let newData = []
                newData.push(data)
                context.commit("setGameHistory", newData)
                context.commit("setBestGameResult", data)
            }
        },
        setGameEnded(context) {
            context.commit("setGameStarted", false)
            context.commit("setGameResults")
            context.dispatch("setFinalCalculations")
        },
        addAnswer(context, payLoad) {
            if (context.state.gameStarted == true) {
                context.commit("addAnswer", payLoad)
                context.commit("setTimeLeft", context.state.timeForAnswer)
            }
            if (context.state.answers.length >= context.state.totalQuestionNumb) {
                context.dispatch("setGameEnded")
            }
        },
        timeForAnswer(context) {
            clearInterval(context.state.timeForAnswerInterval)
            context.state.timeLeft = context.state.timeForAnswer
            context.state.timeForAnswerInterval = setInterval(() => {
                context.commit("setTimeLeft", context.state.timeLeft - 1)
                if (context.state.timeLeft <= 0 && context.state.gameStarted == true) {
                    context.dispatch("addAnswer", { countryId: context.state.questionList[context.state.answers.length], answer: null })
                }
            }, 1000);
        },
        startGame(context) {
            return new Promise((resolve, reject) => {
                axios
                    .get('/data/questions.json')
                    .then(
                        response => {
                            if (response.status == 200) {
                                if (response.data != undefined && response.data != null) { // we retrieve data from our json file, so go on!
                                    context.commit("setQuestions", response.data)
                                    context.commit("questionNumbList")
                                    resolve(response.data)
                                } else {
                                    reject("There is no question data in database.")
                                }
                            } else {
                                reject("There is an server error happened.")
                            }
                        }
                    )
            })
        },
        beforeStart(context) {
            context.state.bestGameResult = context.getters.getBestGameResultLS
            context.state.gameHistory = context.getters.getGameHistoryLS
        }
    },
    modules: {},
    getters: {
        getTimeLeft(state) {
            return state.timeLeft
        },
        getGameStarted(state) {
            return state.gameStarted
        },
        getAnswers(state) {
            return state.answers
        },
        getTotalQuestionNumb(state) {
            return state.totalQuestionNumb
        },
        getTotalGameHistoryNumb(state) {
            return state.totalGameHistoryNumb
        },

        getGameResult(state) {
            return state.gameResult
        },
        getQuestionList(state) {
            return state.questionList
        },
        getQuestions(state) {
            return state.questions
        },
        getSuccessLimit(state) {
            return state.successLimit
        },
        getBestGameResult(state) {
            return state.bestGameResult
        },
        getGameHistory(state) {
            return state.gameHistory
        },
        getBestGameResultLS() {
            if (localStorage.getItem("bestGameResult") != undefined && localStorage.getItem("bestGameResult") != "undefined" && localStorage.getItem("bestGameResult") != null && localStorage.getItem("bestGameResult") != "null") {
                return JSON.parse(localStorage.getItem("bestGameResult"))
            } else { return null }
        },
        getGameHistoryLS() {
            if (localStorage.getItem("gameHistory") != undefined && localStorage.getItem("gameHistory") != "undefined" && localStorage.getItem("gameHistory") != null && localStorage.getItem("gameHistory") != "null") {
                return JSON.parse(localStorage.getItem("gameHistory"))
            } else { return null }
        }
    }
})