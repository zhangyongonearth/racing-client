<template>
<div class="content">
  <!-- 选手口令界面 -->
  <van-row v-show="step==='login'|| step==='ready'" style="height:50vh;line-height:50vh;">
    <svg-icon icon-class="cup" style="vertical-align: middle;font-size:15rem;"></svg-icon>
  </van-row>
  <van-row  v-show="step==='login'|| step==='ready'" class="view-title" style="height:10vh">
    <span>网络软件研发部抢答系统</span>
  </van-row>
  <van-row  v-show="step==='login'"  type="flex" justify="center" style="margin-top:10vh; height:10vh" >
    <van-col :span="5">
      <van-tag
      color="#cd2323"
      class="left racename-left">参赛口令</van-tag>
    </van-col>
    <van-col :span="15">
      <van-field
        v-model="teamToken"
        border
        placeholder="点击输入口令"
        class="right-input">
      </van-field>
      </van-col>
  </van-row>
  <van-row  v-show="step==='login'"  style="margin-top:10vh; height:10vh;" >
    <van-button round class="button-click" @click="handleLogin">登录</van-button>
  </van-row>
  <van-row  v-show="step==='ready'"  type="flex" justify="center" style="margin-top:10vh; height:10vh" >
    <van-col :span="5">
      <van-tag
      color="#cd2323"
      class="left racename-left">参赛名称</van-tag>
    </van-col>
    <van-col :span="15">
      <van-field
        v-model="teamName"
        border
        placeholder="点击输入文本"
        class="right">
      </van-field>
      </van-col>
  </van-row>
  <van-row  v-show="step==='ready'"  style="margin-top:10vh; height:10vh;" >
    <van-button round class="button-click" @click="handleRename">开始答题</van-button>
  </van-row>
  <!-- 选项界面 -->
  <van-row v-show="step==='submit'" style="height:10vh; line-height:10vh;" class="row-number" >
    <span>
      第<span class="question-index">{{questionIndex}}</span>题
    </span>
  </van-row>
  <van-row v-show="step==='submit'" style="height:80vh;" type="flex" justify="space-between" >
    <van-col>
      <van-button
        v-for="(option) in options"
        :key="option"
        :disabled="!enableAnswer"
        @click="select(option)"
        :class="teamAnswer.indexOf(option) == -1 ? 'option-button':'option-button option-button-active'"
        style="height:8vh;margin-top:6vh;">
        {{option}}
      </van-button>
    </van-col>
  </van-row>
  <van-row v-show="step==='submit'" style="height:10vh;line-height:10vh;" >
    <van-button round :disabled="!enableAnswer" class="button-click" @click="handleAnswer">提交答案</van-button>
  </van-row>
</div>
</template>

