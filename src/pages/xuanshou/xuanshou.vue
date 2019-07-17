<template>
<div class="main-xuanshou">
  <!-- 选手口令界面 -->
  <div v-if="type==='viewToken'" class="xuanshou-one">
      <van-row :span="4" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="5" type="flex" justify="center" class="row-name">
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
      <van-row :span="4" class="row-start">
        <van-button round class="one-start" @click="tokenLogin">登录</van-button>
      </van-row>
  </div>
  <!-- 选手名字界面 -->
  <div v-else-if="type==='viewRename'" class="xuanshou-one">
      <van-row :span="4" class="row-icon">
        <svg-icon icon-class="cup"></svg-icon>
        <div class="one-racename">{{raceName}}</div>
      </van-row>
      <van-row :span="5" type="flex" justify="center" class="row-name">
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
      <van-row :span="4" class="row-start">
        <van-button round class="one-start" @click="start">开始答题</van-button>
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
        <van-button id="btnA" :disable="notClickA" @click="clickA" class="option-button">A</van-button>
        <van-button id="btnB" :disable="notClickB" @click="clickB" class="option-button">B</van-button>
        <van-button id="btnC" :disable="notClickC" @click="clickC" class="option-button">C</van-button>
        <van-button id="btnD" :disable="notClickD" @click="clickD" class="option-button">D</van-button>
        <van-button id="btnE" :disable="notClickE" @click="clickE" class="option-button">E</van-button>
      </van-col>
    </van-row>
    <van-row :span="4" class="row-start">
        <van-button round :disabled="isSubmit" class="two-start" @click="submit">提交</van-button>
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
      questionIndex: 0,
      enableAnswer: false,
      teamAnswer: [], // 存放选手选择的答案
      notClickA: false, // true不可点击
      notClickB: false, // true不可点击
      notClickC: false, // true不可点击
      notClickD: false, // true不可点击
      notClickE: false, // true不可点击
      isSubmit: false // true不可点击
    }
  },
  methods: {
    clickA() {
      if (this.notClickA === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'A') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnA').style.backgroundColor = '#fff'
            document.getElementById('btnA').style.color = '#000'
          }
        }
      } else {
        this.teamAnswer.push('A')
        document.getElementById('btnA').style.backgroundColor = '#f9ab00'
        document.getElementById('btnA').style.color = '#fff'
      }
      this.notClickA = !this.notClickA
      console.log(this.teamAnswer)
    },
    clickB() {
      if (this.notClickB === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'B') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnB').style.backgroundColor = '#fff'
            document.getElementById('btnB').style.color = '#000'
          }
        }
      } else {
        this.teamAnswer.push('B')
        document.getElementById('btnB').style.backgroundColor = '#f9ab00'
        document.getElementById('btnB').style.color = '#fff'
      }
      this.notClickB = !this.notClickB
      console.log(this.teamAnswer)
    },
    clickC() {
      if (this.notClickC === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'C') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnC').style.backgroundColor = '#fff'
            document.getElementById('btnC').style.color = '#000'
          }
        }
      } else {
        this.teamAnswer.push('C')
        document.getElementById('btnC').style.backgroundColor = '#f9ab00'
        document.getElementById('btnC').style.color = '#fff'
      }
      this.notClickC = !this.notClickC
      console.log(this.teamAnswer)
    },
    clickD() {
      if (this.notClickD === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'D') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnD').style.backgroundColor = '#fff'
            document.getElementById('btnD').style.color = '#000'
          }
        }
      } else {
        this.teamAnswer.push('D')
        document.getElementById('btnD').style.backgroundColor = '#f9ab00'
        document.getElementById('btnD').style.color = '#fff'
      }
      this.notClickD = !this.notClickD
      console.log(this.teamAnswer)
    },
    clickE() {
      if (this.notClickE === true) {
        for (var i = 0; i < this.teamAnswer.length; i++) {
          if (this.teamAnswer[i] === 'E') {
            this.teamAnswer.splice(i, 1)
            document.getElementById('btnE').style.backgroundColor = '#fff'
            document.getElementById('btnE').style.color = '#000'
          }
        }
      } else {
        this.teamAnswer.push('E')
        document.getElementById('btnE').style.backgroundColor = '#f9ab00'
        document.getElementById('btnE').style.color = '#fff'
      }
      this.notClickE = !this.notClickE
      console.log(this.teamAnswer)
    },
    tokenLogin() {
      if (this.teamToken !== '') {
        localStorage.setItem('战队口令', this.teamToken)
        this.team.login(this.teamToken)
      } else {
        return false
      }
    },
    start() {
      if (this.teamName !== '') {
        this.team.rename(this.teamName)
        localStorage.setItem('战队名字', this.teamName)
        this.type = 'viewOptions'
      } else {
        return false
      }
    },
    submit() {
      console.log('xuanxiang0' + this.teamAnswer)
      this.teamAnswer.sort()
      console.log('xuanxiang1' + this.teamAnswer)
      this.teamAnswer.join('')
      console.log('xuanxiang' + this.teamAnswer)
      if (this.teamAnswer !== '') {
        this.team.answer(this.teamAnswer, this.questionIndex)
        this.isSubmit = true
      } else {
        return false
      }
    },
    onConnect(data) {
      const {enableAnswer, questionIndex, updateTime, activeTeam, teams} = data
      this.enableAnswer = enableAnswer
      this.questionIndex = questionIndex
      this.updateTime = updateTime
      this.activeTeam = activeTeam
      this.teams = teams
      this.type = 'viewRename'
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
    // onNextQuestion(data) {
    //   const { questionIndex, question, score, updateTime, enableAnswer } = data
    //   this.questionIndex = questionIndex
    //   this.question = question
    //   this.score = score
    //   this.updateTime = updateTime
    //   this.enableAnswer = enableAnswer
    // },
    // onShowAnswer(data) {
    //   const { answer, answers, enableAnswer } = data
    //   this.answer = answer
    //   this.answers = answers
    //   this.enableAnswer = enableAnswer
    // },
    // onChangeScore(data) {
    //   const { teams } = data
    //   this.teams = teams
    // },
    // onEndRace(data) {
    //   const { enableAnswer, closed } = data
    //   this.enableAnswer = enableAnswer
    //   this.closed = closed
    // },
    // onRename(data) {
    //   const { newName, teamToken } = data
    //   this.teamName = newName
    //   if (this.teamToken === teamToken) {
    //     this.type = 'viewOptions'
    //   }
    // },
    onAnswer(data) {
      const { teamToken, activeTeam, enableAnswer } = data
      this.teamToken = teamToken
      this.activeTeam = activeTeam
      this.enableAnswer = enableAnswer
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
  background: lightcoral;
  border: 1px solid #000!important;
  margin: 1.5vh!important;
}
/* .button-option:focus{
  color:#fff;
  background: #f9ab00;
} */
</style>
