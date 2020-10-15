<template>
    <div>
        <div class="mainbox">
            <template v-if="getTotalQuestionNumb > getAnswers.length">
                <div class="title"><i class="fas fa-check-circle"></i> My Answers</div>
                <div class="content scroll">
                    <div  v-if="getAnswers.length == 0">
                        You haven't answered any questions yet.
                    </div>
                    <table class="table table-striped" v-else>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Country</th>
                                <th>Answer</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(answer, index) in getAnswers" :key="answer.id">
                                <td>{{index+1}}</td>
                                <template v-if="answer.countryId==null"><td colspan="2">PASS</td></template>
                                <template v-else>
                                    <td>{{questions.countries[answer.countryId].country}}</td>
                                    <td>{{answer.answer}}</td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else>
                <div class="title"><i class="fas fa-check-circle"></i> My Result</div>
                <div class="content scroll">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th class="nomobile">#</th>
                                <th>Country</th>
                                <th>You</th>
                                <th>Correct</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="(answer, index) in getAnswers">
                                <tr :key="answer.id" class="text-white" :class="(
                                    answer.answer==null
                                        ?'bg-warning'
                                        :questions.countries[answer.countryId].city==answer.answer
                                            ?'bg-success'
                                            :'bg-danger'
                                )">
                                    <td class="nomobile">{{index+1}}</td>
                                    <td>{{questions.countries[answer.countryId].country}}</td>
                                    <template v-if="answer.answer==null"><td colspan="1"><i class="fas fa-times"></i></td></template>
                                    <template v-else>
                                        <td>{{answer.answer}}</td>
                                    </template>
                                        <td>{{questions.countries[answer.countryId].city}}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
        <div class="mainbox" v-if="getGameHistory != null">
            
            <div class="title"><i class="fas fa-check-double"></i> Result History - Recent 10 Games</div>
            <div class="content pb-1">
                <table class="table table-striped text-center">
                    <thead>
                        <tr>
                            <th class="text-left">#</th>
                            <th><i class="fas fa-check text-success"></i></th>
                            <th><i class="fas fa-times text-danger"></i></th>
                            <th><i class="fas fa-ban text-warning"></i></th>
                            <th class="text-right"><i class="fas fa-percentage text-info"></i></th>
                            <th><i class="fas fa-business-time text-primary"></i></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in getGameHistory" :key="item.id">
                            <td class="text-left">{{index+1}}</td>
                            <td class="text-success">{{ item.gameResult.correct }}</td>
                            <td class="text-danger">{{ item.gameResult.wrong }}</td>
                            <td class="text-warning">{{ item.gameResult.empty }}</td>
                            <td class="text-info text-right">{{ item.gameResult.successRate }}%</td>
                            <td><small>{{dateFormat(item.time)}}</small></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
	</div>
</template>

<script>
import {dateMixin} from "@/mixins/dateMixin"
import { mapGetters } from 'vuex'

export default {
	mixins: [dateMixin],
    computed: {
        ...mapGetters(['getAnswers', 'getTotalQuestionNumb', 'getGameHistory']),
        ...mapGetters({'questions': 'getQuestions'}) // Here we get this.questions directly from mutations instead of using it in data.
    }
}
</script>
<style scoped>
    .table thead th {border-top:0px;}
</style>