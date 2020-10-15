<template>
  <div id="home">
        <div class="mainbox">
            <div class="title withoutline"><i class="fas fa-gamepad"></i> How much do you know the capital cities of countries?</div>
        </div>
        <div class="row">
            <div class="col-md-8">
                <div class="mainbox" v-if="getGameStarted == false && error==false && getAnswers.length==0">
                    <div class="title"><i class="fas fa-hourglass-start"></i> Welcome to the Question &amp; Answer Game</div>
                    <div class="content text-center">
                        <p>Would you like a play a new game?</p> 
                        <button class="btn btn-success" @click="newGame">Start a New Game</button>
                    </div>
                </div>
                <div class="mainbox" v-else-if="questions==null || error!=false">
                    <div class="title"><i class="fas fa-unhappy"></i> There is an error occured!</div>
                    <div class="content">We could not find any questions to show you :(</div>
                </div>
                <template v-else-if="getAnswers.length==getTotalQuestionNumb">
                    <div class="mainbox">
                        <div class="title"><i class="fas fa-flag-checkered"></i> You have completed all the questions</div>
                        <div class="content text-center">
                            <ul class="text-left">
                                <li>You need to get <strong class="text-success">{{getSuccessLimit}} or more points to pass.</strong></li>
                                <li>Every <strong class="text-danger">4 wrong answers</strong> will cancel out <strong class="text-success">one correct answer</strong>, of course if you have one!</li>
                            </ul>
                            <p>You have <strong class="text-success">{{getGameResult.correct}}</strong> correct, <strong class="text-danger">{{getGameResult.wrong}}</strong> wrong and <strong class="text-warning">{{getGameResult.empty}}</strong> empty answers. Your success rate: <strong :class="(getGameResult.successRate>=getSuccessLimit?'text-success':'text-danger')">{{getGameResult.successRate}}%</strong></p>
                            <p>Would you like to play a new game again?</p> 
                            <button class="btn btn-success" @click="newGame">Start a New Game</button>
                        </div>
                    </div>
                    <div class="mainbox" v-if="getGameResult.successRate>=getSuccessLimit">
                        <div class="title"><i class="fas fa-user-graduate"></i> Congratulations</div>
                        <div class="content text-center p-4">
                            <img src="/img/congratulations.png" width="100%" alt="Congratulations" class="text-center" />
                        </div>
                    </div>
                    <div class="mainbox" v-else>
                        <div class="title"><i class="fas fa-surprise"></i> Failed :(</div>
                        <div class="content text-center p-4">
                            <img src="/img/failed.png" width="100%" alt="Failed" class="text-center" />
                        </div>
                    </div>
                </template>
                <template v-else-if="questions!=null">
                    <Question :index="getAnswers.length" :country="questions.countries[getQuestionList[getAnswers.length]].country" :countryId="getQuestionList[getAnswers.length]" :answers="createAnswers(getQuestionList[getAnswers.length])" :answer="questions.countries[getQuestionList[answers.length]].city" />
                </template>
                
                    <div class="mainbox">
                        <div class="title"><i class="fas fa-trophy"></i> Your Most Successful Game Score</div>
                        <div class="content">
                            <p v-if="getGameStarted==false && (getBestGameResult!=null && typeof getBestGameResult!=undefined)">You had <strong class="text-success">{{getBestGameResult.gameResult.correct}}</strong> correct, <strong class="text-danger">{{getBestGameResult.gameResult.wrong}}</strong> wrong and <strong class="text-warning">{{getBestGameResult.gameResult.empty}}</strong> empty answers. At <strong>{{dateFormat(getBestGameResult.time)}}</strong>, your success rate was: <strong :class="(getBestGameResult.gameResult.successRate>=getSuccessLimit?'text-success':'text-danger')">{{getBestGameResult.gameResult.successRate}}%</strong></p>
                            <p v-else>You haven't played any games yet. How about playing a game right now?</p>
                        </div>
                    </div>
                    
            </div><!-- col-md-8 -->
            <div class="col-md-4">
                <Result />
            </div><!-- col-md-4 -->
        </div><!-- row -->
    </div><!-- home -->
</template>

<script>
// @ is an alias to /src
import Question from '@/components/Question.vue'
import Result from '@/components/Result.vue'
import {dateMixin} from "@/mixins/dateMixin"
import { mapGetters } from 'vuex'

export default {
    name: 'Home',
	mixins: [dateMixin],
    data(){
        return {
            //questions:null,
            questionList:null,
            answers: [],
            error:false
        }
    },

    methods:{
        createAnswers(id){
            let newList = []
            let currentCityNum = parseInt(Math.random()*4)
            let i = 0
            while(newList.length<4){
                if(i == currentCityNum){
                    newList.push(this.questions.countries[id].city)
                }
                let randNum = parseInt(Math.random()*this.questions.countries.length)
                let city = this.questions.countries[randNum].city
                if(newList.indexOf(city)==-1 && id != randNum && city != null && newList.length<4){
                    i++
                    newList.push(city)
                }
            }
            return newList
        },
        newGame(){
            this.$store.dispatch("startGame")
                .then( () => {
                    //this.questions = this.$store.state.questions
                    this.$store.commit("setGameStarted", true)
                    this.$store.commit("setAnswersClear")
                })
                .catch( error => {
                    this.error = error
                })
        }
    },
    components: {
        Question,
        Result
    },
    created(){
        // this.newGame()
    },
    computed:{
        ...mapGetters(['getGameStarted','getAnswers', 'getTotalQuestionNumb', 'getGameResult', 'getQuestionList', 'getBestGameResult', 'getSuccessLimit']),
        ...mapGetters({'questions': 'getQuestions'}) // Here we get this.questions directly from mutations instead of using it in data.
    }
}
</script>