<script>
import { Team } from '../client'
export default {
  data() {
    return {
      step: 'login', // login登录 ready准备答题 submit提交答案
      raceName: '党建知识竞赛',
      teamToken: '',
      teamName: '',
      questionIndex: 0,
      teamAnswer: [], // 存放选手选择的答案
      options: ['A', 'B', 'C', 'D', 'E'],
      enableAnswer: true// true不可点击控制是否可答题
    }
  },
  methods: {
    handleLogin() {
      if (this.teamToken !== '') {
        localStorage.setItem('token', this.teamToken)
        this.team.login(this.teamToken)
      } else {
        return false
      }
    },
    handleRename() {
      if (this.teamName !== '') {
        this.team.rename(this.teamName)
        this.step = 'submit'
      } else {
        return false
      }
    },
    select(option) {
      // -1表示其中不包含元素
      if (this.teamAnswer.indexOf(option) !== -1) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === option) {
            this.teamAnswer.splice(i, 1)
          }
        }
      } else {
        this.teamAnswer.push(option)
      }
    },
    handleAnswer() {
      this.teamAnswer.sort()
      this.teamAnswer.join('')
      console.log(this.teamAnswer)
      if (this.teamAnswer.length > 0) {
        this.team.answer(this.teamAnswer.join(''), this.questionIndex)
      } else {
        return false
      }
    },
    onConnect(data) {
      const {enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
      if (teams && teams[this.teamToken]) {
        if (teams[this.teamToken]['name']) {
          this.step = 'submit'
        } else {
          this.step = 'ready'
        }
      }
      this.enableAnswer = enableAnswer
      this.questionIndex = questionIndex
      this.updateTime = updateTime
      this.activeTeam = activeTeam
    },
    onInitRace(data) {
      const {enableAnswer} = data
      this.enableAnswer = enableAnswer
    },
    onBeginRace(data) {
      const { enableAnswer, beginTime, questionIndex } = data
      this.enableAnswer = enableAnswer
      this.beginTime = beginTime
      this.questionIndex = questionIndex
    },
    onNextQuestion(data) {
      const { questionIndex, question, score, updateTime, enableAnswer } = data
      this.questionIndex = questionIndex
      this.question = question
      this.score = score
      this.updateTime = updateTime
      this.enableAnswer = enableAnswer
      this.teamAnswer = []
    },
    onShowAnswer(data) {
      const { answers, enableAnswer } = data
      this.answers = answers
      this.enableAnswer = enableAnswer
    },
    onChangeScore(data) {
      const { teams } = data
      this.teams = teams
    },
    onEndRace(data) {
      const { enableAnswer, closed } = data
      this.enableAnswer = enableAnswer
      this.closed = closed
    },
    onRename(data) {
      const { newName } = data
      this.teamName = newName
    },
    onAnswer(data) {
      const { teamToken, activeTeam } = data
      this.activeTeam = activeTeam
      if (teamToken === this.teamToken) this.enableAnswer = false
    }
  },
  mounted() {
    this.team = new Team()
    const self = this
    this.team.onmessage = function(resp) {
      console.log('this is team onmessage')
      console.log(resp)
      const { action, data} = JSON.parse(resp)
      switch (action) {
        case 'connect':
          self.onConnect(data)
          break
        case 'initRace':
          self.onInitRace(data)
          break
        case 'beginRace':
          self.onBeginRace(data)
          break
        case 'nextQuestion':
          self.onNextQuestion(data)
          break
        case 'showAnswer':
          self.onShowAnswer(data)
          break
        case 'changeScore':
          self.onChangeScore(data)
          break
        case 'endRace':
          self.onEndRace(data)
          break
        case 'rename':
          self.onRename(data)
          break
        case 'answer':
          self.onAnswer(data)
          break
      }
    }
    this.teamToken = localStorage.getItem('token')
    if (this.teamToken) {
      this.team.login(this.teamToken)
    }
  }
}
</script>

<style>
/* .content{
  position:absolute;
  top:0;
  bottom: 0;
} */
.van-row{
  text-align: center;
}
.view-title{
  font-size: 1.5rem;
  color: #cd2323;
}
.van-col--5{
  width: auto!important;
}
.van-tag{
  background-color: rgb(205, 35, 35)!important;
  line-height: 24px!important;
  font-size: 12px!important;
  padding: 10px 15px!important;
  border-radius: 0em!important;
  border: 1px solid #cd2323;
}
.right-input{
  border: 1px solid #cca;
}
.button-click{
  height: 7vh!important;
  font-size: 18px!important;
  width: 40vh!important;
  background: #cd2323!important;
  color: #fff!important;
}
.row-number{
  background:#cd2323;
  font-size: 30px;
  color:#fff;
  vertical-align: middle;
}
.question-index{
  color: #cd2323;
  background: #fff;
  padding: 0 15px;
  margin: 0 25px;
}
.option-button{
  font-size: 35px!important;
  width: 40vh;
  border: 1px solid #000!important;
  background: #fff!important;
  color: #000!important;
}
.option-button-active{
  background: #f9ab00!important;
  color: #fff!important;
}
</style>
