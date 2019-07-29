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
      <van-tag color="#cd2323" >参赛口令</van-tag>
    </van-col>
    <van-col :span="15">
      <van-field v-model="teamToken" placeholder="点击输入口令" class="border" />
      </van-col>
  </van-row>
  <van-row  v-show="step==='login'"  style="margin-top:10vh; height:10vh;" >
    <van-button round class="button-click" @click="handleLogin">登录</van-button>
  </van-row>
  <van-row  v-show="step==='ready'"  type="flex" justify="center" style="margin-top:10vh; height:10vh" >
    <van-col :span="5">
      <van-tag color="#cd2323" >参赛名称</van-tag>
    </van-col>
    <van-col :span="15">
        <van-field v-model="teamName" placeholder="给自己队伍起个响当当的名字" class="border" />
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
  <van-row v-show="step==='submit'" style="height:50vh; padding:10px;text-align:left" >
    <div v-html="question"></div>
  </van-row>
  <van-row v-show="step==='submit'" style="height:10vh;" type="flex" justify="space-between" >
    <van-button
      v-for="(option) in options"
      :key="option"
      :disabled="!enableAnswer"
      @click="select(option)"
      :class="checkedOption.indexOf(option) == -1 ? 'option-button':'option-button option-button-active'">
      {{option}}
    </van-button>
  </van-row>
  <van-row v-show="step==='submit'" style="height:10vh; padding:0 10vw 0 10vw">
    <van-field v-model="teamAnswer" class="border" label="答案：" />
  </van-row>
  <van-row v-show="step==='submit'" style="height:10vh;line-height:10vh;" >
    <van-button round :disabled="!enableAnswer" class="button-click" @click="handleAnswer">提交答案</van-button>
  </van-row>
</div>
</template>

<script>
import { Team } from '../client'
export default {
  name: 'Xuanshou',
  data() {
    return {
      step: 'login', // login登录 ready准备答题 submit提交答案
      raceName: '党建知识竞赛',
      teamToken: '',
      teamName: '',
      questionIndex: 0,
      question: '',
      checkedOption: [],
      teamAnswer: '', // 存放选手选择的答案
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
      } else {
        return false
      }
      this.step = 'submit'
    },
    select(option) {
      if (this.checkedOption.indexOf(option) !== -1) {
        this.checkedOption.splice(this.checkedOption.indexOf(option), 1)
      } else {
        this.checkedOption.push(option)
        this.checkedOption.sort()
      }
      this.teamAnswer = this.checkedOption.join('')
    },
    handleAnswer() {
      if (this.teamAnswer !== '') {
        this.team.answer(this.teamAnswer, this.questionIndex)
      } else {
        return false
      }
    },
    onConnect(data) {
      const {enableAnswer, question, questionIndex, updateTime, activeTeam, teams} = data
      if (teams && teams[this.teamToken]) {
        if (teams[this.teamToken]['name']) {
          this.step = 'submit'
        } else {
          this.step = 'ready'
        }
      }
      this.enableAnswer = enableAnswer
      this.questionIndex = questionIndex
      this.question = question
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
      this.teamAnswer = ''
      this.checkedOption = []
    },
    onShowAnswer(data) {
      const { answers, enableAnswer } = data
      this.answers = answers
      this.enableAnswer = enableAnswer
    },
    // onChangeScore(data) {
    //   const { teams } = data
    //   this.teams = teams
    // },
    onEndRace(data) {
      const { enableAnswer, closed } = data
      this.enableAnswer = enableAnswer
      this.closed = closed
    },
    // onRename(data) {
    //   const { newName } = data
    //   this.teamName = newName
    //   this.step = 'submit'
    // },
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
        // case 'changeScore':
        //   self.onChangeScore(data)
        //   break
        case 'endRace':
          self.onEndRace(data)
          break
        // case 'rename': // 后台未返回
        //   self.onRename(data)
        //   break
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
*{
  box-sizing: border-box;
}
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
.border{
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
  font-size: 5vh;
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
  font-size: 20px!important;
  width: 18%;
  height:8vh!important;
  line-height: 8vh!important;
  text-align: center!important;
  border: 1px solid #000!important;
  background: #fff!important;
  color: #000!important;
}
.option-button-active{
  background: #f9ab00!important;
  color: #fff!important;
}
</style>
