<template>
    <div class="mainbox">
        
        <div class="title">
            <i class="fas fa-question-circle"></i> {{index+1}}-) What is the capital of {{country}}?
            <span class="right">Time Left: {{this.$store.getters.getTimeLeft}} second<span v-if="this.$store.getters.getTimeLeft>1">s</span></span>
            <span class="right pr-3"><a class="btn btn-sm btn-warning" @click="answerIt(countryId,null)">Skip the question</a></span>
        </div>
        <div class="content btn-group special">
            <button @click="answerIt(countryId,answer)" class="btn btn-primary" v-for="answer in answers" :key="answer.id">{{answer}}</button>
        </div>
        <!-- {{this.$store.state.answers}} -->
    </div>
</template>

<script>
export default {
    name: 'Soru',
    props: {
        index: Number,
        country: String,
        countryId: Number,
        answers: Array
    },
    data(){
        return{
            timeLeft:null
        }
    },
    methods:{
        answerIt(countryId,answer){
            // console.log("", countryId, answer)
            this.$store.dispatch("addAnswer", {countryId, answer} )
        }
    },
    created(){
        this.$store.dispatch("timeForAnswer")
    }
    
}
</script>