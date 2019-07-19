<template>
<el-container class="container">
  <!-- 标题栏 -->
  <el-header height="100px" style="background:rgba(255,255,255,0.1);" >
      <el-col :span="17"  style="font-size: 35px; line-height: 100px;">
        <img src="./images/logo.png" style="vertical-align: middle;">
        {{raceName}}
      </el-col>
      <el-col :span="3" >
        <p>比赛用时</p>
        <p style="font-size: 20px;"><span class="ues-time">{{useTime.minute}}</span>分<span class="ues-time">{{useTime.second}}</span>秒</p>
      </el-col>
      <el-col :span="4" >
        <p>{{holder}}</p>
        <p style="font-size: 20px;">{{currentDate}}</p>
      </el-col>
  </el-header>
  <!-- 主要内容 -->
  <el-main style="padding:20px 20px 15px 20px;">
    <!-- 题目问题 答案 -->
    <el-col :span="12">
      <div class="grid-content grid-content-left">
      <el-row :span="4" class="border title title-question">
        <svg-icon icon-class="file"></svg-icon>题目:{{questionIndex}}
      </el-row>
      <el-row :span="18" id="question-sizeof" class="border opacity question"><div v-html="question"></div></el-row>
      <el-row :span="2" class="border opacity correct-answer">
        <el-col :span="7" class="answer-icon"><svg-icon icon-class="showanswer"></svg-icon>正确答案：</el-col>
        <el-col :span="10" class="answer-icon">
          {{correctAnswer}}
        </el-col>
      </el-row>
    </div>
    </el-col>
    <!-- 各组亮灯 组名 答案 时间 超时 分数情况 -->
    <el-col :span="11" :offset="1"><div class="grid-content grid-content-right">
      <el-row :span="4" class="border title title-group">
        <svg-icon icon-class="group"></svg-icon>各组战况</el-row>
      <el-row class="right-bottom">
        <table class="table table-striped table-inverse table-bordered">
            <thead class="thead-inverse">
                <tr>
                    <th>排名</th>
                    <th>组名</th>
                    <th>分数</th>
                    <th>答案</th>
                </tr>
            </thead>
            <transition-group name="flip-list" tag="tbody">
                <tr :class="{'is-active':(item.teamToken === activeTeam)}" v-for="(item,index) in tableData" :key="item.teamToken">
                    <td>{{index + 1}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.score}}</td>
                    <td>{{item.answer}}</td>
                </tr>
            </transition-group>
        </table>
      </el-row>
    </div></el-col>
  </el-main>
</el-container>
</template>

