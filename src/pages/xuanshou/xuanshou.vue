<template>
<div class="main-xuanshou">
  <!-- 选手口令界面 -->
  <div v-if="type==='viewToken'" class="xuanshou-one">
      <van-row :span="8" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="8" type="flex" justify="center" class="row-name">
        <van-col :span="5">
          <van-tag
          color="#cd2323"
          class="left teamToken-left">战队口令</van-tag>
        </van-col>
        <van-col :span="15">
        <van-field
          v-model="teamToken"
          border
          type="number"
          placeholder="点击输入文本"
          class="right teamToken-right"></van-field>
        </van-col>
      </van-row>
      <van-row :span="8" class="row-start">
        <van-button round class="one-start" @click="handleLogin">登录</van-button>
      </van-row>
  </div>
  <!-- 选手名字界面 -->
  <div v-else-if="type==='viewRename'" class="xuanshou-one">
      <van-row :span="8" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="8" type="flex" justify="center" class="row-name">
        <van-col :span="5">
          <van-tag
          color="#cd2323"
          class="left teamname-left">战队名称</van-tag>
        </van-col>
        <van-col :span="15">
          <van-field
            v-model="teamName"
            border
            type="string"
            placeholder="点击输入文本"
            class="right teamname-right">{{teamName}}</van-field>
        </van-col>
      </van-row>
      <van-row :span="8" class="row-start">
        <van-button round class="one-start" @click="handleRename">开始答题</van-button>
      </van-row>
  </div>
  <!-- 选项界面 -->
  <div v-else-if="type==='viewOptions'" class="xuanshou-two">
    <van-row class="row-number">
      <span>
        第<span class="two-currentNumber">{{questionIndex}}</span>题
      </span>
    </van-row>
    <van-row type="flex" justify="space-between" class="row-options">
      <van-col class="col-options">
        <van-button
        v-for="(option) in options"
        :key="option"
        @click="select(option)"
        :class="teamAnswer.indexOf(option) == -1 ? 'option-button':'option-button option-button-active'"
        >{{option}}
        </van-button>
      </van-col>
    </van-row>
    <van-row :span="4" class="row-start">
        <van-button round :disabled="enableAnswer" class="two-start" @click="handleAnswer">提交</van-button>
    </van-row>
  </div>
</div>
</template>

<script>
import { Team } from '../client'
export default {
  data() {
    return {
      type: 'viewToken',
      raceName: '党建知识竞赛',
      teamName: '',
      teamToken: '',
      questionIndex: 1,
      teamAnswer: [], // 存放选手选择的答案
      options: ['A', 'B', 'C', 'D', 'E'],
      enableAnswer: true// true不可点击控制是否可答题
    }
  },
  methods: {
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
    handleLogin() {
      if (this.teamToken !== '') {
        localStorage.setItem('战队口令', this.teamToken)
        this.team.login(this.teamToken)
        this.type = 'viewRename'
        localStorage.setItem('当前界面', this.type)
      } else {
        return false
      }
    },
    handleRename() {
      if (this.teamName !== '') {
        this.team.rename(this.teamName)
        this.type = 'viewOptions'
        localStorage.setItem('当前界面', this.type)
      } else {
        return false
      }
    },
    handleAnswer() {
      this.teamAnswer.sort()
      this.teamAnswer.join('')
      console.log(this.teamAnswer)
      if (this.teamAnswer !== '') {
        this.team.answer(this.teamAnswer, this.questionIndex)
      } else {
        return false
      }
    },
    onConnect(data) {
      const {enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
      // this.enableAnswer = !enableAnswer
      // this.questionIndex = questionIndex
      // this.updateTime = updateTime
      // this.activeTeam = activeTeam
      // this.teams = teams
      if (this.teamToken === localStorage.getItem('战队口令')) {
        // this.type === localStorage.getItem('当前界面') // 有问题：设置显示那些组件 要用localStorage 不行的？
        // console.log('type' + this.type)
        if (enableAnswer) this.enableAnswer = enableAnswer
        if (questionIndex) this.questionIndex = questionIndex
        if (updateTime) this.updateTime = updateTime
        if (activeTeam) this.activeTeam = activeTeam
        if (teams) this.teams = teams
      }
    },
    onInitRace(data) {
      const {enableAnswer} = data
      this.enableAnswer = !enableAnswer
    },
    onBeginRace(data) {
      const { enableAnswer, beginTime, questionIndex } = data
      this.enableAnswer = !enableAnswer
      this.beginTime = beginTime
      this.questionIndex = questionIndex
    },
    onNextQuestion(data) {
      const { questionIndex, question, score, updateTime, enableAnswer } = data
      this.questionIndex = questionIndex
      this.question = question
      this.score = score
      this.updateTime = updateTime
      this.enableAnswer = !enableAnswer
      this.teamAnswer = []
    },
    onShowAnswer(data) {
      const { answer, answers, enableAnswer } = data
      this.answer = answer
      this.answers = answers
      this.enableAnswer = !enableAnswer
    },
    onChangeScore(data) {
      const { teams } = data
      this.teams = teams
    },
    onEndRace(data) {
      const { enableAnswer, closed } = data
      this.enableAnswer = !enableAnswer
      this.closed = closed
    },
    onRename(data) {
      const { newName, teamToken } = data
      this.teamName = newName
      this.teamToken === teamToken
    },
    onAnswer(data) {
      const { teamToken, activeTeam, enableAnswer } = data
      this.teamToken = teamToken
      this.activeTeam = activeTeam
      this.enableAnswer = !enableAnswer
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
  }
}
</script>

<style>
html {
  font-size : 10px;
}
@media only screen and (min-width: 720px){
  html {
    font-size: 11.25px !important;
  }
}
@media only screen and (min-width: 960px){
  html {
    font-size: 15px !important;
  }
}
.svg-icon{
  font-size: 180px;
}
.row-icon{
  text-align: center;
  padding-top: 12vh;
}
.one-racename{
  font-size: 40px;
  color: #cd2323;
}
.van-row{
  text-align: center;
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
.right{
  border: 1px solid #cca;
}
.row-name{
  padding: 8vh 0 4vh 0;
}
.row-start{
  padding-top:8vh;
}
.one-start{
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
  padding: 8vh;
  margin-bottom: 8vh;
}
.two-currentNumber{
  color: #cd2323;
  background: #fff;
  padding: 0 15px;
  margin: 0 25px;
}
.two-start{
  height: 7vh!important;
  font-size: 18px!important;
  width: 40vh!important;
  background: #cd2323!important;
  color: #fff!important;
}
.option-button{
  font-size: 35px!important;
  width: 40vh;
  border: 1px solid #000!important;
  margin: 1.5vh!important;
  background: #fff!important;
  color: #000!important;
}
.option-button-active{
  background: #f9ab00!important;
  color: #fff!important;
}
</style>