<script>
import { setInterval, clearInterval} from 'timers'
import {Screen} from '../client'
export default {
  name: 'screen',
  data() {
    return {
      holder: '等待主持人输入主办方',
      currentDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
      useTime: {
        minute: '00',
        second: '00'
      },
      raceName: '等待主持人输入比赛名称',
      beginTime: '', //
      correctAnswer: '',
      teamAnswer: '',
      questionIndex: '',
      question: '',
      tableData: [],
      timer: '',
      activeTeam: ''
    }
  },
  methods: {
    computeTime() {
      var self = this
      this.timer = setInterval(() => {
        const newTime = new Date().getTime()
        var mss = newTime - self.beginTime
        const m = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)) // 得到分钟数
        const s = (mss % (1000 * 60)) / 1000 // 得到秒数
        const minutes = Math.floor(m)
        const seconds = Math.floor(s)
        self.useTime.minute = minutes < 10 ? ('0' + minutes) : minutes
        self.useTime.second = seconds < 10 ? ('0' + seconds) : seconds
      }, 1000)
    },
    tableRowClassName({row, rowIndex}) {
      if (row.index && row.index === 1) {
        return 'warning-row'
      }
    },
    onConnect(data) {
      const {raceName, beginTime, questionIndex, question, activeTeam, teams} = data
      if (raceName) this.raceName = raceName
      if (beginTime) {
        this.beginTime = beginTime
        this.computeTime()
      }
      if (questionIndex) this.questionIndex = questionIndex
      if (question) this.question = question
      if (activeTeam) this.activeTeam = activeTeam
      if (teams) {
        for (var i in teams) {
          this.tableData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: ''})
        }
        this.tableData.sort((x, y) => {
          return y['score'] - x['score']
        })
      }
      console.log(data)
    },
    onInitRace(data) {
      const {raceName, holder} = data
      this.raceName = raceName
      this.holder = holder
    },
    onBeginRace(data) {
      const { beginTime} = data
      this.beginTime = beginTime
      this.computeTime()
    },
    onNextQuestion(data) {
      const { questionIndex, question } = data
      this.questionIndex = questionIndex
      this.question = question
      this.correctAnswer = ''
      this.activeTeam = undefined
    },
    onShowAnswer(data) {
      const { answer, answers } = data
      this.correctAnswer = answer
      this.tableData.forEach((v, i) => {
        this.tableData[i]['answer'] = answers[v.teamToken]['answer']
      })
    },
    onChangeScore(data) {
      const { teamToken, newValue } = data
      // var _table =
      this.tableData.forEach((v, i) => {
        if (parseInt(v.teamToken) === teamToken) {
          this.tableData[i]['score'] = newValue
        }
      })
      this.tableData.sort((x, y) => {
        return y['score'] - x['score']
      })
    },
    onEndRace(data) {
      this.screen.quit()
      clearInterval(this.timer)
    },
    onRename(data) {
      const {token, name} = data
      this.tableData.forEach((v, i) => {
        if (v.teamToken === token) {
          this.tableData[i]['name'] = name
        }
      })
      // const { teams} = data
      // this.tableData = []
      // for (var i in teams) {
      //   this.tableData.push({name: teams[i]['name'], score: teams[i]['score'], teamToken: i, answer: ''})
      // }
    },
    onAnswer(data) {
      const { activeTeam, teamToken } = data
      this.activeTeam = activeTeam
      this.tableData.forEach((v, i) => {
        if (v.teamToken === teamToken) {
          this.tableData[i]['answer'] = '****'
        }
      })
    }
  },
  mounted() {
    this.screen = new Screen()
    const self = this
    this.screen.onmessage = function(resp) {
      console.log('this is screen onmessage')
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
    this.screen.login()
  },
  watch: {
  }
}
</script>

<style>
body{
  margin:0;
  width: 1280px;
  height: 720px;
}
.container{
  background: url('./images/back.png');
  background-size: 100% 100%;
  color: #fff;
}
.ues-time{
  color: #ff0000;
  background:#fff;
  margin-top: 0;
}
.grid-content{
  /* margin: 20px 20px auto 20px; */
  padding-bottom: 30px;
}
.border{
  border:1px solid #CD2323;
}
.title{
  border-top-right-radius:5px;
  border-top-left-radius:5px;
  background: #CD2323;
  height: 35px;
  padding-top:10px;
}
.opacity{
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
  padding: 20px 20px;
  background:rgba(255,255,255,0.1);
}
.question{
  height: 470px;
  margin-bottom: 20px;
  font-size: 24px;
}
.svg-icon{
  margin-right: 5px;
  margin-left:10px;
  font-size: 20px;
}
.correct-answer{
  padding: 0px;
  border-radius: 5px;
  height: 60px;
}
.right-bottom{
  padding: 20px 20px;
  border-bottom-right-radius:5px;
  border-bottom-left-radius:5px;
  height: 550px;
  background:rgba(255,255,255,0.1);
}
.el-table .warning-row {
  background: #F9AB00;
}
.el-table .success-row {
background:rgba(255,255,255,0.1);
}
.table{
  width: 100%;
  border-radius: 0px;
  padding: 0;
}
.el-table__row{
  height: 70px;
}
th{
  height: 50px;
}
.answer-icon{
 padding: 20px;
 font-size: 15px;
}
/* .flip-list-move,.flip-list-enter-active, .flip-list-leave-active {transition: 1s;}
.flip-list-leave-active{position:absolute;}
.flip-list-enter, .flip-list-leave-to{opacity: 0;transform: translateY(30px);} */
td{
  text-align: center;
}
table tr {
    font-size: 20px;
    height: 80px;
}
.flip-list-move{
  transition: transform 1s;
}
.is-active{
  background:rgba(0,0,0,.1);
}
</style>
